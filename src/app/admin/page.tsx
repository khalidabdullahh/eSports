import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminConsoleClient } from "./admin-console-client";
import { Shield, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let tournaments: any[] = [];
  let payments: any[] = [];
  let registrations: any[] = [];
  let ledger: any[] = [];
  let disputes: any[] = [];
  let auditLogs: any[] = [];
  let matches: any[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    const [
      tRes,
      pRes,
      rRes,
      lRes,
      dRes,
      aRes,
      mRes,
      profRes,
    ] = await Promise.all([
      supabase.from("tournaments").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("tournament_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("financial_ledger").select("*").order("created_at", { ascending: false }),
      supabase.from("disputes").select("*").order("created_at", { ascending: false }),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("matches").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("profiles").select("id, display_name, username, email, free_fire_uid, in_game_name"),
    ]);

    const profileMap = new Map((profRes.data || []).map((p: any) => [p.id, p]));
    const tourMap = new Map((tRes.data || []).map((t: any) => [t.id, t]));

    tournaments = tRes.data || [];
    payments = (pRes.data || []).map((p: any) => {
      const userProf = profileMap.get(p.user_id);
      const tour = tourMap.get(p.tournament_id);
      return {
        ...p,
        user: userProf || {
          display_name: userProf?.display_name || userProf?.username || "Warrior",
          username: userProf?.username || "player",
          email: userProf?.email,
        },
        tournament: tour || {
          title: "Tournament",
          entry_fee_cents: p.amount_cents,
          currency: p.currency,
        },
      };
    });

    registrations = (rRes.data || []).map((r: any) => {
      const userProf = profileMap.get(r.user_id);
      const tour = tourMap.get(r.tournament_id);
      return {
        ...r,
        user: userProf || {
          display_name: userProf?.display_name || userProf?.username || "Warrior",
          username: userProf?.username || "player",
        },
        tournament: tour || {
          title: "Tournament",
        },
      };
    });

    ledger = lRes.data || [];
    disputes = dRes.data || [];
    auditLogs = aRes.data || [];
    matches = mRes.data || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-crimson font-bold mb-1">
            <Shield className="w-4 h-4" />
            <span>OPERATIONS & EXECUTIVE CONTROL DESK</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            ARENEX Operations Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-sans">
            Server-authoritative tournament management, payment verification desk, referee consoles, and privacy-protected financial ledger.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-surface-50 text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white border border-surface-border font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all font-display shadow-sm"
          >
            ← Public Site
          </Link>
          <Link
            href="/admin/tournaments/new"
            className="px-4 py-2 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-crimson/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tournament</span>
          </Link>
        </div>
      </div>

      <AdminConsoleClient
        initialTournaments={tournaments}
        initialPayments={payments}
        initialRegistrations={registrations}
        initialLedger={ledger}
        initialDisputes={disputes}
        initialAuditLogs={auditLogs}
        initialMatches={matches}
      />
    </div>
  );
}
