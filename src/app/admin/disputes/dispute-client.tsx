"use client";

import React, { useState, useTransition } from "react";
import { Dispute } from "@/types";
import {
  submitDisputeAction,
  resolveDisputeAction,
} from "@/app/actions/tournament-actions";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  ShieldAlert,
} from "lucide-react";

interface DisputeResolutionClientProps {
  initialDisputes: Dispute[];
}

export function DisputeResolutionClient({
  initialDisputes,
}: DisputeResolutionClientProps) {
  const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);
  const [isCreating, setIsCreating] = useState(false);
  const [reason, setReason] = useState("Kill Count Mismatch");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("https://imgur.com/example-scoreboard.png");
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    startTransition(async () => {
      const res = await submitDisputeAction(
        "tourn-night-battle-solo-cup",
        "match-night-battle-round-1",
        reason,
        description.trim(),
        evidenceUrl.trim()
      );

      if (res.success && res.dispute) {
        setDisputes((prev) => [res.dispute!, ...prev]);
        setIsCreating(false);
        setDescription("");
        setStatusMessage("Dispute submitted into official review queue!");
      }
    });
  };

  const handleResolve = (disputeId: string, status: "ACCEPTED" | "REJECTED") => {
    const notes = prompt(`Enter resolution notes for marking dispute as ${status}:`);
    if (!notes) return;

    startTransition(async () => {
      const res = await resolveDisputeAction(disputeId, status, notes);
      if (res.success && res.dispute) {
        setDisputes((prev) =>
          prev.map((d) => (d.id === disputeId ? res.dispute! : d))
        );
        setStatusMessage(`Dispute ${disputeId} marked as ${status}.`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between">
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
          Active Dispute Tickets ({disputes.length})
        </h3>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          size="sm"
          variant="outline"
          className="text-xs uppercase font-mono"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          File New Dispute Ticket
        </Button>
      </div>

      {/* New Dispute Modal Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateDispute}
          className="p-5 rounded-xl bg-surface-100 border border-amber-500/40 space-y-4 animate-fadeIn"
        >
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <h4 className="font-display text-sm font-bold uppercase tracking-wider">
              File Official Match Dispute
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">
                Dispute Category *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-surface-border text-xs text-white focus:outline-none"
              >
                <option>Kill Count Mismatch</option>
                <option>Incorrect Placement Assigned</option>
                <option>Teaming / Cheating Accusation</option>
                <option>Unauthorized Substitute / Roster Swap</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1">
                Evidence URL (Screenshot / Video) *
              </label>
              <input
                type="url"
                required
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-surface-border text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-gray-300 block mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the discrepancy citing match timeline, screenshot timestamp, and affected participants..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-surface-border text-xs text-white focus:outline-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              isLoading={isPending}
              className="uppercase font-mono text-xs font-bold"
            >
              Submit Dispute
            </Button>
          </div>
        </form>
      )}

      {/* Disputes Cards List */}
      <div className="space-y-4">
        {disputes.length === 0 ? (
          <div className="p-8 rounded-xl bg-surface-100 border border-surface-border text-center text-gray-500 text-xs font-mono">
            No active disputes filed for this match. Fair play score 100%.
          </div>
        ) : (
          disputes.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-400 font-bold">{d.id}</span>
                  <span className="font-semibold text-white text-sm">{d.reason}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 font-mono">
                    {formatDateTime(d.created_at)}
                  </span>
                  <Badge
                    variant={
                      d.status === "ACCEPTED"
                        ? "emerald"
                        : d.status === "REJECTED"
                        ? "surface"
                        : "gold"
                    }
                  >
                    {d.status}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">{d.description}</p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
                <div className="flex items-center gap-4 text-gray-400">
                  <span>
                    Reported by:{" "}
                    <strong className="text-cyan-300">{d.reporter_name || d.reporter_id}</strong>
                  </span>
                  {d.evidence_url && (
                    <a
                      href={d.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      View Evidence Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {d.status === "OPEN" ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleResolve(d.id, "ACCEPTED")}
                      disabled={isPending}
                      className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[11px] transition-colors"
                    >
                      Accept & Adjust
                    </button>
                    <button
                      onClick={() => handleResolve(d.id, "REJECTED")}
                      disabled={isPending}
                      className="px-3 py-1 rounded bg-red-600/20 hover:bg-red-600 hover:text-white text-red-400 border border-red-500/30 uppercase text-[11px] transition-colors"
                    >
                      Reject Claim
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-400">
                    Resolution:{" "}
                    <span className="text-gray-200">{d.resolution_notes || "Closed"}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
