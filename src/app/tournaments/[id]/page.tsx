import Link from "next/link";
import { notFound } from "next/navigation";
import { TournamentService } from "@/lib/services/tournament-service";
import { createClient } from "@/lib/supabase/server";
import { dataStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Trophy,
  Calendar,
  Users,
  Shield,
  Clock,
  Award,
  Flame,
  ArrowRight,
  Lock,
  Radio,
  FileText,
  AlertCircle,
} from "lucide-react";

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournament = await TournamentService.getTournamentById(id);

  if (!tournament) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const currentUser = dataStore.getCurrentUser();
  const activeUserId = authUser?.id || currentUser.id;

  const registrations = dataStore.getRegistrations(tournament.id);
  const userRegistration = registrations.find((r) => r.user_id === activeUserId);

  const totalPrizeCents =
    tournament.main_prize_pool_cents + tournament.performance_reward_pool_cents;
  const isLive = tournament.status === "LIVE";
  const isFull = tournament.current_participants_count >= tournament.max_participants;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
        <Link href="/tournaments" className="hover:text-brand-crimsonLight">
          Arena Tournaments
        </Link>
        <span>/</span>
        <span className="text-gray-200">{tournament.title}</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-crimson font-semibold bg-brand-crimson/10 px-2.5 py-0.5 rounded border border-brand-crimson/30">
                {tournament.game_name}
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-300 bg-surface-200 px-2.5 py-0.5 rounded border border-surface-border">
                {tournament.format}
              </span>
              {isLive ? (
                <Badge variant="live" pulse>
                  ARENA LIVE
                </Badge>
              ) : (
                <Badge variant="surface">
                  {tournament.status.replace(/_/g, " ")}
                </Badge>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
              {tournament.title}
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed font-sans">
              {tournament.description}
            </p>
          </div>

          {/* Action Box */}
          <div className="w-full lg:w-80 p-5 rounded-xl bg-surface-200 border border-surface-border space-y-4 shrink-0">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-400 font-mono uppercase">Entry Ticket</span>
              <span className="text-2xl font-black font-display text-white">
                {tournament.entry_fee_cents === 0
                  ? "FREE"
                  : formatCurrency(tournament.entry_fee_cents, tournament.currency)}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>Slots Allocated</span>
                <span className="font-bold text-white">
                  {tournament.current_participants_count} / {tournament.max_participants}
                </span>
              </div>
              <ProgressBar
                current={tournament.current_participants_count}
                max={tournament.max_participants}
              />
            </div>

            {/* CTAs */}
            <div className="pt-2 space-y-2">
              {userRegistration ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                    <span>Slot Status:</span>
                    <span className="font-mono font-bold uppercase">
                      {userRegistration.status}
                    </span>
                  </div>
                  <Link
                    href={`/tournaments/${tournament.id}/room`}
                    className="w-full py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-crimson/25"
                  >
                    <Lock className="w-4 h-4" />
                    Enter Match Room Key
                  </Link>
                </div>
              ) : isLive ? (
                <Link
                  href="/live"
                  className="w-full py-3 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-crimson/30 transition-all"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  Watch Live Match
                </Link>
              ) : isFull ? (
                <button
                  disabled
                  className="w-full py-3 rounded-lg bg-surface-elevated text-gray-400 text-xs uppercase font-mono tracking-wider cursor-not-allowed border border-surface-border"
                >
                  Arena Slots Full
                </button>
              ) : (
                <Link
                  href={`/tournaments/${tournament.id}/register`}
                  className="w-full py-3 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
                >
                  <Trophy className="w-4 h-4" />
                  Claim Your Spot ({formatCurrency(tournament.entry_fee_cents, tournament.currency)})
                </Link>
              )}

              <Link
                href="/dashboard"
                className="w-full py-2 rounded-lg bg-surface-elevated hover:bg-surface-50 text-gray-300 text-xs font-medium flex items-center justify-center transition-colors font-display uppercase tracking-wider"
              >
                View in Player Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Prize Breakdown, Scoring, Rules */}
        <div className="lg:col-span-8 space-y-8">
          {/* Transparent Prize Architecture Card */}
          <div className="rounded-xl bg-surface-100 border border-surface-border p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-gold" />
                <h2 className="font-display text-xl font-black text-white uppercase">
                  Guaranteed Prize Architecture
                </h2>
              </div>
            </div>

            {/* Collection Ledger Summary */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-surface-200/80 border border-surface-border text-center font-mono">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Projected Inflow</span>
                <span className="text-sm font-bold text-gray-200">
                  {formatCurrency(
                    tournament.entry_fee_cents * tournament.max_participants,
                    tournament.currency
                  )}
                </span>
              </div>
              <div className="border-x border-surface-border">
                <span className="text-[10px] text-gray-400 block uppercase">Main Podium Pool</span>
                <span className="text-sm font-bold text-brand-gold">
                  {formatCurrency(tournament.main_prize_pool_cents, tournament.currency)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Top Fraggers Pool</span>
                <span className="text-sm font-bold text-brand-crimson">
                  {formatCurrency(tournament.performance_reward_pool_cents, tournament.currency)}
                </span>
              </div>
            </div>

            {/* Main Podium Distribution */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-gold" />
                Main Podium Payouts
              </h3>
              <div className="space-y-2">
                {tournament.prize_distribution_rules.map((rule) => (
                  <div
                    key={rule.place}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-200/60 border border-surface-border/80"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold font-mono">
                        {rule.place === 1 ? "🥇" : rule.place === 2 ? "🥈" : "🥉"}
                      </span>
                      <span className="font-medium text-sm text-gray-200">{rule.label}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-brand-gold text-base">
                        {formatCurrency(rule.amount_cents, tournament.currency)}
                      </span>
                      {rule.percentage && (
                        <span className="text-xs text-gray-500 block">
                          ({rule.percentage}% of main pool)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Reward Distribution */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-brand-crimson" />
                  Performance Reward Pool (Top Fraggers)
                </h3>
                <span className="text-[11px] text-gray-400 font-mono">
                  *Podium winners excluded by default
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tournament.performance_reward_rules.map((rule) => (
                  <div
                    key={rule.rank}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-200/60 border border-surface-border/80"
                  >
                    <span className="font-medium text-xs text-gray-300">{rule.label}</span>
                    <span className="font-mono font-bold text-brand-crimson text-sm">
                      {formatCurrency(rule.amount_cents, tournament.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scoring Rules Matrix */}
          <div className="rounded-xl bg-surface-100 border border-surface-border p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
              <Shield className="w-5 h-5 text-brand-crimson" />
              <h2 className="font-display text-xl font-black text-white uppercase">
                Deterministic Scoring System
              </h2>
            </div>

            <p className="text-xs text-gray-400">
              Total score is mathematically deterministic:{" "}
              <code className="text-brand-crimsonLight bg-surface-200 px-1.5 py-0.5 rounded font-mono">
                Total Score = Placement Points + (Kills × {tournament.scoring_rules.kill_points} Point)
              </code>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs pt-2">
              {Object.entries(tournament.scoring_rules.placement_points).map(
                ([place, points]) => (
                  <div
                    key={place}
                    className="p-2.5 rounded-lg bg-surface-200 border border-surface-border text-center"
                  >
                    <span className="text-gray-400 block text-[10px]">Rank #{place}</span>
                    <span className="font-bold text-white text-sm">{points} Pts</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Schedule, Room Protection, Policy */}
        <div className="lg:col-span-4 space-y-6">
          {/* Operations Schedule Card */}
          <div className="rounded-xl bg-surface-100 border border-surface-border p-5 space-y-4">
            <h3 className="font-display text-base font-bold text-white uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-crimson" />
              Official Timeline
            </h3>

            <div className="space-y-3 text-xs font-mono divide-y divide-surface-border/60">
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Registration Closes:</span>
                <span className="font-semibold text-gray-200">
                  {formatDateTime(tournament.registration_end)}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Check-in Window:</span>
                <span className="font-semibold text-brand-gold">
                  {formatDateTime(tournament.checkin_start)}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Room Decryption:</span>
                <span className="font-semibold text-brand-crimsonLight">
                  {formatDateTime(tournament.room_release_time)}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Match Drop Time:</span>
                <span className="font-semibold text-brand-crimson">
                  {formatDateTime(tournament.match_start)}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-gray-400">Dispute Window:</span>
                <span className="font-semibold text-gray-200">
                  {tournament.dispute_window_minutes} Minutes
                </span>
              </div>
            </div>
          </div>

          {/* Cancellation & Refund Guarantee Card */}
          <div className="rounded-xl bg-surface-100 border border-surface-border p-5 space-y-3">
            <div className="flex items-center gap-2 text-brand-gold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider">
                Fair Play & Cancellation Policy
              </h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              {tournament.cancellation_policy}
            </p>
            <p className="text-[11px] text-gray-500 border-t border-surface-border pt-2 font-mono">
              All room access attempts, kill submissions, and payouts are logged to an immutable audit ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
