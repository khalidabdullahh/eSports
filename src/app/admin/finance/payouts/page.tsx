import { dataStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PayoutManagementPage() {
  const payouts = dataStore.getPayouts();
  const rewards = dataStore.getRewards();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Shield className="w-4 h-4" />
            <span>FINANCE DESK & DISBURSEMENTS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            Prize & Reward Payout Queue
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Deterministic winnings calculated by RewardEngine queued for automated bKash disbursement
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
            href="/admin/finance/ledger"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors"
          >
            View Financial Ledger →
          </Link>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="rounded-xl bg-surface-100 border border-surface-border overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
            Disbursement Queue ({payouts.length} Transfers)
          </h3>
          <Badge variant="gold">DETERMINISTIC POOL ALLOCATIONS</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-surface-border bg-surface-200/50">
                <th className="py-3 px-3">Payout ID</th>
                <th className="py-3 px-3">Recipient</th>
                <th className="py-3 px-3">Gateway</th>
                <th className="py-3 px-3">Account Number</th>
                <th className="py-3 px-3">Disbursement Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No payouts queued yet. Finalize a match in the Referee Desk to compute rewards and generate payout entries.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-elevated/40">
                    <td className="py-3.5 px-3 text-gray-400">{p.id}</td>
                    <td className="py-3.5 px-3 font-sans font-bold text-white">
                      {p.recipient_name}
                    </td>
                    <td className="py-3.5 px-3 uppercase text-cyan-400 font-bold">
                      {p.payout_method}
                    </td>
                    <td className="py-3.5 px-3 text-gray-300">{p.account_number}</td>
                    <td className="py-3.5 px-3 font-bold text-amber-400 text-sm">
                      {formatCurrency(p.amount_cents, p.currency)}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={p.status === "COMPLETED" ? "emerald" : "gold"}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right text-gray-500">
                      {formatDateTime(p.created_at)}
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
