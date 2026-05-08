"use client";

import { memo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { getTradingViewSymbol } from "@/lib/utils";

interface StockProfileProps {
  symbol: string;
  exchange: string;
}

function StockProfile({ symbol, exchange }: StockProfileProps) {
  const tvSymbol = getTradingViewSymbol(symbol, exchange);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
      <div className="px-5 pt-5 pb-0">
        <h3 className="text-base font-semibold text-yellow-400">
          {symbol} Profile
        </h3>
      </div>
      <TradingViewWidget
        scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js"
        config={{
          width: "100%",
          height: 480,
          isTransparent: true,
          symbol: tvSymbol,
          colorTheme: "dark",
          locale: "en",
        }}
        height={480}
      />
    </div>
  );
}

export default memo(StockProfile);
