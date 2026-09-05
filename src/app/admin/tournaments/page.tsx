import Link from "next/link";
import { TournamentService } from "@/lib/services/tournament-service";
import { AdminTournamentsClient } from "./admin-tournaments-client";
import { Trophy, Plus, ArrowLeft, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTournamentsPage() {
  // Include DRAFT tournaments for administrators
  const tournaments = await TournamentService.getTournaments(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-32 sm:pb-24 space-y-8 animate-admin-portal relative">
      {/* Tactical Top Scanline Accent */}
      <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-brand-crimson to-transparent overflow-hidden rounded-full shadow-[0_0_12px_rgba(226,19,110,0.8)]">
        <div className="w-1/3 h-full bg-cyan-400 animate-scanline" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-crimson font-bold mb-1">
            <Shield className="w-4 h-4" />
            <span>OPERATIONAL TOURNAMENT REGISTRY</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Tournaments Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-sans">
            Oversee competitive circuits, manage lifecycle transitions, and launch official tournaments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-700 dark:text-gray-300 font-display font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Desk</span>
          </Link>

          <Link
            href="/admin/tournaments/new"
            className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tournament</span>
          </Link>
        </div>
      </div>

      <AdminTournamentsClient initialTournaments={tournaments} />
    </div>
  );
}
