import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

export default function DisputesPublicPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
          <AlertTriangle className="w-4 h-4" />
          <span>PLAYER PROTECTIONS & INTEGRITY</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
          Dispute Resolution Center
        </h1>

        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <p>
            NexusOps provides an open 15-minute dispute window immediately following the submission of match results by official referees.
          </p>
          <p>
            If you experience a discrepancy with your recorded kills or final placement, you can file a formal ticket with screenshot or video proof.
          </p>
          <div className="pt-4 flex items-center gap-3">
            <Link
              href="/admin/disputes"
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2"
            >
              <span>Go to Dispute Management Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
