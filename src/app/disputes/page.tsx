import Link from "next/link";
import { AlertTriangle, ArrowLeft, Shield } from "lucide-react";
import { DisputeFormClient } from "./dispute-form-client";

export default function DisputesPublicPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Arena Home</span>
      </Link>

      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="border-b border-surface-border pb-5 space-y-1">
          <div className="flex items-center gap-2 text-brand-gold text-xs font-mono font-bold mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>PLAYER FAIR PLAY & INTEGRITY PROTOCOL</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Dispute Resolution Desk
          </h1>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-sans leading-relaxed">
            AreNex maintains an open dispute window following every tournament match. If you encounter a score discrepancy or rule violation, file your evidence below for official referee review.
          </p>
        </div>

        <DisputeFormClient />
      </div>
    </div>
  );
}
