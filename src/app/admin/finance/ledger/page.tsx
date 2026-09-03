import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  Filter,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinancialLedgerPage() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let ledger: any[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("financial_ledger")
      .select("*")
      .order("created_at", { ascending: false });

    ledger = data || [];
  }

  // Metrics
  const grossCollectedCents = ledger
    .filter((e) => e.type === "ENTRY_FEE" && e.direction === "CREDIT")
    .reduce((acc, e) => acc + e.amount_cents, 0);

  const mainPrizeLiabilitiesCents = ledger
    .filter((e) => e.type === "PRIZE_LIABILITY" && e.direction === "DEBIT")
    .reduce((acc, e) => acc + e.amount_cents, 0);

  const performanceLiabilitiesCents = ledger
    .filter((e) => e.type === "PERFORMANCE_REWARD" && e.direction === "DEBIT")
    .reduce((acc, e) => acc + e.amount_cents, 0);

  const netPlatformMarginCents =
    grossCollectedCents - mainPrizeLiabilitiesCents - performanceLiabilitiesCents;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 sm:pb-24 space-y-8 animate-admin-portal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Shield className="w-4 h-4" />
            <span>IMMUTABLE DOUBLE-ENTRY AUDIT VAULT</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase">
            Financial Ledger Stream
          </h1>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
            Strict append-only financial records stored in integer minor units (poisha / cents). Zero floating point drift.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-slate-700 dark:text-gray-300 text-xs font-medium border border-surface-border transition-colors font-display uppercase tracking-wider"
          >
            Admin Portal
          </Link>
          <Link
            href="/admin/finance/payments"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors font-display uppercase tracking-wider"
          >
            Payment Verification Queue →
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
          <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase font-bold">Gross Entry Fees</span>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {formatCurrency(grossCollectedCents, "BDT")}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
          <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase font-bold">Podium Liabilities</span>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {formatCurrency(mainPrizeLiabilitiesCents, "BDT")}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
          <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase font-bold">Fragger Liabilities</span>
          <div className="text-2xl font-black font-mono text-brand-crimson">
            {formatCurrency(performanceLiabilitiesCents, "BDT")}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-surface-border space-y-1">
          <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase font-bold">Net Platform Margin</span>
          <div className={`text-2xl font-black font-mono ${netPlatformMarginCents >= 0 ? "text-cyan-600 dark:text-cyan-400" : "text-red-500"}`}>
            {formatCurrency(netPlatformMarginCents, "BDT")}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-surface-100 border border-surface-border overflow-hidden shadow-xl p-5 space-y-4">
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Transaction Stream ({ledger.length} Records)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-600 dark:text-gray-400 border-b border-surface-border bg-surface-200/50">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-gray-500">
                    No financial ledger transactions recorded yet. Entries are immutably posted as payments and payouts are verified.
                  </td>
                </tr>
              ) : (
                ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-surface-elevated/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {entry.type}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${entry.direction === "CREDIT" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                        {entry.direction === "CREDIT" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                        {entry.direction}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                      {formatCurrency(entry.amount_cents, entry.currency || "BDT")}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-gray-400">
                      {entry.account_reference || "N/A"}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-700 dark:text-gray-300">
                      {entry.description}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 dark:text-gray-400">
                      {formatDateTime(entry.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
