"use server";

import {
  formatArticle,
  getDateRange,
  validateArticle,
  calculateNewsDistribution,
} from "@/lib/utils";
import { POPULAR_STOCK_SYMBOLS } from "@/lib/constants";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

async function fetchJSON<T = unknown>(url: string, revalidateSeconds?: number): Promise<T> {
  const options: RequestInit = revalidateSeconds
    ? { cache: "force-cache", next: { revalidate: revalidateSeconds } }
    : { cache: "no-store" };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(
      `Finnhub API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export async function getNews(
  symbols?: string[],
): Promise<MarketNewsArticle[]> {
  if (!FINNHUB_API_KEY) {
    throw new Error("Finhub API key is not set");
  }

  const { from, to } = getDateRange(5);

  try {
    if (symbols && symbols.length > 0) {
      // symbols path - personalized news
      const cleanSymbols = symbols
        .map((symbol) => symbol.toUpperCase().trim())
        .filter(Boolean);

      const { itemsPerSymbol, targetNewsCount } = calculateNewsDistribution(
        cleanSymbols.length,
      );

      // Fetch symbols in batches of 5 to stay within Finnhub's 30 req/s rate limit.
      // allSettled keeps partial results so one failed symbol doesn't discard the others.
      const MAX_CONCURRENT = 5;
      const cachedEntries: Array<readonly [string, RawNewsArticle[]]> = [];

      for (let i = 0; i < cleanSymbols.length; i += MAX_CONCURRENT) {
        const batch = cleanSymbols.slice(i, i + MAX_CONCURRENT);
        const settled = await Promise.allSettled(
          batch.map(async (symbol) => {
            const data: RawNewsArticle[] = await fetchJSON(
              `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`,
            );
            return [symbol, data.filter(validateArticle)] as const;
          }),
        );
        cachedEntries.push(
          ...settled
            .filter(
              (
                result,
              ): result is PromiseFulfilledResult<
                readonly [string, RawNewsArticle[]]
              > => result.status === "fulfilled",
            )
            .map((result) => result.value),
        );
      }

      const newsCache = new Map(cachedEntries);

      const articles: MarketNewsArticle[] = [];

      for (let round = 0; round < itemsPerSymbol; round++) {
        for (const symbol of cleanSymbols) {
          if (articles.length >= targetNewsCount) break;

          const validArticles = newsCache.get(symbol) ?? [];
          const article = validArticles[round];

          if (!article) continue;

          articles.push(formatArticle(article, true, symbol, articles.length));
        }

        if (articles.length >= targetNewsCount) break;
      }

      articles.sort((a, b) => b.datetime - a.datetime);
      return articles.length > 0 ? articles : await getNews();
    } else {
      // general news path
      const data: RawNewsArticle[] = await fetchJSON(
        `${FINNHUB_BASE_URL}/news?category=general&token=${FINNHUB_API_KEY}`,
      );

      const seenIds = new Set<string>();
      const seenUrls = new Set<string>();
      const seenHeadlines = new Set<string>();
      const articles: MarketNewsArticle[] = [];

      for (const article of data) {
        if (!validateArticle(article)) continue;

        const id = String(article.id);
        const url = article.url ?? "";
        const headline = article.headline?.toLowerCase().trim() ?? "";

        if (
          seenIds.has(id) ||
          (url && seenUrls.has(url)) ||
          (headline && seenHeadlines.has(headline))
        )
          continue;

        seenIds.add(id);
        if (url) seenUrls.add(url);
        if (headline) seenHeadlines.add(headline);

        articles.push(
          formatArticle(article, false, undefined, articles.length),
        );

        if (articles.length >= 6) break;
      }
      return articles;
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    throw new Error("Failed to fetch news");
  }
}

export async function searchStocks(
  query?: string,
): Promise<StockWithWatchlistStatus[]> {
  if (!FINNHUB_API_KEY) {
    console.error("FINNHUB Api Key is not set");
    return [];
  }

  try {
    const trimmed = query?.trim() ?? "";

    if (!trimmed) {
      const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
      const results = await Promise.allSettled(
        top.map(async (symbol) => {
          const data = await fetchJSON<any>(
            `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
            3600,
          );
          return { symbol, data };
        }),
      );

      return results
        .filter(
          (r): r is PromiseFulfilledResult<any> => r.status === "fulfilled",
        )
        .map(({ value: { symbol, data } }) => ({
          symbol: symbol.toUpperCase(),
          name: data?.name || symbol,
          exchange: data?.exchange || "US",
          type: "Common Stock",
          isInWatchlist: false,
        }))
        .filter((s) => s.name !== s.symbol);
    }

    const data = await fetchJSON<FinnhubSearchResponse>(
      `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${FINNHUB_API_KEY}`,
      1800,
    );

    return (data?.result ?? []).slice(0, 15).map((r) => ({
      symbol: r.symbol.toUpperCase(),
      name: r.description || r.symbol,
      exchange: r.displaySymbol || "US",
      type: r.type || "Stock",
      isInWatchlist: false,
    }));
  } catch (e) {
    console.error("Error searching stocks:", e);
    return [];
  }
}
