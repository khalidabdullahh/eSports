"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Tournament, TournamentStatus } from "@/types";
import {
  updateTournamentStatusAction,
  deleteTournamentAction,
} from "@/app/actions/admin-tournament-actions";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Plus,
  ArrowRight,
  Shield,
  Clock,
  Users,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Radio,
  Edit3,
  Trash2,
} from "lucide-react";

interface AdminTournamentsClientProps {
  initialTournaments: Tournament[];
}

export function AdminTournamentsClient({
  initialTournaments,
}: AdminTournamentsClientProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStatusChange = (tournamentId: string, newStatus: TournamentStatus) => {
    startTransition(async () => {
      const res = await updateTournamentStatusAction(tournamentId, newStatus);
      if (res.success) {
        setTournaments((prev) =>
          prev.map((t) => (t.id === tournamentId ? { ...t, status: newStatus } : t))
        );
        setFeedback(`Tournament status transitioned to ${newStatus}`);
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  const handleDeleteTournament = (tournamentId: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${title}"?\n\nThis will remove the tournament, registered slots, and room data.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteTournamentAction(tournamentId);
      if (res.success) {
        setTournaments((prev) => prev.filter((t) => t.id !== tournamentId));
        setFeedback(`Tournament "${title}" was permanently removed.`);
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-600 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="hover:underline">
            ✕
          </button>
        </div>
      )}

      <div className="space-y-4">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan">{t.status}</Badge>
                  <span className="text-xs font-mono text-brand-crimson font-bold uppercase">
                    {t.format} • {t.game_name}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                  {t.mode} • Starts: {formatDateTime(t.match_start)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {t.status === "DRAFT" && (
                  <button
                    onClick={() => handleStatusChange(t.id, "PUBLISHED")}
                    disabled={isPending}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-slate-800 dark:text-gray-200 uppercase transition-all"
                  >
                    Publish
                  </button>
                )}

                {t.status === "PUBLISHED" && (
                  <button
                    onClick={() => handleStatusChange(t.id, "REGISTRATION_OPEN")}
                    disabled={isPending}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-brand-emerald border border-emerald-500/30 text-xs font-mono font-bold uppercase transition-all"
                  >
                    Open Registration
                  </button>
                )}

                {t.status === "REGISTRATION_OPEN" && (
                  <button
                    onClick={() => handleStatusChange(t.id, "REGISTRATION_CLOSED")}
                    disabled={isPending}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase transition-all"
                  >
                    Close Registration
                  </button>
                )}

                {t.status === "REGISTRATION_CLOSED" && (
                  <button
                    onClick={() => handleStatusChange(t.id, "LIVE")}
                    disabled={isPending}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white text-xs font-mono font-bold uppercase transition-all shadow-md shadow-brand-crimson/25 flex items-center gap-1.5"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    Launch Live
                  </button>
                )}

                <Link
                  href={`/admin/referee/${t.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-brand-crimson uppercase flex items-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Referee Desk
                </Link>

                <Link
                  href={`/tournaments/${t.id}`}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                >
                  View Public →
                </Link>

                <button
                  onClick={() => handleDeleteTournament(t.id, t.title)}
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-surface-border text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-gray-400 block uppercase">
                  Participants
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {t.current_participants_count} / {t.max_participants}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 dark:text-gray-400 block uppercase">
                  Entry Ticket
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(t.entry_fee_cents, t.currency)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 dark:text-gray-400 block uppercase">
                  Guaranteed Pool
                </span>
                <span className="font-bold text-brand-gold">
                  {formatCurrency(t.main_prize_pool_cents, t.currency)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 dark:text-gray-400 block uppercase">
                  Performance Pool
                </span>
                <span className="font-bold text-brand-crimson">
                  {formatCurrency(t.performance_reward_pool_cents, t.currency)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
