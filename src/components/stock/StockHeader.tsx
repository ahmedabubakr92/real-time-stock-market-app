import Image from "next/image";
import { formatMillions, formatMetric } from "@/lib/utils";

interface StockHeaderProps {
  profile: StockProfile;
  quote: StockQuote;
  metrics: StockMetrics;
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 first:pl-0 last:pr-0">
      <span className="text-base font-semibold text-gray-100">{value}</span>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export default function StockHeader({ profile, quote, metrics }: StockHeaderProps) {
  const isPositive = quote.change >= 0;

  const stats = [
    {
      label: "Upcoming Earnings",
      value: metrics.nextEarningsDate ?? "N/A",
    },
    {
      label: "EPS",
      value: formatMetric(metrics.eps),
    },
    {
      label: "Market Cap",
      value: formatMillions(profile.marketCap),
    },
    {
      label: "Div Yield",
      value: formatMetric(metrics.dividendYield, "%"),
    },
    {
      label: "P/E",
      value: formatMetric(metrics.peRatio),
    },
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
      {/* Company identity */}
      <div className="flex items-center gap-4 mb-5">
        {profile.logo && (
          <Image
            src={profile.logo}
            alt={profile.name}
            width={48}
            height={48}
            className="rounded-lg object-contain bg-white p-1"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-100 uppercase">
            {profile.name}
          </h1>
          <p className="text-sm text-gray-400">
            {profile.symbol} &middot; {profile.exchange}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-4xl font-bold text-gray-100">
          {quote.price.toFixed(2)}
        </span>
        <span className="text-base text-gray-500">{profile.currency}</span>
        <span
          className={`text-base font-medium ${
            isPositive ? "text-teal-400" : "text-red-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {quote.change.toFixed(2)} ({isPositive ? "+" : ""}
          {quote.percentChange.toFixed(2)}%)
        </span>
      </div>

      {/* Stats bar */}
      <div className="flex divide-x divide-gray-600 border-t border-gray-600 pt-5">
        {stats.map((stat) => (
          <StatCell key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
}
