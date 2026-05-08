import Link from "next/link";
import { Star } from "lucide-react";
import { getWatchlistItems } from "@/lib/actions/watchlist.actions";
import WatchlistRow from "@/components/stock/WatchlistRow";

export default async function WatchlistPage() {
  const items = await getWatchlistItems();

  if (items.length === 0) {
    return (
      <div className="flex watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Search for stocks and add them to your watchlist to track them here.
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-yellow-400 hover:underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="watchlist-title">My Watchlist</h1>
        <span className="text-sm text-gray-500">{items.length} stock{items.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="watchlist-table">
        <table className="w-full">
          <thead>
            <tr className="table-header-row">
              <th className="table-header text-left py-3 pl-4 text-sm font-medium">
                Symbol
              </th>
              <th className="table-header text-left py-3 text-sm font-medium">
                Company
              </th>
              <th className="table-header text-left py-3 text-sm font-medium">
                Added
              </th>
              <th className="table-header py-3 pr-4" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <WatchlistRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
