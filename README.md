# Signalist

A real-time stock market tracking app with AI-powered daily news digests, personalized watchlists, and detailed company insights.

**Live Demo:** [signalist.vercel.app](#) <!-- Replace with your Vercel URL after deploy -->

![Dashboard Preview](public/assets/images/dashboard.png)

## Features

- **Stock Search** — Search any ticker with CMD+K, backed by the Finnhub API with debounced live results
- **Watchlist** — Add and manage stocks in a personal watchlist with one click from anywhere in the app
- **Stock Detail Pages** — Full company profile, real-time quote, financial metrics (EPS, P/E, margins, cash flow), and TradingView charts
- **AI Daily News Digest** — Personalized market news emails sent twice a day, summarized by Gemini AI and tailored to each user's watchlist
- **Personalized Welcome Email** — On sign-up, Gemini generates a personalized intro based on the user's investment goals, risk tolerance, and preferred sectors
- **Authentication** — Email/password auth with session middleware and fully protected routes

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | Better Auth |
| Background Jobs | Inngest |
| AI | Google Gemini 2.5 Flash |
| Stock Data | Finnhub API |
| Charts | TradingView Widgets |
| Email | Nodemailer (Gmail) |
| UI | shadcn/ui + Tailwind CSS v4 |

## Getting Started

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- [Finnhub](https://finnhub.io) API key (free tier works)
- [Google Gemini](https://aistudio.google.com) API key
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) enabled
- An [Inngest](https://www.inngest.com) account for background jobs

### Installation

```bash
git clone https://github.com/ahmedabubakr92/real-time-stock-market-app.git
cd real-time-stock-market-app
npm install
cp .env.example .env.local
# fill in .env.local with your values
npm run dev
```

In a separate terminal, start the Inngest dev server (required for background jobs locally):

```bash
npx inngest-cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [.env.example](.env.example) for the full list with descriptions.

## Deployment (Vercel)

1. Push the repo to GitHub and import it in Vercel
2. Add all variables from `.env.example` in the Vercel dashboard
3. Set `NEXT_PUBLIC_BASE_URL` and `BETTER_AUTH_URL` to your Vercel deployment URL
4. **Do not set `INNGEST_DEV`** — omit it entirely so Inngest runs in cloud mode
5. Connect your Inngest project to the deployed app via the [Inngest dashboard](https://app.inngest.com)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign-in and sign-up pages
│   ├── (root)/          # Protected pages: dashboard, watchlist, stock detail
│   └── api/inngest/     # Inngest webhook handler
├── components/
│   ├── stock/           # Stock-specific UI components
│   └── ui/              # shadcn/ui primitives
├── database/
│   ├── mongoose.ts      # DB connection with connection caching
│   └── models/          # Mongoose schemas (watchlist)
├── lib/
│   ├── actions/         # Server actions: auth, watchlist, Finnhub data fetching
│   ├── better-auth/     # Auth configuration
│   ├── inngest/         # Background job functions and AI prompts
│   └── nodemailer/      # Email transport and HTML templates
└── types/
    └── global.d.ts      # Shared TypeScript types
```

## License

MIT
