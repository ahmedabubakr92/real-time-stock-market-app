import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateRange(days: number) {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days);
  return {
    to: toDate.toISOString().split("T")[0],
    from: fromDate.toISOString().split("T")[0],
  };
}

export function validateArticle(article: RawNewsArticle): boolean {
  return !!(
    article.headline &&
    article.summary &&
    article.url &&
    article.datetime
  );
}

export function formatArticle(
  article: RawNewsArticle,
  isCompanyNews: boolean,
  symbol?: string,
  index: number = 0,
) {
  return {
    id: isCompanyNews ? Date.now() + Math.random() : article.id + index,
    headline: article.headline!.trim(),
    summary:
      article.summary!.trim().substring(0, isCompanyNews ? 200 : 150) + "...",
    source: article.source || (isCompanyNews ? "Company News" : "Market News"),
    url: article.url!,
    datetime: article.datetime!,
    image: article.image || "",
    category: isCompanyNews ? "company" : article.category || "general",
    related: isCompanyNews ? symbol! : article.related || "",
  };
}

export function calculateNewsDistribution(symbolsCount: number) {
  let itemsPerSymbol: number;
  let targetNewsCount = 6;

  if (symbolsCount < 3) {
    itemsPerSymbol = 3; // Fewer symbols, more news each
  } else if (symbolsCount === 3) {
    itemsPerSymbol = 2; // Exactly 3 symbols, 2 news each = 6 total
  } else {
    itemsPerSymbol = 1; // Many symbols, 1 news each
    targetNewsCount = 6; // Don't exceed 6 total
  }

  return { itemsPerSymbol, targetNewsCount };
}

export function buildSymbolGroups(
  usersWithSymbols: Array<{ user: User; symbols: string[] }>,
): Array<{ fingerprint: string; symbols: string[]; users: User[] }> {
  const groupMap = new Map<string, { symbols: string[]; users: User[] }>();

  for (const { user, symbols } of usersWithSymbols) {
    const sorted = [...symbols].sort();
    const fingerprint = sorted.join("|"); // "" for users with no watchlist → general news

    if (!groupMap.has(fingerprint)) {
      groupMap.set(fingerprint, { symbols: sorted, users: [] });
    }
    groupMap.get(fingerprint)!.users.push(user);
  }

  return Array.from(groupMap.values());
}

// Converts a Finnhub million-denominated value to a human-readable string
// e.g. 3_372_840 → "3.37T", 408_630 → "408.63B", 56_270 → "56.27B"
export function formatMillions(value: number | null): string {
  if (value === null || value === undefined) return "N/A";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}T`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(2)}B`;
  return `${sign}${abs.toFixed(2)}M`;
}

export function formatMetric(value: number | null, suffix = "", decimals = 2): string {
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(decimals)}${suffix}`;
}

// Maps Finnhub exchange names to the TradingView prefix format
export function getTradingViewSymbol(symbol: string, exchange: string): string {
  const ex = exchange.toUpperCase();
  if (ex.includes("NASDAQ")) return `NASDAQ:${symbol}`;
  if (ex.includes("NEW YORK") || ex === "NYSE") return `NYSE:${symbol}`;
  if (ex.includes("AMEX") || ex.includes("AMERICAN")) return `AMEX:${symbol}`;
  return symbol;
}

export function getFormattedTodayDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dubai",
  });
}
