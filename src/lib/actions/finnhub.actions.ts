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

export async function getStockProfile(symbol: string): Promise<StockProfile | null> {
  if (!FINNHUB_API_KEY) return null;
  const encodedSymbol = encodeURIComponent(symbol.trim().toUpperCase());
  try {
    const data = await fetchJSON<Record<string, unknown>>(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodedSymbol}&token=${FINNHUB_API_KEY}`,
      3600,
    );
    if (!data?.name) return null;
    return {
      symbol: symbol.toUpperCase(),
      name: String(data.name),
      logo: String(data.logo ?? ""),
      exchange: String(data.exchange ?? ""),
      industry: String(data.finnhubIndustry ?? ""),
      marketCap: Number(data.marketCapitalization ?? 0),
      shares: Number(data.shareOutstanding ?? 0),
      ipo: String(data.ipo ?? ""),
      country: String(data.country ?? ""),
      website: String(data.weburl ?? ""),
      currency: String(data.currency ?? "USD"),
    };
  } catch (e) {
    console.error("Error fetching stock profile:", e);
    return null;
  }
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  if (!FINNHUB_API_KEY) return null;
  const encodedSymbol = encodeURIComponent(symbol.trim().toUpperCase());
  try {
    const data = await fetchJSON<Record<string, number>>(
      `${FINNHUB_BASE_URL}/quote?symbol=${encodedSymbol}&token=${FINNHUB_API_KEY}`,
    );
    if (typeof data?.c !== "number") return null;
    return {
      price: data.c,
      change: data.d ?? 0,
      percentChange: data.dp ?? 0,
      high: data.h ?? 0,
      low: data.l ?? 0,
      open: data.o ?? 0,
      prevClose: data.pc ?? 0,
      timestamp: data.t ?? 0,
    };
  } catch (e) {
    console.error("Error fetching stock quote:", e);
    return null;
  }
}

export async function getStockMetrics(symbol: string): Promise<StockMetrics> {
  const empty: StockMetrics = {
    eps: null, peRatio: null, dividendYield: null, nextEarningsDate: null,
    enterpriseValue: null, evToEbitda: null, psRatio: null, pbRatio: null,
    pcfRatio: null, pfcfRatio: null, grossMargin: null, operatingMargin: null,
    pretaxMargin: null, netMargin: null, returnOnAssets: null, returnOnEquity: null,
    operatingCashFlow: null, investingCashFlow: null, financingCashFlow: null,
    capex: null, totalRevenue: null, volume: null,
  };
  if (!FINNHUB_API_KEY) return empty;
  const encodedSymbol = encodeURIComponent(symbol.trim().toUpperCase());
  try {
    const data = await fetchJSON<{ metric: Record<string, unknown> }>(
      `${FINNHUB_BASE_URL}/stock/metric?symbol=${encodedSymbol}&metric=all&token=${FINNHUB_API_KEY}`,
      3600,
    );
    const m = data?.metric ?? {};
    const n = (key: string): number | null => {
      const v = m[key];
      return typeof v === "number" ? v : null;
    };
    return {
      eps: n("epsBasicExclExtraTTM"),
      peRatio: n("peBasicExclExtraTTM"),
      dividendYield: n("dividendYieldIndicatedAnnual"),
      nextEarningsDate: typeof m.nextEarningsDate === "string" ? m.nextEarningsDate : null,
      enterpriseValue: n("enterpriseValue"),
      evToEbitda: n("enterpriseValueOverEBITDA"),
      psRatio: n("psTTM"),
      pbRatio: n("pbRatioAnnual"),
      pcfRatio: n("pcfShareAnnual"),
      pfcfRatio: n("pfcfShareAnnual"),
      grossMargin: n("grossMarginTTM"),
      operatingMargin: n("operatingMarginAnnual"),
      pretaxMargin: n("pretaxMarginTTM"),
      netMargin: n("netMarginTTM"),
      returnOnAssets: n("roaRfy"),
      returnOnEquity: n("roeRfy"),
      operatingCashFlow: n("operatingCashFlowAnnual"),
      investingCashFlow: n("investingCashFlowAnnual"),
      financingCashFlow: n("financingCashFlowAnnual"),
      capex: n("capitalExpenditureAnnual"),
      totalRevenue: n("revenueAnnual"),
      volume: n("10DayAverageTradingVolume"),
    };
  } catch (e) {
    console.error("Error fetching stock metrics:", e);
    return empty;
  }
}
