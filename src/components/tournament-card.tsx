import Link from "next/link";
import { Tournament } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { ProgressBar } from "./ui/progress-bar";
import { Trophy, Users, Calendar, ArrowRight } from "lucide-react";

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const isLive = tournament.status === "LIVE";
  const isRegistrationOpen = tournament.status === "REGISTRATION_OPEN";
  const isFull = tournament.current_participants_count >= tournament.max_participants;

  const totalPrizeCents =
    tournament.main_prize_pool_cents + tournament.performance_reward_pool_cents;

  return (
    <div className="group relative flex flex-col justify-between bg-surface-100 hover:bg-surface-elevated/80 border border-surface-border hover:border-brand-crimson/50 rounded-xl p-5 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,30,68,0.1)]">
      {/* Top Bar: Game, Format, Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-crimson font-semibold bg-brand-crimson/10 px-2 py-0.5 rounded border border-brand-crimson/30">
            {tournament.game_name}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 bg-surface-200 px-2 py-0.5 rounded border border-surface-border">
            {tournament.format}
          </span>
        </div>

        {isLive ? (
          <Badge variant="live" pulse>
            LIVE BATTLE
          </Badge>
        ) : isRegistrationOpen ? (
          <Badge variant={isFull ? "surface" : "emerald"}>
            {isFull ? "ARENA FULL" : "SLOTS OPEN"}
          </Badge>
        ) : (
          <Badge variant="surface">
            {tournament.status.replace(/_/g, " ")}
          </Badge>
        )}
      </div>

      {/* Title & Mode */}
      <div className="mb-4">
        <Link href={`/tournaments/${tournament.slug || tournament.id}`}>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-crimson transition-colors line-clamp-1 tracking-wide">
            {tournament.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 line-clamp-1 font-medium">{tournament.mode}</p>
      </div>

      {/* Metrics Row: Prize Pool & Entry Fee */}
      <div className="grid grid-cols-2 gap-3 py-3 px-3.5 mb-4 rounded-lg bg-surface-200/90 border border-surface-border/80">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-gray-400 font-semibold block">
            Guaranteed Pool
          </span>
          <div className="flex items-baseline gap-1 text-brand-gold font-display font-black text-xl">
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span>{formatCurrency(totalPrizeCents, tournament.currency)}</span>
          </div>
          <span className="text-[10px] text-slate-600 dark:text-gray-400 block font-mono">
            Podium: {formatCurrency(tournament.main_prize_pool_cents, tournament.currency)} + Fragger: {formatCurrency(tournament.performance_reward_pool_cents, tournament.currency)}
          </span>
        </div>

        <div className="border-l border-surface-border/80 pl-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-gray-400 font-semibold block">
            Entry Ticket
          </span>
          <div className="text-slate-900 dark:text-white font-display font-black text-xl">
            {tournament.entry_fee_cents === 0
              ? "FREE"
              : formatCurrency(tournament.entry_fee_cents, tournament.currency)}
          </div>
          <span className="text-[10px] text-slate-600 dark:text-gray-400 block font-mono">
            {tournament.currency} / {tournament.format === "SQUAD" ? "Squad" : "Player"}
          </span>
        </div>
      </div>

      {/* Slot Capacity Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5 font-mono">
          <span className="flex items-center gap-1.5 text-gray-300">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            Arena Slots
          </span>
          <span className="font-bold text-gray-200">
            {tournament.current_participants_count} / {tournament.max_participants}
          </span>
        </div>
        <ProgressBar
          current={tournament.current_participants_count}
          max={tournament.max_participants}
        />
      </div>

      {/* Schedule & Action CTA */}
      <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-gray-500" />
          <span>{formatDateTime(tournament.match_start)}</span>
        </div>

        <Link
          href={
            isLive
              ? `/live`
              : `/tournaments/${tournament.slug || tournament.id}`
          }
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-brand-crimson hover:text-white text-slate-900 dark:text-gray-200 border border-surface-border hover:border-brand-crimson transition-all font-display uppercase tracking-wider group-hover:bg-brand-crimson group-hover:text-white shadow-sm"
        >
          <span>{isLive ? "Watch Arena" : isRegistrationOpen ? "Enter Arena" : "View Cup"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
