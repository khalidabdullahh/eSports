import { dataStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, UserX, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ModerationPage() {
  const reports = [
    {
      id: "rep-101",
      target_user: "GHOST〆OP",
      target_uid: "6120938472",
      violation_type: "EMULATOR_USAGE",
      description: "Player moved at abnormal keyboard velocity in mobile-only lobby",
      status: "UNDER_INVESTIGATION",
      created_at: "2026-08-29T16:19:00Z",
    },
    {
      id: "rep-102",
      target_user: "UNKNOWN_GUEST",
      target_uid: "9982711029",
      violation_type: "CHEATING_AUTO_AIM",
      description: "Headshot ratio 100% through smoke grenade",
      status: "BANNED_PERMANENT",
      created_at: "2026-08-28T14:22:00Z",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>FAIR PLAY & ANTI-CHEAT DESK</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            Player Moderation & Hardware UID Bans
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Investigate reported players, verify telemetry logs, and issue Free Fire UID blacklists
          </p>
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-gray-300 text-xs font-medium border border-surface-border transition-colors self-start"
        >
          Back to Admin Portal
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-red-400" />
                <span className="font-bold text-white text-sm">{r.target_user}</span>
                <span className="text-[11px] font-mono text-gray-500">
                  (UID: {r.target_uid})
                </span>
              </div>
              <Badge variant={r.status.includes("BANNED") ? "live" : "gold"}>
                {r.status}
              </Badge>
            </div>

            <div className="text-xs font-mono text-amber-400">
              Violation: <strong>{r.violation_type}</strong>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">{r.description}</p>

            <div className="pt-2 flex justify-end gap-2 text-xs font-mono">
              <button className="px-3 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white uppercase font-bold text-[11px] transition-colors">
                Issue Free Fire UID Ban
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
