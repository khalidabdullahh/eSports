import { dataStore } from "@/lib/store";
import { LiveMatchConsole } from "@/components/live-match-console";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = dataStore.getMatch(id);

  if (!match) {
    notFound();
  }

  const tournament = dataStore.getTournament(match.tournament_id);
  if (!tournament) {
    notFound();
  }

  const events = dataStore.getMatchEvents(id);

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
