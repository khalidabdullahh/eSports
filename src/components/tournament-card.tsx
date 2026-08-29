import Link from "next/link";
import { Tournament } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { ProgressBar } from "./ui/progress-bar";
import { Trophy, Users, Calendar, ArrowRight, ShieldAlert } from "lucide-react";

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
    <div className="group relative flex flex-col justify-between bg-surface-100 hover:bg-surface-elevated/80 border border-surface-border hover:border-surface-borderLight rounded-xl p-5 transition-all duration-300 shadow-lg hover:shadow-cyan-500/5">
      {/* Top Bar: Game, Format, Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
            {tournament.game_name}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 bg-surface-200 px-2 py-0.5 rounded border border-surface-border">
            {tournament.format}
          </span>
        </div>

        {isLive ? (
          <Badge variant="live" pulse>
            LIVE NOW
          </Badge>
        ) : isRegistrationOpen ? (
          <Badge variant="emerald">
            {isFull ? "SLOTS FULL" : "OPEN"}
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
          <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {tournament.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{tournament.mode}</p>
      </div>

      {/* Metrics Row: Prize Pool & Entry Fee */}
      <div className="grid grid-cols-2 gap-3 py-3 px-3.5 mb-4 rounded-lg bg-surface-200/90 border border-surface-border/80">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
            Total Prize Pool
          </span>
          <div className="flex items-baseline gap-1 text-amber-400 font-display font-black text-xl">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{formatCurrency(totalPrizeCents, tournament.currency)}</span>
          </div>
          <span className="text-[10px] text-gray-400 block font-mono">
            Main: {formatCurrency(tournament.main_prize_pool_cents, tournament.currency)} + Perf: {formatCurrency(tournament.performance_reward_pool_cents, tournament.currency)}
          </span>
        </div>

        <div className="border-l border-surface-border/80 pl-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
            Entry Fee
          </span>
          <div className="text-white font-display font-black text-xl">
            {tournament.entry_fee_cents === 0
              ? "FREE"
              : formatCurrency(tournament.entry_fee_cents, tournament.currency)}
          </div>
          <span className="text-[10px] text-gray-400 block font-mono">
            {tournament.currency} / {tournament.format === "SQUAD" ? "Squad" : "Player"}
          </span>
        </div>
      </div>

      {/* Slot Capacity Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5 font-mono">
          <span className="flex items-center gap-1.5 text-gray-300">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            Confirmed Slots
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
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-cyan-500 hover:text-black text-cyan-300 border border-surface-border hover:border-cyan-400 transition-all group-hover:bg-cyan-500 group-hover:text-black"
        >
          <span>{isLive ? "Watch Live" : "View Details"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
