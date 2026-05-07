"use client";

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchCommand from "./SearchCommand";

function NavItems({
  initialStocks,
}: {
  initialStocks: StockWithWatchlistStatus[];
}) {
  const pathname = usePathname();

  function isActive(path: string) {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  }

  return (
    <ul className="nav-list">
      {NAV_ITEMS.slice(0, 1).map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`hover:text-yellow-500 transition-colors ${
              isActive(item.href) ? "text-gray-100" : ""
            }`}
          >
            {item.label}
          </Link>
        </li>
      ))}
      <li>
        <SearchCommand
          renderAs="text"
          label="Search"
          initialStocks={initialStocks}
        />
      </li>
      {NAV_ITEMS.slice(1).map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`hover:text-yellow-500 transition-colors ${
              isActive(item.href) ? "text-gray-100" : ""
            }`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NavItems;
