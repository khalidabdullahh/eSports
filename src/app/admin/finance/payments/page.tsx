import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PaymentVerificationClient } from "./payment-verification-client";
import { DollarSign, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PaymentManagementPage() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let payments: any[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    const [pRes, profRes, tRes] = await Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, display_name, username, email"),
      supabase.from("tournaments").select("id, title, entry_fee_cents, currency"),
    ]);

    const profileMap = new Map((profRes.data || []).map((p: any) => [p.id, p]));
    const tourMap = new Map((tRes.data || []).map((t: any) => [t.id, t]));

    payments = (pRes.data || []).map((p: any) => {
      const userProf = profileMap.get(p.user_id);
      const tour = tourMap.get(p.tournament_id);
      return {
        ...p,
        user: userProf || {
          display_name: "Player",
          username: "player",
          email: userProf?.email,
        },
        tournament: tour || {
          title: "Tournament",
          entry_fee_cents: p.amount_cents,
          currency: p.currency,
        },
      };
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 sm:pb-24 space-y-6 animate-admin-portal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Shield className="w-4 h-4" />
            <span>FINANCE DESK & AUDIT LEDGER</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase">
            Payment Verification Queue
          </h1>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
            Server-side verification of bKash, Nagad, and Rocket registration payments
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
            href="/admin/finance/ledger"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors font-display uppercase tracking-wider"
          >
            View Financial Ledger →
          </Link>
        </div>
      </div>

      <PaymentVerificationClient initialPayments={payments} />
    </div>
  );
}
