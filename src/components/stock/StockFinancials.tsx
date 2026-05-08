"use client";

import { memo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { getTradingViewSymbol } from "@/lib/utils";

interface StockFinancialsProps {
  symbol: string;
  exchange: string;
}

function StockFinancials({ symbol, exchange }: StockFinancialsProps) {
  const tvSymbol = getTradingViewSymbol(symbol, exchange);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
      <div className="px-5 pt-5 pb-0">
        <h3 className="text-base font-semibold text-yellow-400">
          {symbol} Financials
        </h3>
      </div>
      <TradingViewWidget
        scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-financials.js"
        config={{
          isTransparent: true,
          largeChartUrl: "",
          displayMode: "regular",
          width: "100%",
          height: 650,
          colorTheme: "dark",
          symbol: tvSymbol,
          locale: "en",
        }}
        height={650}
      />
    </div>
  );
}

export default memo(StockFinancials);
