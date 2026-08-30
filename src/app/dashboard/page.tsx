import Link from "next/link";
import { dataStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions/auth-actions";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  User,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  DollarSign,
  Radio,
  ArrowRight,
  Shield,
  Bell,
  LogOut,
  Settings,
  Gamepad2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PlayerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const currentUser = dataStore.getCurrentUser();
  let displayName = currentUser.display_name;
  let avatarUrl = currentUser.avatar_url;
  let role = currentUser.role;
  let inGameName = currentUser.in_game_name;
  let freeFireUid = currentUser.free_fire_uid;

  if (authUser) {
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profileRow) {
      displayName = profileRow.display_name || displayName;
      avatarUrl = profileRow.avatar_url || avatarUrl;
      role = profileRow.role || role;
    }

    const { data: gameAccountRow } = await supabase
      .from("game_accounts")
      .select("*")
      .eq("user_id", authUser.id)
      .limit(1)
      .single();

    if (gameAccountRow) {
      inGameName = gameAccountRow.in_game_name || inGameName;
      freeFireUid = gameAccountRow.game_uid || freeFireUid;
    }
  }

  const registrations = dataStore.getRegistrations();
  const myRegistrations = registrations.filter((r) => r.user_id === currentUser.id);
  const myPayments = dataStore.getPayments().filter((p) => p.user_id === currentUser.id);
  const myRewards = dataStore.getRewards().filter((r) => r.recipient_user_id === currentUser.id);
  const myPayouts = dataStore.getPayouts().filter((p) => p.user_id === currentUser.id);
  const notifications = dataStore.getNotifications(currentUser.id);

  const totalEarningsCents = myRewards.reduce((acc, r) => acc + r.amount_cents, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-100 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={
              avatarUrl ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            }
            alt={displayName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-crimson/50 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {displayName}
              </h1>
              <Badge variant="cyan">{role}</Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-mono">
              IGN: <strong className="text-brand-crimson font-bold">{inGameName || "WARRIOR"}</strong> • Free Fire UID:{" "}
              <span className="font-bold text-slate-900 dark:text-gray-200">{freeFireUid || "Not Linked"}</span>
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-crimson hover:underline font-bold"
              >
                <Settings className="w-3 h-3" />
                <span>Edit Profile & Gaming Accounts</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions & Earnings */}
        <div className="flex flex-col sm:items-end gap-3">
          <div className="p-4 rounded-xl bg-surface-200 border border-surface-border text-left sm:text-right shadow-sm w-full sm:w-auto">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-gray-400 font-bold block">
              Career Tournament Earnings
            </span>
            <div className="text-2xl font-black font-display text-brand-gold">
              {formatCurrency(totalEarningsCents, "BDT")}
            </div>
            <span className="text-[10px] text-brand-emerald font-mono font-semibold">
              {myRewards.length} tournament prize awards
            </span>
          </div>

          <form action={signOutAction}>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-red-500/10 border border-surface-border hover:border-red-500/30 text-slate-700 dark:text-gray-300 hover:text-red-500 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Lifecycle Stepper / Active Tournament Status */}
      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h2 className="font-display text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Active Tournament Lifecycle Progression
          </h2>
          <span className="text-xs font-mono text-brand-crimson font-bold">Night Battle — Solo Cup</span>
        </div>

        {/* 6-Step Progression Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 text-center text-xs font-mono">
          <div className="p-3 rounded-lg bg-surface-200 border border-emerald-500/30 text-brand-emerald space-y-1">
            <span className="text-base block font-bold">✓</span>
            <span className="font-bold block">1. Registration</span>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 block">Slot Confirmed</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-emerald-500/30 text-brand-emerald space-y-1">
            <span className="text-base block font-bold">✓</span>
            <span className="font-bold block">2. Payment</span>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 block">Verified (৳50)</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-emerald-500/30 text-brand-emerald space-y-1">
            <span className="text-base block font-bold">✓</span>
            <span className="font-bold block">3. Check-In</span>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 block">Checked In</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-brand-crimson/40 text-brand-crimson space-y-1">
            <Unlock className="w-4 h-4 mx-auto text-brand-crimson" />
            <span className="font-bold block">4. Room Key</span>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 block">Unlocked</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-surface-border text-slate-500 dark:text-gray-400 space-y-1">
            <Radio className="w-4 h-4 mx-auto" />
            <span className="font-bold block">5. Live Match</span>
            <span className="text-[10px] block">Starts 10:00 PM</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-surface-border text-slate-500 dark:text-gray-400 space-y-1">
            <Trophy className="w-4 h-4 mx-auto" />
            <span className="font-bold block">6. Payout</span>
            <span className="text-[10px] block">৳1,500 Pool</span>
          </div>
        </div>
      </div>

      {/* Grid: My Registrations & Financial History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Tournaments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                My Active Tournaments & Match Keys
              </h3>
              <Link
                href="/tournaments"
                className="text-xs font-mono text-brand-crimson hover:underline flex items-center gap-1 font-bold"
              >
                <span>Browse Tournaments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {myRegistrations.map((reg) => {
                const tournament = dataStore.getTournament(reg.tournament_id);
                if (!tournament) return null;
                const isPaid = reg.status === "APPROVED" || reg.status === "CHECKED_IN";

                return (
                  <div
                    key={reg.id}
                    className="p-4 rounded-xl bg-surface-200 border border-surface-border space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-brand-crimson/10 text-brand-crimson font-mono font-bold text-[10px] uppercase">
                            Slot #{reg.slot_number}
                          </span>
                          <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                            {tournament.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-mono">
                          {tournament.mode} • Starts {formatDateTime(tournament.match_start)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {reg.status === "CHECKED_IN" ? (
                          <Badge variant="emerald">Checked In</Badge>
                        ) : reg.status === "APPROVED" ? (
                          <Badge variant="cyan">Paid / Confirmed</Badge>
                        ) : (
                          <Badge variant="gold">Payment Pending</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-surface-border/60 text-xs font-mono">
                      <div className="flex items-center gap-4 text-slate-600 dark:text-gray-400">
                        <span>
                          Guaranteed Pool:{" "}
                          <strong className="text-brand-gold font-bold">
                            {formatCurrency(tournament.main_prize_pool_cents, tournament.currency)}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPaid && (
                          <Link
                            href={`/tournaments/${tournament.id}/room`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-900 dark:text-gray-200 hover:text-brand-crimson font-mono text-xs font-bold transition-all shadow-sm"
                          >
                            <Lock className="w-3.5 h-3.5 text-brand-crimson" />
                            <span>Room Access</span>
                          </Link>
                        )}
                        <Link
                          href={`/tournaments/${tournament.id}`}
                          className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dispute Center */}
          <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-crimson" />
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Match Dispute & Fair Play Desk
                </h3>
              </div>
              <Link
                href="/disputes"
                className="text-xs font-mono text-brand-crimson hover:underline font-bold"
              >
                Submit Evidence
              </Link>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-sans">
              Have a score discrepancy, wrong placement, or fair play report? Submit screenshot proof for referee review.
            </p>
          </div>
        </div>

        {/* Right Col: Payments & Notifications */}
        <div className="space-y-6">
          {/* Recent Payments */}
          <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Payment Submissions
            </h3>

            <div className="space-y-2.5">
              {myPayments.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-surface-200 border border-surface-border text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(p.amount_cents, p.currency)}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        p.status === "VERIFIED"
                          ? "text-brand-emerald"
                          : p.status === "SUBMITTED"
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-gray-400 flex justify-between">
                    <span>{p.payment_method.toUpperCase()}</span>
                    <span>TRX: {p.transaction_id.slice(0, 10)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In-App Notifications */}
          <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-gold" />
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Notifications
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400">
                {notifications.filter((n) => !n.is_read).length} unread
              </span>
            </div>

            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border text-xs space-y-0.5 ${
                    n.is_read
                      ? "bg-surface-200/60 border-surface-border text-slate-600 dark:text-gray-400"
                      : "bg-surface-200 border-brand-crimson/40 text-slate-900 dark:text-gray-200 font-medium"
                  }`}
                >
                  <span className="font-display font-bold block">{n.title}</span>
                  <p className="text-[11px] leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
