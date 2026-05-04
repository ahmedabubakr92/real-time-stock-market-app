import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();

    const state = mongoose.connection.readyState;
    const stateMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return NextResponse.json({
      status: "ok",
      connection: stateMap[state] ?? "unknown",
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
