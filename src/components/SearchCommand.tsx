"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";
import WatchlistButton from "@/components/stock/WatchlistButton";

export default function SearchCommand({
  renderAs = "button",
  label = "Search",
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  // Local watchlist set so star state stays correct across searches
  const [watchlistSymbols, setWatchlistSymbols] = useState<Set<string>>(
    () => new Set(initialStocks.filter((s) => s.isInWatchlist).map((s) => s.symbol)),
  );

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleSearch() {
    if (!isSearchMode) return setStocks(initialStocks);
    setLoading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, debouncedSearch]);

  function handleSelectStock() {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  function handleWatchlistChange(symbol: string, isAdded: boolean) {
    setWatchlistSymbols((prev) => {
      const next = new Set(prev);
      if (isAdded) next.add(symbol);
      else next.delete(symbol);
      return next;
    });
  }

  return (
    <>
      {renderAs === "text" ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="search-field">
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search stocks..."
            className="search-input"
          />
          {loading && <Loader2 className="search-loader" />}
        </div>

        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? "No results found" : "No stocks available"}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? "Search results" : "Popular stocks"}
                {" "}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock) => (
                <li key={stock.symbol} className="search-item">
                  {/* Star is outside the Link so clicking it won't navigate */}
                  <div className="search-item-link">
                    <Link
                      href={`/stocks/${stock.symbol}`}
                      onClick={handleSelectStock}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <TrendingUp className="h-4 w-4 text-gray-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="search-item-name truncate">{stock.name}</div>
                        <div className="text-sm text-gray-500">
                          {stock.symbol} | {stock.exchange} | {stock.type}
                        </div>
                      </div>
                    </Link>
                    <WatchlistButton
                      symbol={stock.symbol}
                      company={stock.name}
                      isInWatchlist={watchlistSymbols.has(stock.symbol)}
                      type="icon"
                      onWatchlistChange={handleWatchlistChange}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
