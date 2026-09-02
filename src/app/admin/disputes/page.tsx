import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DisputeResolutionClient } from "./dispute-client";
import { AlertTriangle, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DisputesManagementPage() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let disputes: any[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("disputes")
      .select("*")
      .order("created_at", { ascending: false });

    disputes = data || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>DISPUTE RESOLUTION & FAIR PLAY DESK</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase">
            Match Result Disputes
          </h1>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
            Review player claims filed during the post-match dispute window
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
            href="/live"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors font-display uppercase tracking-wider"
          >
            Live Telemetry Feed →
          </Link>
        </div>
      </div>

      <DisputeResolutionClient initialDisputes={disputes} />
    </div>
  );
}
