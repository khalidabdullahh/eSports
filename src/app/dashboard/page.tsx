import Link from "next/link";
import { dataStore } from "@/lib/store";
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
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function PlayerDashboardPage() {
  const currentUser = dataStore.getCurrentUser();
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
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-100 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar_url}
            alt={currentUser.display_name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
                {currentUser.display_name}
              </h1>
              <Badge variant="cyan">{currentUser.role}</Badge>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              IGN: <strong className="text-cyan-300">{currentUser.in_game_name}</strong> • Free Fire UID: {currentUser.free_fire_uid}
            </p>
          </div>
        </div>

        {/* Quick Earnings Box */}
        <div className="p-4 rounded-xl bg-surface-200 border border-surface-border text-left sm:text-right">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
            Career Tournament Earnings
          </span>
          <div className="text-2xl font-black font-display text-amber-400">
            {formatCurrency(totalEarningsCents, "BDT")}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {myRewards.length} tournament prize awards
          </span>
        </div>
      </div>

      {/* Lifecycle Stepper / Active Tournament Status */}
      <div className="rounded-xl bg-surface-100 border border-surface-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h2 className="font-display text-lg font-black text-white uppercase tracking-wider">
            Active Tournament Lifecycle Progression
          </h2>
          <span className="text-xs font-mono text-cyan-400">Night Battle — Solo Cup</span>
        </div>

        {/* 6-Step Progression Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 text-center text-xs font-mono">
          <div className="p-3 rounded-lg bg-surface-200 border border-emerald-500/30 text-emerald-400 space-y-1">
            <span className="text-base block">✓</span>
            <span className="font-bold block">1. Registration</span>
            <span className="text-[10px] text-gray-400 block">Slot Confirmed</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-emerald-500/30 text-emerald-400 space-y-1">
            <span className="text-base block">✓</span>
            <span className="font-bold block">2. Payment</span>
            <span className="text-[10px] text-gray-400 block">Verified (৳50)</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-emerald-500/30 text-emerald-400 space-y-1">
            <span className="text-base block">✓</span>
            <span className="font-bold block">3. Check-In</span>
            <span className="text-[10px] text-gray-400 block">Checked In</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-cyan-500/40 text-cyan-300 space-y-1">
            <Unlock className="w-4 h-4 mx-auto text-cyan-400" />
            <span className="font-bold block">4. Room Key</span>
            <span className="text-[10px] text-cyan-400 block">Decrypted</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-red-500/30 text-red-400 space-y-1">
            <Radio className="w-4 h-4 mx-auto text-red-500 animate-pulse" />
            <span className="font-bold block">5. Match Live</span>
            <span className="text-[10px] text-gray-400 block">Round 1</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-200 border border-surface-border text-gray-400 space-y-1">
            <Clock className="w-4 h-4 mx-auto text-gray-500" />
            <span className="font-bold block">6. Rewards</span>
            <span className="text-[10px] text-gray-500 block">Awaiting Final</span>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <Link
            href="/tournaments/tourn-night-battle-solo-cup/room"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Unlock className="w-3.5 h-3.5" />
            View My Match Room Key & Password
          </Link>
        </div>
      </div>

      {/* Grid: My Registrations & Payments + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registrations & Payments (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                My Tournament Registrations ({myRegistrations.length})
              </h3>
              <Link
                href="/tournaments"
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                + Register New
              </Link>
            </div>

            <div className="space-y-3">
              {myRegistrations.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-surface-200 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div>
                    <span className="font-bold text-white font-sans text-sm block">
                      Night Battle — Solo Cup
                    </span>
                    <span className="text-gray-400">
                      Slot #{r.slot_number} • Registered on {formatDateTime(r.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={r.status === "CHECKED_IN" ? "emerald" : "gold"}>
                      {r.status}
                    </Badge>
                    <Link
                      href={`/tournaments/${r.tournament_id}/room`}
                      className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-cyan-500 hover:text-black text-cyan-300 border border-surface-border transition-all"
                    >
                      Room Access →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payments & Payout History */}
          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-4">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-surface-border">
              Financial Receipts & Payouts
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {myPayments.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg bg-surface-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-gray-200">
                      Entry Fee • {p.payment_method.toUpperCase()} ({p.transaction_id})
                    </span>
                    <span className="text-gray-500 text-[10px] block">
                      {formatDateTime(p.submitted_at)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-400 block">
                      {formatCurrency(p.amount_cents, p.currency)}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      ● Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications & Announcements (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                Notifications
              </h3>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-lg bg-surface-200 border border-surface-border text-xs space-y-1"
                >
                  <span className="font-bold text-white block">{n.title}</span>
                  <p className="text-gray-400 text-[11px] leading-relaxed">{n.message}</p>
                  {n.link_url && (
                    <Link
                      href={n.link_url}
                      className="text-[11px] text-cyan-400 hover:underline block pt-1 font-mono"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
