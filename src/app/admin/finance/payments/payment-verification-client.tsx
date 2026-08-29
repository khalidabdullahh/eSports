"use client";

import React, { useState, useTransition } from "react";
import { Payment } from "@/types";
import {
  verifyPaymentAction,
  rejectPaymentAction,
} from "@/app/actions/tournament-actions";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  DollarSign,
} from "lucide-react";

interface PaymentVerificationClientProps {
  initialPayments: Payment[];
}

export function PaymentVerificationClient({
  initialPayments,
}: PaymentVerificationClientProps) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [filter, setFilter] = useState<"ALL" | "SUBMITTED" | "VERIFIED" | "REJECTED">("ALL");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<string | null>(null);

  const handleVerify = (paymentId: string) => {
    startTransition(async () => {
      const res = await verifyPaymentAction(paymentId);
      if (res.success && res.payment) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? res.payment! : p))
        );
        setNotification(`Payment ${res.payment.transaction_id} verified & credited to ledger!`);
      }
    });
  };

  const handleReject = (paymentId: string) => {
    const reason = prompt("Enter reason for rejection (e.g. Invalid Transaction ID / Amount mismatch):");
    if (!reason) return;

    startTransition(async () => {
      const res = await rejectPaymentAction(paymentId, reason);
      if (res.success && res.payment) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? res.payment! : p))
        );
        setNotification(`Payment rejected. Reason logged to audit.`);
      }
    });
  };

  const filteredPayments = payments.filter((p) => {
    if (filter !== "ALL" && p.status !== filter) return false;
    if (search) {
      const query = search.toLowerCase();
      return (
        p.transaction_id.toLowerCase().includes(query) ||
        p.user?.display_name.toLowerCase().includes(query) ||
        p.user_id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between">
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-lg border border-surface-border text-xs">
          {(["ALL", "SUBMITTED", "VERIFIED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md font-mono uppercase transition-all ${
                filter === tab
                  ? "bg-cyan-500 text-black font-bold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab === "SUBMITTED" ? "Pending" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search TrxID or Player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-100 border border-surface-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-surface-100 border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-surface-border bg-surface-200/50">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Warrior</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No transactions matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-elevated/40">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {p.transaction_id}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-gray-200">
                      {p.user?.display_name || p.user_id}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-cyan-400">
                      {p.payment_method}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">
                      {formatCurrency(p.amount_cents, p.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {formatDateTime(p.submitted_at)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          p.status === "VERIFIED"
                            ? "emerald"
                            : p.status === "REJECTED"
                            ? "surface"
                            : "gold"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {p.status === "SUBMITTED" ? (
                        <>
                          <button
                            onClick={() => handleVerify(p.id)}
                            disabled={isPending}
                            className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[11px] transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(p.id)}
                            disabled={isPending}
                            className="px-2.5 py-1 rounded bg-red-600/20 hover:bg-red-600 hover:text-white text-red-400 border border-red-500/30 uppercase text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-gray-500">
                          {p.status === "VERIFIED" ? `Verified` : `Rejected`}
                        </span>
                      )}
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
