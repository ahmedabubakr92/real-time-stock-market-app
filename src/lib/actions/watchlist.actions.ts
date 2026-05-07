"use server";

import { connectToDatabase } from "@/database/mongoose";
import Watchlist from "@/database/models/watchlist.models";

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
    return new Map();
  }
}
