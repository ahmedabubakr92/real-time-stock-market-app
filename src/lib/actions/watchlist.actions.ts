"use server";

import { connectToDatabase } from "@/database/mongoose";
import Watchlist from "@/database/models/watchlist.models";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getCurrentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function getWatchlistSymbolsByEmail(
  email: string,
): Promise<string[]> {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) return [];

    const user = await db
      .collection("user")
      .findOne({ email }, { projection: { _id: 1, id: 1 } });
    if (!user) return [];

    const userId = user.id || user._id?.toString()

    if (!userId) return []

    const watchListItems = await Watchlist.find({userId}).select("symbol").lean();

    return watchListItems.map((item) => item.symbol)
  } catch (e) {
    console.error("Error fetching watchlist symbols", e);
    return [];
  }
}

export async function getWatchlistSymbolsBulk(
  userIds: string[],
): Promise<Map<string, string[]>> {
  if (userIds.length === 0) return new Map();

  try {
    await connectToDatabase();
    const items = await Watchlist.find({ userId: { $in: userIds } })
      .select("userId symbol")
      .lean();

    const result = new Map<string, string[]>();
    for (const item of items) {
      const existing = result.get(item.userId);
      if (existing) {
        existing.push(item.symbol);
      } else {
        result.set(item.userId, [item.symbol]);
      }
    }
    return result;
  } catch (e) {
    console.error("Error bulk fetching watchlist symbols", e);
    throw e;
  }
}

export async function getWatchlistItems(): Promise<WatchlistItemData[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];
    await connectToDatabase();
    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
    return items.map((item) => ({
      id: item._id.toString(),
      symbol: item.symbol,
      company: item.company,
      addedAt: item.addedAt,
    }));
  } catch (e) {
    console.error("Error fetching watchlist items:", e);
    return [];
  }
}

export async function isSymbolInWatchlist(symbol: string): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;
    await connectToDatabase();
    const item = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() }).lean();
    return !!item;
  } catch {
    return false;
  }
}

export async function addToWatchlist(
  symbol: string,
  company: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "Not authenticated" };
    await connectToDatabase();
    await Watchlist.create({ userId, symbol: symbol.toUpperCase(), company });
    revalidatePath("/watchlist");
    return { success: true };
  } catch (e) {
    if (typeof e === "object" && e !== null && "code" in e && (e as { code: number }).code === 11000) {
      return { success: false, error: "Already in watchlist" };
    }
    console.error("Error adding to watchlist:", e);
    return { success: false, error: "Failed to add stock" };
  }
}

export async function removeFromWatchlist(
  symbol: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "Not authenticated" };
    await connectToDatabase();
    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    revalidatePath("/watchlist");
    return { success: true };
  } catch (e) {
    console.error("Error removing from watchlist:", e);
    return { success: false, error: "Failed to remove stock" };
  }
}
