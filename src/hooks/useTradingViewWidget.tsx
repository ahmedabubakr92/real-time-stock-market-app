"use client";

import { useEffect, useRef } from "react";

export default function useTradingViewWidget(
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset.loaded) return;
    containerRef.current.innerHTML = `
        <div class="tradingview-widget-container__widget" 
            style="width:100%; height:${height}px">
        </div>`;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    script.onload = () => {
      if (containerRef.current) containerRef.current.dataset.loaded = "true";
    };
    script.onerror = () => {
      if (containerRef.current) delete containerRef.current.dataset.loaded;
    };

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        delete containerRef.current.dataset.loaded;
      }
    };
  }, [scriptUrl, config, height]);

  return containerRef;
}
