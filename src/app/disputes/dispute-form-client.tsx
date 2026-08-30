"use client";

import React, { useState, useTransition } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
} from "lucide-react";
import { submitDisputeAction } from "@/app/actions/tournament-actions";

export function DisputeFormClient() {
  const [tournamentId, setTournamentId] = useState("tournament-night-battle-solo");
  const [matchId, setMatchId] = useState("match-night-battle-round-1");
  const [reason, setReason] = useState("Placement points discrepancy");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError("Please describe the issue or discrepancy in detail.");
      return;
    }

    startTransition(async () => {
      const res = await submitDisputeAction(
        tournamentId,
        matchId,
        reason,
        description.trim(),
        evidenceUrl.trim() || "https://example.com/screenshot.png"
      );

      if (!res.success) {
        setError(res.error || "Failed to submit dispute.");
        return;
      }

      setIsSubmitted(true);
    });
  };

  if (isSubmitted) {
    return (
      <div className="p-6 rounded-2xl bg-surface-200 border border-emerald-500/30 text-center space-y-3 shadow-xl">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-brand-emerald flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
          Dispute Claim Logged
        </h3>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          Your match report has been entered into the referee review desk. Official tournament arbiters will inspect the logs and replay screenshots before final payout authorization.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setDescription("");
            setEvidenceUrl("");
          }}
          className="text-xs font-mono font-bold text-brand-crimson hover:underline pt-2"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-500 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
            Tournament Arena
          </label>
          <select
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-sans font-semibold"
          >
            <option value="tournament-night-battle-solo">Night Battle — Solo Cup</option>
            <option value="tournament-squad-championship">Squad Championship 4v4</option>
            <option value="tournament-duo-blitz">Duo Blitz Qualifiers</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
            Claim Category
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-crimson font-sans font-semibold"
          >
            <option value="Placement points discrepancy">Placement Rank Discrepancy</option>
            <option value="Kill count error">Kill Count / Frag Discrepancy</option>
            <option value="Suspected rule violation">Suspected Unfair Play / Rule Violation</option>
            <option value="Payment verification delay">Entry Fee Verification Issue</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
          Detailed Incident Report *
        </label>
        <textarea
          rows={3}
          required
          placeholder="Describe exactly what occurred (e.g. I was placed 3rd instead of 4th at 22:45 UTC)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-sans font-medium"
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1">
          Screenshot / Match End Screen URL
        </label>
        <input
          type="url"
          placeholder="https://imgur.com/screenshot.png or image host"
          value={evidenceUrl}
          onChange={(e) => setEvidenceUrl(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-crimson/25 active:scale-[0.98] disabled:opacity-50"
      >
        <span>{isPending ? "Submitting to Referees..." : "Submit Formal Dispute"}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
