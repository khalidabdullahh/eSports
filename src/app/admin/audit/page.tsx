import { dataStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { History, Shield, Filter } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AuditLogsPage() {
  const auditLogs = dataStore.getAuditLogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold mb-1">
            <History className="w-4 h-4" />
            <span>IMMUTABLE SYSTEM RECORD</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            Platform Audit Logs
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Strict append-only chronicle of all administrative actions, room decryptions, and score adjustments
          </p>
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-gray-300 text-xs font-medium border border-surface-border transition-colors self-start"
        >
          Back to Admin Portal
        </Link>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl bg-surface-100 border border-surface-border overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
            Event Log Stream ({auditLogs.length} Entries)
          </h3>
          <Badge variant="surface">APPEND-ONLY</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-surface-border bg-surface-200/50">
                <th className="py-3 px-3">Log ID</th>
                <th className="py-3 px-3">Actor</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Entity Type</th>
                <th className="py-3 px-3">Entity ID</th>
                <th className="py-3 px-3">Metadata</th>
                <th className="py-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-3 text-gray-400 font-bold">{log.id}</td>
                  <td className="py-3 px-3 text-cyan-300 font-sans font-semibold">
                    {log.actor_name || log.actor_user_id || "System"}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-surface-elevated border border-surface-border font-bold text-white">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 uppercase text-gray-400">{log.entity_type}</td>
                  <td className="py-3 px-3 text-gray-300 max-w-[120px] truncate">
                    {log.entity_id}
                  </td>
                  <td className="py-3 px-3 text-gray-400 max-w-xs truncate">
                    {JSON.stringify(log.metadata || {})}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-500">
                    {formatDateTime(log.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
