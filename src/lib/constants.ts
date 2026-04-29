export const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Search" },
  { href: "/watchlist", label: "Watchlist" },
];

// TradingView Charts
export const MARKET_OVERVIEW_WIDGET_CONFIG = {
  colorTheme: "dark", // dark mode
  dateRange: "12M", // last 12 months
  locale: "en", // language
  largeChartUrl: "", // link to a large chart if needed
  isTransparent: true, // makes background transparent
  showFloatingTooltip: true, // show tool tip on hover
  plotLineColorGrowing: "#0FEDBE", // line color when price goes up
  plotLineColorFalling: "#0FEDBE", // line color when price falls
  gridLineColor: "rgba(240, 243, 250, 0)", // grid line color
  scaleFontColor: "#DBDBDB", // font color for scale
  belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)", // fill under line when growing
  belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)", // fill under line when falling
  belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
  belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
  symbolActiveColor: "rgba(15, 237, 190, 0.05)", // highlight color for active symbol
  tabs: [
    {
      title: "Large Cap",
      symbols: [
        { s: "NASDAQ:NVDA", d: "Nvidia" },
        { s: "NASDAQ:AAPL", d: "Apple" },
        { s: "NASDAQ:MSFT", d: "Microsoft" },
        { s: "NASDAQ:GOOGL", d: "Alphabet" },
        { s: "NASDAQ:AMZN", d: "Amazon" },
        { s: "NASDAQ:META", d: "Meta" },
        { s: "NASDAQ:TSLA", d: "Tesla" },
      ],
    },
    {
      title: "Growth",
      symbols: [
        { s: "NASDAQ:PLTR", d: "Palantir" },
        { s: "NASDAQ:AVGO", d: "Broadcom" },
        { s: "NASDAQ:AMD", d: "AMD" },
        { s: "NASDAQ:RKLB", d: "Rocket Lab" },
        { s: "NASDAQ:MU", d: "Micron" },
        { s: "NYSE:TSM", d: "Taiwan Semi" },
      ],
    },
    {
      title: "Financials",
      symbols: [
        { s: "NYSE:JPM", d: "JPMorgan Chase" },
        { s: "NYSE:GS", d: "Goldman Sachs" },
        { s: "NYSE:V", d: "Visa" },
        { s: "NYSE:MA", d: "Mastercard" },
        { s: "NYSE:BLK", d: "BlackRock" },
        { s: "NYSE:BAC", d: "Bank of America" },
      ],
    },
    {
    title: "Commodities",
    symbols: [
        { s: "TVC:GOLD", d: "Gold" },
        { s: "TVC:SILVER", d: "Silver" },
        { s: "TVC:USOIL", d: "Crude Oil" },      // free alternative to NYMEX:CL1!
        { s: "CAPITALCOM:NATURALGAS", d: "Natural Gas"  },    // free alternative to NYMEX:NG1!
        { s: "CAPITALCOM:COPPER", d: "Copper" },         // free alternative to COMEX:HG1!
        { s: "CAPITALCOM:WHEAT", d: "Wheat" },
    ],
},
    {
      title: "Crypto",
      symbols: [
        { s: "BINANCE:BTCUSDT", d: "Bitcoin" },
        { s: "BINANCE:ETHUSDT", d: "Ethereum" },
        { s: "BINANCE:SOLUSDT", d: "Solana" },
        { s: "BINANCE:BNBUSDT", d: "BNB" },
        { s: "BINANCE:XRPUSDT", d: "XRP" },
        { s: "BINANCE:LINKUSDT", d: "Chainlink" },
      ],
    },
  ],
  support_host: "https://www.tradingview.com", // TradingView host
  backgroundColor: "#141414", // background color
  width: "100%", // full width
  height: 600, // height in px
  showSymbolLogo: true, // show logo next to symbols
  showChart: true, // display mini chart
};

export const HEATMAP_WIDGET_CONFIG = {
    dataSource: 'SPX500',
    blockSize: 'market_cap_basic',
    blockColor: 'change',
    grouping: 'sector',
    isTransparent: true,
    locale: 'en',
    symbolUrl: '',
    colorTheme: 'dark',
    exchanges: [],
    hasTopBar: false,
    isDataSetEnabled: false,
    isZoomEnabled: true,
    hasSymbolTooltip: true,
    isMonoSize: false,
    width: '100%',
    height: '600',
};

export const TOP_STORIES_WIDGET_CONFIG = {
    displayMode: 'regular',
    feedMode: 'market',
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'en',
    market: 'stock',
    width: '100%',
    height: '600',
};

export const MARKET_DATA_WIDGET_CONFIG = {
  title: "Market Quotes",
  width: "100%",
  height: 600,
  locale: "en",
  showSymbolLogo: true,
  colorTheme: "dark",
  isTransparent: false,
  backgroundColor: "#141414",
  symbolsGroups: [
    {
      name: "Large Cap",
      symbols: [
        { name: "NASDAQ:NVDA", displayName: "Nvidia" },
        { name: "NASDAQ:AAPL", displayName: "Apple" },
        { name: "NASDAQ:MSFT", displayName: "Microsoft" },
        { name: "NASDAQ:GOOGL", displayName: "Alphabet" },
        { name: "NASDAQ:AMZN", displayName: "Amazon" },
        { name: "NASDAQ:META", displayName: "Meta" },
        { name: "NASDAQ:TSLA", displayName: "Tesla" },
      ],
    },
    {
      name: "Growth",
      symbols: [
        { name: "NASDAQ:PLTR", displayName: "Palantir" },
        { name: "NASDAQ:AVGO", displayName: "Broadcom" },
        { name: "NASDAQ:AMD", displayName: "AMD" },
        { name: "NASDAQ:RKLB", displayName: "Rocket Lab" },
        { name: "NASDAQ:MU", displayName: "Micron" },
        { name: "NYSE:TSM", displayName: "Taiwan Semi" },
      ],
    },
    {
      name: "Financials",
      symbols: [
        { name: "NYSE:JPM", displayName: "JPMorgan Chase" },
        { name: "NYSE:GS", displayName: "Goldman Sachs" },
        { name: "NYSE:V", displayName: "Visa" },
        { name: "NYSE:MA", displayName: "Mastercard" },
        { name: "NYSE:BLK", displayName: "BlackRock" },
        { name: "NYSE:BAC", displayName: "Bank of America" },
      ],
    },
    {
      name: "Commodities",
      symbols: [
        { name: "TVC:GOLD", displayName: "Gold" },
        { name: "TVC:SILVER", displayName: "Silver" },
        { name: "TVC:USOIL", displayName: "Crude Oil" },
        { name: "CAPITALCOM:NATURALGAS", displayName: "Natural Gas" },
        { name: "CAPITALCOM:COPPER", displayName: "Copper" },
        { name: "CAPITALCOM:WHEAT", displayName: "Wheat" },
      ],
    },
    {
      name: "Crypto",
      symbols: [
        { name: "BINANCE:BTCUSDT", displayName: "Bitcoin" },
        { name: "BINANCE:ETHUSDT", displayName: "Ethereum" },
        { name: "BINANCE:SOLUSDT", displayName: "Solana" },
        { name: "BINANCE:BNBUSDT", displayName: "BNB" },
        { name: "BINANCE:XRPUSDT", displayName: "XRP" },
        { name: "BINANCE:LINKUSDT", displayName: "Chainlink" },
      ],
    },
  ],
};