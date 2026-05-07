import mongoose, { Schema, Document } from "mongoose";

export interface WatchlistItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

const WatchListSchema = new Schema<WatchlistItem>({
  userId: { type: String, required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  company: { type: String, required: true, trim: true },
  addedAt: { type: Date, default: Date.now },
});

WatchListSchema.index({ userId: 1, symbol: 1 }, { unique: true });

const Watchlist =
  mongoose.models?.Watchlist ||
  mongoose.model<WatchlistItem>("Watchlist", WatchListSchema);

export default Watchlist;
