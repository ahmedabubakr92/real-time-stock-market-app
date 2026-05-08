import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/stock/WatchlistButton";
import { isSymbolInWatchlist } from "@/lib/actions/watchlist.actions";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

export default async function StockPage({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const upper = symbol.toUpperCase();
  const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

  const inWatchlist = await isSymbolInWatchlist(upper).catch(() => false);

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Left column — 2/3 width to match 912px design ratio */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(upper)}
            height={170}
          />
          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(upper)}
            className="custom-chart"
            height={600}
          />
          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(upper)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column — 1/3 width to match 448px design ratio */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <WatchlistButton
            symbol={upper}
            company={upper}
            isInWatchlist={inWatchlist}
          />
          <TradingViewWidget
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(upper)}
            height={400}
          />
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(upper)}
            height={440}
          />
          <TradingViewWidget
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(upper)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}
