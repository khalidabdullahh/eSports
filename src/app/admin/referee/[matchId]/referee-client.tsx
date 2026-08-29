"use client";

import React, { useState, useTransition } from "react";
import { Match, MatchEvent, MatchParticipant, Tournament } from "@/types";
import {
  recordMatchEventAction,
  voidMatchEventAction,
  finalizeTournamentAction,
} from "@/app/actions/tournament-actions";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crosshair,
  Skull,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Award,
  Sparkles,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";

interface RefereeConsoleClientProps {
  initialMatch: Match;
  initialEvents: MatchEvent[];
  tournament: Tournament;
}

export function RefereeConsoleClient({
  initialMatch,
  initialEvents,
  tournament,
}: RefereeConsoleClientProps) {
  const [match, setMatch] = useState<Match>(initialMatch);
  const [events, setEvents] = useState<MatchEvent[]>(initialEvents);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFinalized, setIsFinalized] = useState(
    initialMatch.status === "ENDED" || tournament.status === "FINALIZED"
  );
  const [awardedRewards, setAwardedRewards] = useState<unknown[]>([]);

  const participants = match.participants;
  const aliveParticipants = participants.filter((p) => p.is_alive);
  const nextPlacement = aliveParticipants.length;

  const handleAddKill = (participantId: string, participantName: string) => {
    startTransition(async () => {
      const res = await recordMatchEventAction(
        match.id,
        tournament.id,
        "PLAYER_KILL",
        participantId,
        undefined,
        1,
        { weapon: "Official Referee Log" }
      );

      if (res.success && res.event) {
        setEvents((prev) => [...prev, res.event!]);
        // Update local participant state
        setMatch((prev) => {
          const updated = prev.participants.map((p) => {
            if (p.id === participantId) {
              const kills = p.kills + 1;
              return {
                ...p,
                kills,
                kill_points: kills * 1,
                total_score: p.placement_points + kills * 1,
              };
            }
            return p;
          });
          return { ...prev, participants: updated };
        });
        setStatusMessage(`Logged +1 Kill for ${participantName}`);
      }
    });
  };

  const handleEliminate = (participantId: string, participantName: string) => {
    const placement = nextPlacement;
    const placementPoints = tournament.scoring_rules.placement_points[placement] || 0;

    startTransition(async () => {
      const res = await recordMatchEventAction(
        match.id,
        tournament.id,
        "PLAYER_ELIMINATED",
        undefined,
        participantId,
        1,
        { placement }
      );

      if (res.success && res.event) {
        setEvents((prev) => [...prev, res.event!]);
        setMatch((prev) => {
          const updated = prev.participants.map((p) => {
            if (p.id === participantId) {
              return {
                ...p,
                is_alive: false,
                placement,
                placement_points: placementPoints,
                total_score: placementPoints + p.kill_points,
                eliminated_at: new Date().toISOString(),
              };
            }
            return p;
          });
          return { ...prev, participants: updated };
        });
        setStatusMessage(`Eliminated ${participantName} at #${placement} (+${placementPoints} pts)`);
      }
    });
  };

  const handleVoidEvent = (eventId: string) => {
    startTransition(async () => {
      const res = await voidMatchEventAction(eventId, "Referee Correction");
      if (res.success) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        setStatusMessage("Voided event & adjusted leaderboard state");
      }
    });
  };

  const handleFinalizeMatch = () => {
    if (!confirm("Are you sure you want to finalize this match? This will calculate official podium prizes (৳1,000) and top-fragger bonuses (৳500), post liabilities to the financial ledger, and open the 15-minute dispute window.")) {
      return;
    }

    startTransition(async () => {
      // If there's 1 survivor left, assign 1st place
      const lastSurvivor = participants.find((p) => p.is_alive);
      if (lastSurvivor) {
        const place1Points = tournament.scoring_rules.placement_points[1] || 12;
        lastSurvivor.placement = 1;
        lastSurvivor.placement_points = place1Points;
        lastSurvivor.total_score = place1Points + lastSurvivor.kill_points;
      }

      const res = await finalizeTournamentAction(tournament.id, match.id);
      if (res.success && res.rewards) {
        setIsFinalized(true);
        setAwardedRewards(res.rewards);
        setStatusMessage("Match officially finalized! Rewards calculated and posted to ledger.");
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      {statusMessage && (
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-between">
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dev Simulation Bar for Quick Testing */}
      <div className="p-4 rounded-xl bg-surface-200 border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-semibold text-gray-200">
            Dev/Referee Quick Actions:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {aliveParticipants.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => handleAddKill(p.id, p.participant_name)}
              disabled={isPending || isFinalized}
              className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-cyan-500 hover:text-black text-[11px] font-mono text-cyan-400 border border-surface-border transition-colors"
            >
              +1 Kill ({p.participant_name.split("〆")[0]})
            </button>
          ))}
          {!isFinalized ? (
            <Button
              onClick={handleFinalizeMatch}
              isLoading={isPending}
              variant="gold"
              size="sm"
              className="font-bold text-xs uppercase"
            >
              <Award className="w-3.5 h-3.5 mr-1" />
              Finalize & Disburse Rewards
            </Button>
          ) : (
            <Badge variant="emerald">RESULTS FINALIZED</Badge>
          )}
        </div>
      </div>

      {/* Finalized Rewards Notification */}
      {isFinalized && (
        <div className="p-5 rounded-xl bg-emerald-950/20 border-2 border-emerald-500/40 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-display text-lg font-black uppercase">
              Match Finalized • Deterministic Rewards Calculated
            </h3>
          </div>
          <p className="text-xs text-gray-300">
            Podium prize pool (৳1,000) and top-fragger performance pool (৳500) have been computed. Podium winners are strictly excluded from performance bonuses. Ledger entries posted.
          </p>
        </div>
      )}

      {/* Main Grid: Participants Touch Board (Left 8 cols) & Live Event Log / Undo (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Participants Touch Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
              Active Participants Touch Matrix ({aliveParticipants.length} Alive)
            </h3>
            <span className="text-xs font-mono text-gray-400">
              Next elimination place: #{nextPlacement}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {participants.map((p) => {
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border transition-all ${
                    p.is_alive
                      ? "bg-surface-100 border-surface-border hover:border-cyan-500/40"
                      : "bg-surface-200/50 border-surface-border/40 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.avatar_url}
                        alt={p.participant_name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-border"
                      />
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {p.participant_name}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          UID: {p.free_fire_uid}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-base font-black text-cyan-400 block">
                        {p.total_score} pts
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {p.placement_points}pl + {p.kill_points}k
                      </span>
                    </div>
                  </div>

                  {/* Referee Quick Action Touch Targets */}
                  {p.is_alive && !isFinalized ? (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border">
                      <button
                        onClick={() => handleAddKill(p.id, p.participant_name)}
                        disabled={isPending}
                        className="py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        +1 Kill ({p.kills})
                      </button>

                      <button
                        onClick={() => handleEliminate(p.id, p.participant_name)}
                        disabled={isPending}
                        className="py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-600 hover:text-white text-red-400 border border-red-500/30 text-xs font-bold font-mono uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <Skull className="w-3.5 h-3.5" />
                        Eliminate (#{nextPlacement})
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-surface-border/60 text-xs font-mono text-gray-400 flex items-center justify-between">
                      <span className="text-red-400 font-semibold">
                        Eliminated at #{p.placement || "?"}
                      </span>
                      <span>{p.kills} Kills Recorded</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Event Feed with Void/Undo capability */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                Event Log & Voiding
              </h3>
              <span className="text-xs font-mono text-gray-400">{events.length} Events</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {[...events].reverse().map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-surface-200 border border-surface-border text-xs font-mono space-y-1.5"
                >
                  <div className="flex items-center justify-between text-gray-400 text-[10px]">
                    <span>Seq #{ev.sequence_number}</span>
                    <span>{formatRelativeTime(ev.created_at)}</span>
                  </div>

                  <div className="text-gray-200">
                    {ev.event_type === "PLAYER_KILL" ? (
                      <div>
                        <span className="text-cyan-300 font-bold">{ev.actor_name}</span>{" "}
                        killed{" "}
                        <span className="text-gray-400">{ev.target_name || "player"}</span>
                      </div>
                    ) : ev.event_type === "PLAYER_ELIMINATED" ? (
                      <div>
                        <span className="text-red-400 font-bold">{ev.target_name}</span>{" "}
                        eliminated at #{String(ev.metadata?.placement || "?")}
                      </div>
                    ) : (
                      <span>{String(ev.metadata?.message || ev.event_type)}</span>
                    )}
                  </div>

                  {!isFinalized && (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleVoidEvent(ev.id)}
                        disabled={isPending}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Void / Undo
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
