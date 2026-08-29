import { dataStore } from "@/lib/store";
import { TournamentCard } from "@/components/tournament-card";
import { Trophy, Filter } from "lucide-react";

export default function TournamentsPage({
  searchParams,
}: {
  searchParams: Promise<{ format?: string; game?: string }>;
}) {
  const tournaments = dataStore.getTournaments();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-brand-crimson" />
            <span className="text-xs font-mono uppercase tracking-widest text-brand-crimson font-semibold">
              ARENEX TOURNAMENT DIRECTORY
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Arena Tournaments
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Claim your spot in active cups, qualifiers, and high-stakes battle royale tournaments.
          </p>
        </div>

        {/* Quick Format Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium font-display">
          <span className="text-gray-400 flex items-center gap-1 mr-2 font-mono">
            <Filter className="w-3.5 h-3.5" />
            Format:
          </span>
          <button className="px-3.5 py-1.5 rounded-lg bg-brand-crimson text-white font-semibold uppercase tracking-wider">
            All Formats
          </button>
          <button className="px-3.5 py-1.5 rounded-lg bg-surface-elevated text-gray-300 hover:text-white border border-surface-border uppercase tracking-wider">
            Solo (Battle Royale)
          </button>
          <button className="px-3.5 py-1.5 rounded-lg bg-surface-elevated text-gray-300 hover:text-white border border-surface-border uppercase tracking-wider">
            Squad (4v4)
          </button>
          <button className="px-3.5 py-1.5 rounded-lg bg-surface-elevated text-gray-300 hover:text-white border border-surface-border uppercase tracking-wider">
            Lone Wolf (1v1)
          </button>
        </div>
      </div>

      {/* Grid of Tournaments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <TournamentCard key={t.id} tournament={t} />
        ))}
      </div>
    </div>
  );
}
