import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const match = dataStore.getMatch(id);

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const events = dataStore.getMatchEvents(id);
  return NextResponse.json({ match, events });
}
