"use client";

import { memo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { getTradingViewSymbol } from "@/lib/utils";

interface TechnicalAnalysisWidgetProps {
  symbol: string;
  exchange: string;
}

function TechnicalAnalysisWidget({ symbol, exchange }: TechnicalAnalysisWidgetProps) {
  const tvSymbol = getTradingViewSymbol(symbol, exchange);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
      <div className="px-4 pt-4 pb-0">
        <h3 className="text-base font-semibold text-yellow-400">
          Technical Analysis for{" "}
          <span className="text-yellow-400">{symbol}</span>
        </h3>
      </div>
      <TradingViewWidget
        scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
        config={{
          interval: "1m",
          width: "100%",
          isTransparent: true,
          height: 350,
          symbol: tvSymbol,
          showIntervalTabs: true,
          displayMode: "single",
          locale: "en",
          colorTheme: "dark",
        }}
        height={350}
      />
    </div>
  );
}

export default memo(TechnicalAnalysisWidget);
