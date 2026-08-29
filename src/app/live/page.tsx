import { dataStore } from "@/lib/store";
import { DEMO_MATCH_ID, DEMO_TOURNAMENT_ID } from "@/lib/seed-data";
import { LiveMatchConsole } from "@/components/live-match-console";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LivePage() {
  const tournament = dataStore.getTournament(DEMO_TOURNAMENT_ID);
  const match = dataStore.getMatch(DEMO_MATCH_ID);
  const events = dataStore.getMatchEvents(DEMO_MATCH_ID);

  if (!tournament || !match) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <LiveMatchConsole
        tournament={tournament}
        initialMatch={match}
        initialEvents={events}
      />
    </div>
  );
}
