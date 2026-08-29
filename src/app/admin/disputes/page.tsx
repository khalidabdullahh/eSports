import { dataStore } from "@/lib/store";
import { DisputeResolutionClient } from "./dispute-client";
import { AlertTriangle, Shield } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DisputesManagementPage() {
  const disputes = dataStore.getDisputes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>DISPUTE RESOLUTION & FAIR PLAY DESK</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            Match Result Disputes
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Review player claims filed during the 15-minute post-match dispute window
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
            href="/live"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors"
          >
            Live Telemetry Feed →
          </Link>
        </div>
      </div>

      <DisputeResolutionClient initialDisputes={disputes} />
    </div>
  );
}
