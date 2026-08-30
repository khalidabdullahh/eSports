import { notFound } from "next/navigation";
import { dataStore } from "@/lib/store";
import { RefereeConsoleClient } from "./referee-client";
import { Shield } from "lucide-react";
import Link from "next/link";
import { AdminAuthWall } from "@/components/admin-auth-wall";

export default async function RefereePage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const match = dataStore.getMatch(matchId);

  if (!match) {
    notFound();
  }

  const tournament = dataStore.getTournament(match.tournament_id);
  if (!tournament) {
    notFound();
  }

  const events = dataStore.getMatchEvents(matchId);

  const currentUser = dataStore.getCurrentUser();
  const isStaff = currentUser && (currentUser.role === "SUPER_ADMIN" || currentUser.role === "REFEREE");
  if (!isStaff) {
    return <AdminAuthWall />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-crimson font-semibold mb-1">
            <Shield className="w-4 h-4" />
            <span>OFFICIAL REFEREE MATCH DESK</span>
            <span className="text-gray-500">•</span>
            <span className="text-slate-600 dark:text-gray-400">{tournament.title}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase">
            Referee Match Operations Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-gray-300 text-xs font-medium border border-surface-border transition-colors"
          >
            Admin Portal
          </Link>
          <Link
            href="/live"
            target="_blank"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors"
          >
            View Public Live Broadcast ↗
          </Link>
        </div>
      </div>

      {/* Main Interactive Referee Console */}
      <RefereeConsoleClient
        initialMatch={match}
        initialEvents={events}
        tournament={tournament}
      />
    </div>
  );
}
