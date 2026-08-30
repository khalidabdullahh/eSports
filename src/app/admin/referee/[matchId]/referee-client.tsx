"use client";

import React, { useState, useTransition } from "react";
import { Match, MatchEvent, MatchParticipant, Tournament } from "@/types";
import {
  recordMatchEventAction,
  voidMatchEventAction,
  finalizeTournamentAction,
  updateMatchPlayerStatsAction,
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
  Award,
  Sparkles,
  Trophy,
  UploadCloud,
  Edit3,
  Users,
  Plus,
  Trash2,
  Save,
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
  const [activeTab, setActiveTab] = useState<"touch" | "statsEditor">("statsEditor");
  const [isFinalized, setIsFinalized] = useState(
    initialMatch.status === "ENDED" || tournament.status === "FINALIZED"
  );
  const [awardedRewards, setAwardedRewards] = useState<unknown[]>([]);

  // Editable player stats state
  const [editableParticipants, setEditableParticipants] = useState<
    {
      id: string;
      participant_name: string;
      kills: number;
      placement?: number;
      is_alive: boolean;
    }[]
  >(
    initialMatch.participants.map((p) => ({
      id: p.id,
      participant_name: p.participant_name,
      kills: p.kills,
      placement: p.placement,
      is_alive: p.is_alive,
    }))
  );

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
        // Sync editable table state
        setEditableParticipants((prev) =>
          prev.map((p) => (p.id === participantId ? { ...p, kills: p.kills + 1 } : p))
        );
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
        setEditableParticipants((prev) =>
          prev.map((p) =>
            p.id === participantId ? { ...p, is_alive: false, placement } : p
          )
        );
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

  const handlePublishStats = () => {
    startTransition(async () => {
      const res = await updateMatchPlayerStatsAction(
        match.id,
        tournament.id,
        editableParticipants
      );

      if (res.success && res.participants) {
        setMatch((prev) => ({ ...prev, participants: res.participants! }));
        setStatusMessage("Player stats successfully published! Live website has been updated.");
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
      } else {
        setStatusMessage("Failed to update stats: " + (res.error || "Unknown error"));
      }
    });
  };

  const handleAddNewPlayer = () => {
    const newId = `player-manual-${Date.now()}`;
    const newName = `WARRIOR_${editableParticipants.length + 1}`;
    setEditableParticipants((prev) => [
      ...prev,
      {
        id: newId,
        participant_name: newName,
        kills: 0,
        placement: undefined,
        is_alive: true,
      },
    ]);
    setStatusMessage(`Added new editable row: ${newName}`);
  };

  const handleFinalizeMatch = () => {
    if (
      !confirm(
        "Are you sure you want to finalize this match? This will calculate official podium prizes (৳1,000) and top-fragger bonuses (৳500), post liabilities to the financial ledger, and open the 15-minute dispute window."
      )
    ) {
      return;
    }

    startTransition(async () => {
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
        <div className="p-3.5 rounded-xl bg-brand-crimson/15 border border-brand-crimson/30 text-xs font-mono text-brand-crimsonLight flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-gray-400 hover:text-white ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-100 border border-surface-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("statsEditor")}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === "statsEditor"
                ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/25"
                : "bg-surface-elevated text-gray-300 hover:text-white border border-surface-border"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Direct Player Stats Input & Upload</span>
          </button>

          <button
            onClick={() => setActiveTab("touch")}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === "touch"
                ? "bg-brand-crimson text-white shadow-md shadow-brand-crimson/25"
                : "bg-surface-elevated text-gray-300 hover:text-white border border-surface-border"
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>Referee Touch Board</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
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

      {/* VIEW A: DIRECT PLAYER STATS INPUT & UPLOAD (PRIMARY ADMIN STATS TOOL) */}
      {activeTab === "statsEditor" && (
        <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <UploadCloud className="w-6 h-6 text-brand-crimson" />
                <span>Live Website Player Stats Input</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-sans">
                Admin can edit kills, rank placement, and survival status here. Click &quot;Publish Stats to Live Website&quot; to instantly broadcast to all visitors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddNewPlayer}
                className="px-3 py-2 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Add Player</span>
              </button>

              <button
                onClick={handlePublishStats}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isPending ? "Publishing..." : "Publish Stats to Live Website"}</span>
              </button>
            </div>
          </div>

          {/* Editable Stats Table */}
          <div className="overflow-x-auto rounded-xl border border-surface-border">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-200 text-gray-400 border-b border-surface-border">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Player / UID</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center w-28">Kills Input</th>
                  <th className="py-3 px-3 text-center w-28">Placement #</th>
                  <th className="py-3 px-3 text-right">Calculated Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {editableParticipants.map((p, idx) => {
                  const placePoints = p.placement
                    ? tournament.scoring_rules.placement_points[p.placement] || 0
                    : 0;
                  const killPoints = p.kills * tournament.scoring_rules.kill_points;
                  const total = placePoints + killPoints;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-surface-elevated/40 transition-colors"
                    >
                      <td className="py-3 px-3 text-gray-500 font-bold">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={p.participant_name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableParticipants((prev) =>
                              prev.map((item) =>
                                item.id === p.id ? { ...item, participant_name: val } : item
                              )
                            );
                          }}
                          className="px-2 py-1 rounded bg-surface-200 border border-surface-border text-xs text-white font-sans font-bold w-full max-w-[200px]"
                        />
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setEditableParticipants((prev) =>
                              prev.map((item) =>
                                item.id === p.id ? { ...item, is_alive: !item.is_alive } : item
                              )
                            );
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono transition-colors ${
                            p.is_alive
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {p.is_alive ? "● In Combat" : "Eliminated"}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={p.kills}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setEditableParticipants((prev) =>
                              prev.map((item) =>
                                item.id === p.id ? { ...item, kills: val } : item
                              )
                            );
                          }}
                          className="w-20 text-center px-2 py-1 rounded bg-surface-200 border border-surface-border text-xs font-mono font-bold text-brand-gold focus:outline-none focus:border-brand-crimson"
                        />
                      </td>

                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          placeholder="-"
                          value={p.placement || ""}
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                            setEditableParticipants((prev) =>
                              prev.map((item) =>
                                item.id === p.id ? { ...item, placement: val } : item
                              )
                            );
                          }}
                          className="w-20 text-center px-2 py-1 rounded bg-surface-200 border border-surface-border text-xs font-mono font-bold text-white focus:outline-none focus:border-brand-crimson"
                        />
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="font-mono font-black text-brand-gold text-sm block">
                          {total} pts
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {placePoints}pl + {killPoints}k
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-border">
            <p className="text-xs text-gray-400 font-sans">
              *Scoring Formula: Placement Points (1st: 12, 2nd: 9, 3rd: 8...) + 1 Point Per Frag.
            </p>

            <button
              onClick={handlePublishStats}
              disabled={isPending}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isPending ? "Uploading..." : "Publish Stats to Live Website"}</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW B: REFEREE TOUCH MATRIX */}
      {activeTab === "touch" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              {participants.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border transition-all ${
                    p.is_alive
                      ? "bg-surface-100 border-surface-border hover:border-brand-crimson/40"
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
                      <span className="text-base font-black text-brand-gold block">
                        {p.total_score} pts
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {p.placement_points}pl + {p.kill_points}k
                      </span>
                    </div>
                  </div>

                  {p.is_alive && !isFinalized ? (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border">
                      <button
                        onClick={() => handleAddKill(p.id, p.participant_name)}
                        disabled={isPending}
                        className="py-2 px-3 rounded-lg bg-brand-crimson/10 hover:bg-brand-crimson hover:text-white text-brand-crimsonLight border border-brand-crimson/30 text-xs font-bold font-mono uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        +1 Frag ({p.kills})
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
                      <span>{p.kills} Frags Recorded</span>
                    </div>
                  )}
                </div>
              ))}
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
                          <span className="text-brand-crimsonLight font-bold">
                            {ev.actor_name}
                          </span>{" "}
                          eliminated{" "}
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
                          className="text-[10px] text-brand-gold hover:text-amber-300 font-mono flex items-center gap-1"
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
      )}
    </div>
  );
}
