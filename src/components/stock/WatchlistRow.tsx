"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WatchlistRowProps {
  item: WatchlistItemData;
}

export default function WatchlistRow({ item }: WatchlistRowProps) {
  const [removing, setRemoving] = useState(false);
  const router = useRouter();

  async function handleRemove() {
    setRemoving(true);
    const result = await removeFromWatchlist(item.symbol);
    if (result.success) {
      toast.success(`${item.symbol} removed from watchlist`);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to remove");
      setRemoving(false);
    }
  }

  return (
    <tr className="table-row">
      <td className="table-cell py-4 pl-4">
        <Link
          href={`/stocks/${item.symbol}`}
          className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          {item.symbol}
        </Link>
      </td>
      <td className="table-cell py-4 text-gray-300">{item.company}</td>
      <td className="table-cell py-4 text-gray-500 text-sm">
        {new Date(item.addedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
      <td className="table-cell py-4 pr-4 text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          disabled={removing}
          className="watchlist-icon-btn"
        >
          <Trash2 className="trash-icon" />
        </Button>
      </td>
    </tr>
  );
}
