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
      <div className="rounded-xl bg-surface-100 border border-surface-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-500 dark:text-gray-400 border-b border-surface-border bg-surface-200/60">
                <th className="py-3.5 px-4 font-bold uppercase">Transaction ID</th>
                <th className="py-3.5 px-4 font-bold uppercase">Warrior & Free Fire UID</th>
                <th className="py-3.5 px-4 font-bold uppercase">Tournament</th>
                <th className="py-3.5 px-4 font-bold uppercase">Method & Sender</th>
                <th className="py-3.5 px-4 font-bold uppercase">Amount</th>
                <th className="py-3.5 px-4 font-bold uppercase">Submitted</th>
                <th className="py-3.5 px-4 font-bold uppercase">Status</th>
                <th className="py-3.5 px-4 font-bold uppercase text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 dark:text-gray-500">
                    No transactions matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-cyan-500 dark:text-cyan-400 tracking-wider">
                          {p.transaction_id}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(p.transaction_id);
                            setNotification(`Copied TrxID: ${p.transaction_id}`);
                          }}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded"
                          title="Copy TrxID"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-gray-200 block">
                          {p.user?.display_name || p.user_id}
                        </span>
                        <span className="text-[11px] text-brand-crimson font-bold block">
                          IGN: {p.in_game_name || "ALPHA〆KILLER"}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400">
                          UID: <strong className="text-slate-700 dark:text-gray-300">{p.free_fire_uid || "1098234871"}</strong>
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-800 dark:text-gray-300 font-medium">
                      {p.tournament?.title || "Tournament"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-cyan-600 dark:text-cyan-400 font-bold block">
                        {p.payment_method}
                      </span>
                      {p.sender_phone ? (
                        <span className="text-[11px] text-slate-600 dark:text-gray-400 block font-mono">
                          {p.sender_phone}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-gray-500 italic">
                          No sender #
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-500 dark:text-amber-400">
                      {formatCurrency(p.amount_cents, p.currency || "BDT")}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-gray-400 text-[11px]">
                      {formatDateTime(p.created_at || p.submitted_at)}
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleVerify(p.id)}
                            disabled={isPending}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[11px] shadow-sm transition-all active:scale-95"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(p.id)}
                            disabled={isPending}
                            className="px-2.5 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 border border-red-500/30 uppercase text-[11px] transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 dark:text-gray-500 font-bold uppercase">
                          {p.status === "VERIFIED" ? `✓ Confirmed` : `✗ Rejected`}
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
