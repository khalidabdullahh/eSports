import Link from "next/link";
import { dataStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Trophy,
  DollarSign,
  Users,
  Radio,
  FileCheck,
  AlertTriangle,
  History,
  ArrowRight,
  TrendingUp,
  Edit3,
  UploadCloud,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const tournaments = dataStore.getTournaments();
  const liveTournament = tournaments.find((t) => t.status === "LIVE");
  const registrations = dataStore.getRegistrations();
  const pendingPayments = dataStore.getPayments().filter((p) => p.status === "SUBMITTED");
  const ledger = dataStore.getLedger();
  const disputes = dataStore.getDisputes();
  const auditLogs = dataStore.getAuditLogs();
  const rewards = dataStore.getRewards();

  // Compute ledger gross collection and liabilities
  const totalCollectedCents = ledger
    .filter((e) => e.type === "ENTRY_FEE" && e.direction === "CREDIT")
    .reduce((acc, e) => acc + e.amount_cents, 0);

  const totalPrizeLiabilitiesCents = ledger
    .filter((e) => (e.type === "PRIZE_LIABILITY" || e.type === "PERFORMANCE_REWARD") && e.direction === "DEBIT")
    .reduce((acc, e) => acc + e.amount_cents, 0);

  const netPlatformMarginCents = totalCollectedCents - totalPrizeLiabilitiesCents;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-crimson font-semibold mb-1">
            <Shield className="w-4 h-4" />
            <span>OPERATIONS & EXECUTIVE CONTROL DESK</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            ARENEX Operations Portal
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Server-authoritative tournament management, referee consoles, financial ledger, and compliance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {liveTournament && (
            <Link
              href={`/admin/referee/match-night-battle-round-1`}
              className="px-4 py-2 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-crimson/25 transition-all font-display"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Input & Upload Player Stats
            </Link>
          )}
          <Link
            href="/admin/finance/payments"
            className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-surface-50 text-gray-200 hover:text-white border border-surface-border font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all font-display"
          >
            <DollarSign className="w-3.5 h-3.5 text-brand-emerald" />
            Verify Payments ({pendingPayments.length})
          </Link>
        </div>
      </div>

      {/* Primary Action Banner: Live Website Player Stats Upload Desk */}
      <div className="p-6 rounded-2xl bg-brand-crimson/10 border border-brand-crimson/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-crimson animate-ping" />
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">
              Live Tournament Stats Upload Desk
            </h2>
          </div>
          <p className="text-xs text-gray-300 font-sans">
            Directly input player kills, placement ranks, and survival status, and publish to the live website with one click.
          </p>
        </div>
        <Link
          href="/admin/referee/match-night-battle-round-1"
          className="px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Input & Publish Stats</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Gross Collection</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400">
            {formatCurrency(totalCollectedCents, "BDT")}
          </div>
          <span className="text-[11px] text-gray-500 font-mono block">
            {ledger.filter((e) => e.type === "ENTRY_FEE").length} verified entries
          </span>
        </div>

        <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Prize Liabilities</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-amber-400">
            {formatCurrency(totalPrizeLiabilitiesCents, "BDT")}
          </div>
          <span className="text-[11px] text-gray-500 font-mono block">
            Guaranteed podium & performance pools
          </span>
        </div>

        <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Pending Verifications</span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-cyan-400">
            {pendingPayments.length}
          </div>
          <Link
            href="/admin/finance/payments"
            className="text-[11px] text-cyan-400 hover:underline font-mono block"
          >
            Review submission queue →
          </Link>
        </div>

        <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Active Disputes</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-red-400">
            {disputes.filter((d) => d.status === "OPEN").length}
          </div>
          <Link
            href="/admin/disputes"
            className="text-[11px] text-red-400 hover:underline font-mono block"
          >
            Review dispute claims →
          </Link>
        </div>
      </div>

      {/* Navigation Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/referee/match-night-battle-round-1"
          className="p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-cyan-500/40 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white uppercase group-hover:text-cyan-300">
            Referee Match Console
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Real-time live scoring, +1 kills, eliminations, placement records, and void/undo actions.
          </p>
        </Link>

        <Link
          href="/admin/finance/ledger"
          className="p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-emerald-500/40 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white uppercase group-hover:text-emerald-300">
            Financial Ledger
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Append-only double-entry audit ledger in integer minor units. Gross platform margin tracking.
          </p>
        </Link>

        <Link
          href="/admin/disputes"
          className="p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-amber-500/40 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white uppercase group-hover:text-amber-300">
            Dispute Resolution Desk
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Review screenshots, player claims, referee event logs, and resolve within the 15-min window.
          </p>
        </Link>

        <Link
          href="/admin/audit"
          className="p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-purple-500/40 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white uppercase group-hover:text-purple-300">
            Audit Trail
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Immutable log of all room decryptions, payment approvals, status transitions, and bans.
          </p>
        </Link>
      </div>

      {/* Active Tournaments Table */}
      <div className="rounded-xl bg-surface-100 border border-surface-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h3 className="font-display text-lg font-bold text-white uppercase">
            Platform Tournament Operations ({tournaments.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-surface-border pb-2">
                <th className="pb-3 px-3">Tournament</th>
                <th className="pb-3 px-3">Format</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Slots</th>
                <th className="pb-3 px-3">Prize Pool</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {tournaments.map((t) => (
                <tr key={t.id} className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-3 font-sans font-bold text-white">
                    {t.title}
                  </td>
                  <td className="py-3 px-3 text-gray-300">{t.format}</td>
                  <td className="py-3 px-3">
                    <Badge variant={t.status === "LIVE" ? "live" : "surface"}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-gray-300">
                    {t.current_participants_count} / {t.max_participants}
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-400">
                    {formatCurrency(
                      t.main_prize_pool_cents + t.performance_reward_pool_cents,
                      t.currency
                    )}
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <Link
                      href={`/tournaments/${t.slug || t.id}`}
                      className="text-cyan-400 hover:underline"
                    >
                      View
                    </Link>
                    {t.status === "LIVE" && (
                      <Link
                        href={`/admin/referee/match-night-battle-round-1`}
                        className="text-red-400 font-bold hover:underline"
                      >
                        Referee Desk
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
