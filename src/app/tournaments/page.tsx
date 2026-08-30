import Link from "next/link";
import { TournamentService } from "@/lib/services/tournament-service";
import { TournamentCard } from "@/components/tournament-card";
import { Trophy, Filter, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: Promise<{ format?: string; game?: string }>;
}) {
  const { format } = await searchParams;
  let tournaments = await TournamentService.getTournaments();

  if (format && format !== "ALL") {
    tournaments = tournaments.filter((t) => t.format === format);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-brand-crimson" />
            <span className="text-xs font-mono uppercase tracking-widest text-brand-crimson font-bold">
              ARENEX TOURNAMENT DIRECTORY
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Arena Tournaments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-sans">
            Claim your spot in active cash cups, qualifiers, and high-stakes battle royale tournaments.
          </p>
        </div>

        {/* Format Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium font-display">
          <span className="text-slate-500 dark:text-gray-400 flex items-center gap-1 mr-1 font-mono text-[11px]">
            <Filter className="w-3.5 h-3.5" />
            Format:
          </span>
          <Link
            href="/tournaments"
            className={`px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all ${
              !format || format === "ALL"
                ? "bg-brand-crimson text-white font-bold shadow-md shadow-brand-crimson/25"
                : "bg-surface-elevated text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white border border-surface-border font-semibold"
            }`}
          >
            All Formats
          </Link>
          <Link
            href="/tournaments?format=SOLO"
            className={`px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all ${
              format === "SOLO"
                ? "bg-brand-crimson text-white font-bold shadow-md shadow-brand-crimson/25"
                : "bg-surface-elevated text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white border border-surface-border font-semibold"
            }`}
          >
            Solo (BR)
          </Link>
          <Link
            href="/tournaments?format=SQUAD"
            className={`px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all ${
              format === "SQUAD"
                ? "bg-brand-crimson text-white font-bold shadow-md shadow-brand-crimson/25"
                : "bg-surface-elevated text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white border border-surface-border font-semibold"
            }`}
          >
            Squad (4v4)
          </Link>
          <Link
            href="/tournaments?format=LONE_WOLF"
            className={`px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all ${
              format === "LONE_WOLF"
                ? "bg-brand-crimson text-white font-bold shadow-md shadow-brand-crimson/25"
                : "bg-surface-elevated text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white border border-surface-border font-semibold"
            }`}
          >
            Lone Wolf (1v1)
          </Link>
        </div>
      </div>

      {/* Grid or Empty State */}
      {tournaments.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-brand-crimson/10 text-brand-crimson flex items-center justify-center mx-auto border border-brand-crimson/30">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              No tournaments available right now
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-sans max-w-sm mx-auto">
              New competitive Free Fire circuits and cash cups are announced daily. Check back soon or view rankings.
            </p>
          </div>
          <Link
            href="/rankings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 transition-all shadow-sm"
          >
            <span>View Global Rankings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  );
}
