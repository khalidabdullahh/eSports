import { dataStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  Filter,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function FinancialLedgerPage() {
  const ledger = dataStore.getLedger();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Shield className="w-4 h-4" />
            <span>IMMUTABLE DOUBLE-ENTRY AUDIT VAULT</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            Financial Ledger Stream
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Strict append-only financial records stored in integer minor units (poisha / cents). Zero floating point drift.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-gray-300 text-xs font-medium border border-surface-border transition-colors"
          >
            Admin Portal
          </Link>
          <Link
            href="/admin/finance/payments"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors"
          >
            Payment Verification Queue →
          </Link>
        </div>
      </div>

      {/* Financial Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
            Gross Collections (Credit)
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400">
            {formatCurrency(grossCollectedCents, "BDT")}
          </div>
          <span className="text-[11px] text-gray-500 font-mono">
            Player entry fees deposited
          </span>
        </div>

        <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
            Main Prize Pool Ring-fenced
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-amber-400">
            {formatCurrency(mainPrizeLiabilitiesCents, "BDT")}
          </div>
          <span className="text-[11px] text-gray-500 font-mono">
            Guaranteed podium liabilities
          </span>
        </div>

        <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
            Performance Pool Ring-fenced
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-cyan-400">
            {formatCurrency(performanceLiabilitiesCents, "BDT")}
          </div>
          <span className="text-[11px] text-gray-500 font-mono">
            Top fragger bonuses capped
          </span>
        </div>

        <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
            Projected Platform Margin
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">
            {formatCurrency(netPlatformMarginCents, "BDT")}
          </div>
          <span className="text-[11px] text-gray-500 font-mono">
            Platform gross retention
          </span>
        </div>
      </div>

      {/* Ledger Stream Table */}
      <div className="rounded-xl bg-surface-100 border border-surface-border overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
            Double-Entry Transaction Stream ({ledger.length} Records)
          </h3>
          <Badge variant="surface">APPEND-ONLY</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-surface-border/80 pb-2">
                <th className="pb-3 px-3">Entry ID</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Direction</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Description / Reference</th>
                <th className="pb-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {ledger.map((entry) => {
                const isCredit = entry.direction === "CREDIT";
                return (
                  <tr key={entry.id} className="hover:bg-surface-elevated/40">
                    <td className="py-3 px-3 text-gray-400">{entry.id}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-surface-elevated border border-surface-border text-gray-200 font-bold">
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {isCredit ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          CREDIT (+)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-bold">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          DEBIT (-)
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-3 px-3 font-bold text-sm ${
                        isCredit ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isCredit ? "+" : "-"}
                      {formatCurrency(entry.amount_cents, entry.currency)}
                    </td>
                    <td className="py-3 px-3 text-gray-300 max-w-sm">
                      {entry.notes || `${entry.reference_type} ref: ${entry.reference_id || "N/A"}`}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-500">
                      {formatDateTime(entry.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
