"use client";

import { memo } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { getTradingViewSymbol } from "@/lib/utils";

interface StockChartProps {
  symbol: string;
  exchange: string;
  range?: string;
  height?: number;
}

function StockChart({ symbol, exchange, range = "6M", height = 500 }: StockChartProps) {
  const tvSymbol = getTradingViewSymbol(symbol, exchange);

  return (
    <TradingViewWidget
      scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      config={{
        autosize: true,
        symbol: tvSymbol,
        interval: "D",
        range,
        timezone: "Asia/Dubai",
        theme: "dark",
        style: "1",
        locale: "en",
        backgroundColor: "#141414",
        gridColor: "rgba(0,0,0,0)",
        enable_publishing: false,
        allow_symbol_change: false,
        support_host: "https://www.tradingview.com",
      }}
      height={height}
      className="custom-chart"
    />
  );
}

export default memo(StockChart);
