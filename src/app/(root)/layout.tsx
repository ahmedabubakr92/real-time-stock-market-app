import Header from "@/components/Header"
import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { searchStocks } from "@/lib/actions/finnhub.actions"
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions"

export default async function Layout({
    children
} : {
    children: React.ReactNode
}) {
    const session = await auth?.api.getSession({
        headers: await headers()
    })
    if (!session?.user) {
        redirect("/sign-in")
    }
    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
    }

    const [stocks, watchlistSymbols] = await Promise.all([
        searchStocks().catch(() => [] as StockWithWatchlistStatus[]),
        getWatchlistSymbolsByEmail(user.email).catch(() => [] as string[]),
    ])

    const initialStocks = stocks.map((s) => ({
        ...s,
        isInWatchlist: watchlistSymbols.includes(s.symbol.toUpperCase()),
    }))

    return (
        <main className="min-h-screen text-gray-400">
            <Header user={user} initialStocks={initialStocks}/>
            <div className="container py-10">
                {children}
            </div>
        </main>
    )
}