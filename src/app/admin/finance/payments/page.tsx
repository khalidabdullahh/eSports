import { dataStore } from "@/lib/store";
import { PaymentVerificationClient } from "./payment-verification-client";
import { DollarSign, Shield } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PaymentManagementPage() {
  const payments = dataStore.getPayments();
  const ledger = dataStore.getLedger();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Shield className="w-4 h-4" />
            <span>FINANCE DESK & AUDIT LEDGER</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            Payment Verification Queue
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Server-side verification of bKash, Nagad, and Rocket registration payments
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

      <PaymentVerificationClient initialPayments={payments} />
    </div>
  );
}
