import { inngest } from "@/lib/inngest/client";
import {
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
  NEWS_SUMMARY_EMAIL_PROMPT,
} from "@/lib/inngest/prompts";
import { sendWelcomeEmail, sendNewsEmail } from "@/lib/nodemailer";
import { getAllUsersForNewsEmail } from "@/lib/actions/user.actions";
import { getWatchlistSymbolsBulk } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import { buildSymbolGroups, getFormattedTodayDate } from "@/lib/utils";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email", triggers: [{ event: "app/user.created" }] },
  async ({ event, step }) => {
    const userProfile = `
      - Country: ${event.data.country}
      - Investment goals: ${event.data.investmentGoals}
      - Risk Tolerance: ${event.data.riskTolerance}
      - Preferred industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile,
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    const part = response.candidates[0].content.parts[0];

    await step.run("send-welcome-email", async () => {
      const introText =
        (part && "text" in part ? part.text : null) ??
        "Thanks for joining Signalist. You now have the tools to track markets and make smarter decisions.";

      const {
        data: { email, name },
      } = event;

      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  },
);

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: "daily-news-summary",
    triggers: [
      { event: "app/send.daily.news" },
      { cron: "0 5 * * 1-5" },
      { cron: "0 13 * * 1-5" }, // 17:00 UAE
      { cron: "0 21 * * 0-4" }, // 01:00 UAE (next day = Sun-Thu nights)
    ],
  },
  async ({ step }) => {
    // Step 1: Fetch all users then bulk-query their watchlist symbols in one DB round trip
    const usersWithSymbols = await step.run(
      "get-users-with-symbols",
      async (): Promise<Array<{ user: User; symbols: string[] }>> => {
        const users = await getAllUsersForNewsEmail();
        if (!users || users.length === 0) return [];

        const symbolsByUserId = await getWatchlistSymbolsBulk(
          users.map((u) => u.id),
        );

        return users.map((user) => ({
          user,
          symbols: symbolsByUserId.get(user.id) ?? [],
        }));
      },
    );

    if (usersWithSymbols.length === 0) {
      return { success: false, message: "No users found for news email" };
    }

    // Step 2: Group users who share the same symbol set — pure computation, no async needed
    // fingerprint "" means no watchlist → gets general news
    const groups = buildSymbolGroups(usersWithSymbols);

    // Steps 3-5: Per unique group — one Finnhub fetch, one Gemini call, one send per user
    for (const group of groups) {
      const stepKey = group.fingerprint || "general";

      const news = await step.run(`fetch-news-${stepKey}`, async () => {
        return await getNews(
          group.symbols.length > 0 ? group.symbols : undefined,
        );
      });

      if (!news || news.length === 0) continue;

      // One AI call for the entire group — calculateNewsDistribution is preserved inside getNews
      const response = await step.ai.infer(`summarize-${stepKey}`, {
        model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
        body: {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: NEWS_SUMMARY_EMAIL_PROMPT.replaceAll(
                    "{{newsData}}",
                    JSON.stringify(news),
                  ),
                },
              ],
            },
          ],
        },
      });

      // Send to every user in this group — same summary, parallel sends
      await step.run(`send-emails-${stepKey}`, async () => {
        const part = response.candidates[0].content.parts[0];
        const newsContent =
          (part && "text" in part ? part.text : null) ??
          "<p>No summary available today.</p>";
        const date = getFormattedTodayDate() as string;

        await Promise.all(
          group.users.map((user) =>
            sendNewsEmail({
              email: user.email,
              name: user.name,
              newsContent,
              date,
            }),
          ),
        );
      });
    }

    return { success: true, message: "Daily news summary sent" };
  },
);
