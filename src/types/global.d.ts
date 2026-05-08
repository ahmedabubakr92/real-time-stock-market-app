import {
  Control,
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

declare global {
  type SignInFormData = {
    email: string;
    password: string;
  };

  type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
    country: string;
    investmentGoals: string;
    riskTolerance: string;
    preferredIndustry: string;
  };

  type FormInputProps = {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    register: UseFormRegister;
    error?: FieldError;
    validation?: RegisterOptions;
    disabled?: boolean;
    value?: string;
  };

  type Option = {
    value: string;
    label: string;
  };

  type SelectFieldProps = {
    name: string;
    label: string;
    placeholder: string;
    options: readonly Option[];
    control: Control;
    error?: FieldError;
    required?: boolean;
  };

  type SelectCountryProps = {
    name: string;
    label: string;
    control: Control;
    error?: FieldError;
    required?: boolean;
  };

  type FooterLinkProps = {
    text: string;
    linkText: string;
    href: string;
  };

  type WelcomeEmailData = {
    email: string;
    name: string;
    intro: string;
  };

  type User = {
    id: string;
    name: string;
    email: string;
  };

  type MarketNewsArticle = {
    id: number;
    headline: string;
    summary: string;
    source: string;
    url: string;
    datetime: number;
    category: string;
    related: string;
    image?: string;
  };

  type RawNewsArticle = {
    id: number;
    headline?: string;
    summary?: string;
    source?: string;
    url?: string;
    datetime?: number;
    image?: string;
    category?: string;
    related?: string;
  };

  type WatchlistItemData = {
    id: string;
    symbol: string;
    company: string;
    addedAt: Date;
  };

  type SymbolSearchResult = {
    symbol: string;
    description: string;
    type: string;
  };

  type Stock = {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
  };

  type StockWithWatchlistStatus = Stock & {
    isInWatchlist: boolean;
  };

  type FinnhubSearchResult = {
    symbol: string;
    description: string;
    displaySymbol?: string;
    type: string;
  };

  type FinnhubSearchResponse = {
    count: number;
    result: FinnhubSearchResult[];
  };

  type SearchCommandProps = {
    renderAs?: "button" | "text";
    label?: string;
    initialStocks: StockWithWatchlistStatus[];
  };

  type StockProfile = {
    symbol: string;
    name: string;
    logo: string;
    exchange: string;
    industry: string;
    marketCap: number;
    shares: number;
    ipo: string;
    country: string;
    website: string;
    currency: string;
  };

  type StockQuote = {
    price: number;
    change: number;
    percentChange: number;
    high: number;
    low: number;
    open: number;
    prevClose: number;
    timestamp: number;
  };

  type StockMetrics = {
    eps: number | null;
    peRatio: number | null;
    dividendYield: number | null;
    nextEarningsDate: string | null;
    enterpriseValue: number | null;
    evToEbitda: number | null;
    psRatio: number | null;
    pbRatio: number | null;
    pcfRatio: number | null;
    pfcfRatio: number | null;
    grossMargin: number | null;
    operatingMargin: number | null;
    pretaxMargin: number | null;
    netMargin: number | null;
    returnOnAssets: number | null;
    returnOnEquity: number | null;
    operatingCashFlow: number | null;
    investingCashFlow: number | null;
    financingCashFlow: number | null;
    capex: number | null;
    totalRevenue: number | null;
    volume: number | null;
  };
}

export {};
