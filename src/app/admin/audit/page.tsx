import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { History, Shield, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let auditLogs: any[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    auditLogs = data || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold mb-1">
            <History className="w-4 h-4" />
            <span>IMMUTABLE SYSTEM RECORD</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase">
            Platform Audit Logs
          </h1>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
            Strict append-only chronicle of all administrative actions, room decryptions, and score adjustments
          </p>
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-slate-700 dark:text-gray-300 text-xs font-medium border border-surface-border transition-colors self-start font-display uppercase tracking-wider"
        >
          Back to Admin Portal
        </Link>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-surface-100 border border-surface-border overflow-hidden p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Event Log Stream ({auditLogs.length} Entries)
          </h3>
          <Badge variant="surface">APPEND-ONLY</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-600 dark:text-gray-400 border-b border-surface-border bg-surface-200/50">
                <th className="py-3 px-3">Actor</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Target Type</th>
                <th className="py-3 px-3">Target ID</th>
                <th className="py-3 px-3">Details</th>
                <th className="py-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-gray-500">
                    No audit log events recorded yet. Logs will append automatically as administrative actions occur.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-elevated/40">
                    <td className="py-3 px-3 text-cyan-500 font-sans font-semibold">
                      {log.actor_id || "System"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-surface-elevated border border-surface-border font-bold text-slate-900 dark:text-white">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 uppercase text-slate-600 dark:text-gray-400">{log.target_type}</td>
                    <td className="py-3 px-3 text-slate-700 dark:text-gray-300 max-w-[120px] truncate">
                      {log.target_id}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-gray-400 max-w-xs truncate">
                      {JSON.stringify(log.details || {})}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 dark:text-gray-400">
                      {formatDateTime(log.created_at)}
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
