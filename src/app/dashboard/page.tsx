import Link from "next/link";
import { redirect } from "next/navigation";
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

  if (!authUser) {
    redirect("/login?redirect=/dashboard");
  }

  let displayName = authUser.email?.split("@")[0] || "Competitor";
  let avatarUrl = "";
  let role = "USER";
  let inGameName = "";
  let freeFireUid = "";

  let myRegistrations: any[] = [];
  let myPayments: any[] = [];
  let myRewards: any[] = [];
  let myPayouts: any[] = [];
  let notifications: any[] = [];

  const [
    { data: profileRow },
    { data: gameAccountRow },
    { data: dbRegs },
    { data: dbPayments },
    { data: dbRewards },
    { data: dbPayouts },
    { data: dbNotifs },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle(),
    supabase.from("game_accounts").select("*").eq("user_id", authUser.id).limit(1).maybeSingle(),
    supabase
      .from("tournament_registrations")
      .select("*, tournaments(id, title, mode, scheduled_start_at, status, main_prize_pool_cents, currency)")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: false }),
    supabase.from("payments").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
    supabase.from("rewards").select("*").eq("recipient_user_id", authUser.id).order("created_at", { ascending: false }),
    supabase.from("payouts").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
    supabase.from("notifications").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
  ]);

  if (profileRow) {
    displayName = profileRow.display_name || authUser.email?.split("@")[0] || "Competitor";
    avatarUrl = profileRow.avatar_url || "";
    role = profileRow.role || "USER";
  }

  if (gameAccountRow) {
    inGameName = gameAccountRow.in_game_name || "";
    freeFireUid = gameAccountRow.game_uid || "";
  }

  if (dbRegs) myRegistrations = dbRegs;
  if (dbPayments) myPayments = dbPayments;
  if (dbRewards) myRewards = dbRewards;
  if (dbPayouts) myPayouts = dbPayouts;
  if (dbNotifs) notifications = dbNotifs;

  const totalEarningsCents = myRewards.reduce((acc: number, r: any) => acc + (r.amount_cents || 0), 0);

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
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white text-xs font-display font-bold uppercase tracking-wider transition-all shadow-md shadow-brand-crimson/20 hover:shadow-brand-crimson/35 active:scale-[0.98]"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Profile & Gaming Accounts</span>
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white transition-all shadow-sm"
              >
                <span>Onboarding Wizard</span>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-red-500/10 hover:text-red-400 border border-surface-border text-xs font-mono text-slate-600 dark:text-gray-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-mono">
            <span>Tournaments Joined</span>
            <Trophy className="w-4 h-4 text-brand-crimson" />
          </div>
          <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
            {myRegistrations.length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-mono">
            <span>Confirmed Tickets</span>
            <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
          </div>
          <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
            {
              myRegistrations.filter(
                (r) => r.status === "APPROVED" || r.status === "CHECKED_IN"
              ).length
            }
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-mono">
            <span>Total Payments</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
            {myPayments.length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-mono">
            <span>Account Security</span>
            <Shield className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-sm font-bold text-brand-emerald font-mono pt-1">
            PROTECTED
          </div>
        </div>
      </div>

      {/* Main Grid: Registrations vs Alerts & Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Tournament Registrations & Live Room Gates */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  My Tournament Registrations
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 font-sans">
                  Active entries, check-in windows, and room credentials
                </p>
              </div>
              <Link
                href="/tournaments"
                className="text-xs font-mono text-brand-crimson hover:underline"
              >
                Browse All Cups →
              </Link>
            </div>

            <div className="space-y-3">
              {myRegistrations.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-surface-200 border border-surface-border space-y-3">
                  <Trophy className="w-8 h-8 text-gray-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-800 dark:text-gray-200">
                    No tournament registrations yet
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Browse open tournaments and join your first competitive cup.
                  </p>
                  <Link
                    href="/tournaments"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white text-xs font-display font-bold uppercase tracking-wider transition-all shadow-md shadow-brand-crimson/20"
                  >
                    <span>Find Tournaments</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                myRegistrations.map((reg) => {
                  const dbTour = reg.tournaments;
                  const mockTour = !dbTour ? dataStore.getTournament(reg.tournament_id) : null;
                  const tournament = dbTour || mockTour;

                  if (!tournament) return null;

                  const tourId = tournament.id || reg.tournament_id;
                  const tourTitle = tournament.title || "Official Tournament";
                  const tourMode = tournament.mode || "Battle Royale";
                  const tourStart = tournament.scheduled_start_at || (tournament as any).match_start;
                  const tourPool = tournament.main_prize_pool_cents || 100000;
                  const tourCurrency = tournament.currency || "BDT";

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
                              Slot #{reg.slot_number || "—"}
                            </span>
                            <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                              {tourTitle}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-mono">
                            {tourMode} {tourStart ? `• Starts ${formatDateTime(tourStart)}` : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {reg.status === "CHECKED_IN" ? (
                            <Badge variant="emerald">Checked In</Badge>
                          ) : reg.status === "APPROVED" ? (
                            <Badge variant="cyan">Paid / Confirmed</Badge>
                          ) : reg.status === "PAYMENT_SUBMITTED" ? (
                            <Badge variant="gold">Verifying Payment</Badge>
                          ) : (
                            <Badge variant="gold">Payment Pending</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-surface-border/60 text-xs font-mono">
                        <div className="flex items-center gap-4 text-slate-600 dark:text-gray-400">
                          <span>
                            Prize Pool:{" "}
                            <strong className="text-slate-900 dark:text-gray-200 font-bold">
                              {formatCurrency(tourPool, tourCurrency)}
                            </strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPaid ? (
                            <Link
                              href={`/tournaments/${tourId}/room`}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold uppercase transition-colors text-[11px]"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Room Gate</span>
                            </Link>
                          ) : reg.status === "PAYMENT_SUBMITTED" ? (
                            <>
                              <Link
                                href={`/tournaments/${tourId}/register`}
                                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold uppercase transition-all text-[11px]"
                              >
                                <Clock className="w-3 h-3" />
                                <span>Verifying TrxID</span>
                              </Link>
                              <Link
                                href={`/tournaments/${tourId}/room`}
                                className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-700 dark:text-gray-300 flex items-center gap-1 font-bold uppercase transition-colors text-[11px]"
                              >
                                <Lock className="w-3 h-3" />
                                <span>Room Gate</span>
                              </Link>
                            </>
                          ) : (
                            <Link
                              href={`/tournaments/${tourId}/register`}
                              className="px-3 py-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white flex items-center gap-1 font-bold uppercase transition-all text-[11px] shadow-sm"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Submit Payment</span>
                            </Link>
                          )}
                          <Link
                            href={`/tournaments/${tourId}`}
                            className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-700 dark:text-gray-300 font-bold uppercase transition-colors text-[11px]"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Payment History Stream */}
          <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              bKash / Nagad Transaction Submissions
            </h3>

            {myPayments.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-gray-500 font-mono py-4 text-center">
                No payment transactions recorded for your account.
              </p>
            ) : (
              <div className="divide-y divide-surface-border/60">
                {myPayments.map((p) => (
                  <div
                    key={p.id}
                    className="py-3 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white uppercase text-cyan-600 dark:text-cyan-400">
                          {p.payment_method}
                        </span>
                        <span className="text-slate-600 dark:text-gray-300 font-bold">{p.transaction_id}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-gray-500">
                        {formatDateTime(p.created_at || p.submitted_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(p.amount_cents, p.currency || "BDT")}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === "VERIFIED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : p.status === "REJECTED"
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Notifications & Quick Profile Setup */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                  Alerts & Updates
                </h3>
              </div>
              <Badge variant="surface">{notifications.length}</Badge>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-gray-500 font-mono py-4 text-center">
                You are all caught up! No unread notifications.
              </p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl bg-surface-200 border border-surface-border space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-500 font-mono">
                        {formatDateTime(n.created_at)}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-sans">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Help & Fair Play */}
          <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 space-y-3">
            <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase">
              Free Fire Room Guidelines
            </h4>
            <ul className="text-xs text-slate-600 dark:text-gray-400 space-y-2 list-disc list-inside font-sans">
              <li>Room ID & Password release 30 minutes before match start.</li>
              <li>Always check in before the 15-minute check-in deadline.</li>
              <li>Only registered Free Fire UIDs are permitted inside the lobby.</li>
              <li>Spectators or unverified participants will be kicked immediately.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
