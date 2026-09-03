"use client";

import React, { useState } from "react";
import { Match, MatchEvent, Tournament } from "@/types";
import { Badge } from "./ui/badge";
import { formatCurrency, formatRelativeTime, getStreamEmbedUrl } from "@/lib/utils";
import {
  Radio,
  Trophy,
  Users,
  Crosshair,
  Skull,
  Shield,
  RefreshCw,
} from "lucide-react";

interface LiveMatchConsoleProps {
  tournament: Tournament;
  initialMatch: Match;
  initialEvents: MatchEvent[];
}

export function LiveMatchConsole({
  tournament,
  initialMatch,
  initialEvents,
}: LiveMatchConsoleProps) {
  const [match, setMatch] = useState<Match>(initialMatch);
  const [events, setEvents] = useState<MatchEvent[]>(initialEvents);
  const [isConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const participants = match.participants;
  const aliveParticipants = participants.filter((p) => p.is_alive);
  const eliminatedParticipants = participants.filter((p) => !p.is_alive);
  const totalKills = participants.reduce((acc, p) => acc + p.kills, 0);

  // Sort participants by total_score descending, then kills descending
  const sortedLeaderboard = [...participants].sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    return b.kills - a.kills;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/match/${match.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.match) setMatch(data.match);
        if (data.events) setEvents(data.events);
      }
    } catch {
      // Fallback cleanly
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-100 border border-surface-border">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="live" pulse>
              ARENEX BROADCAST • LIVE
            </Badge>
            <span className="text-xs font-mono uppercase tracking-wider text-brand-crimson font-semibold bg-brand-crimson/10 px-2.5 py-0.5 rounded border border-brand-crimson/30">
              {tournament.game_name}
            </span>
            <span className="text-xs font-mono text-gray-400 bg-surface-200 px-2 py-0.5 rounded border border-surface-border">
              {match.title}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {tournament.title}
          </h1>
        </div>

        {/* Realtime Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-200 border border-surface-border text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-brand-emerald animate-pulse" : "bg-brand-gold"
              }`}
            />
            <span className="text-gray-300">
              {isConnected ? "Arena Telemetry Active" : "Reconnecting..."}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-surface-200 hover:bg-surface-elevated border border-surface-border text-gray-300 hover:text-white transition-colors"
            title="Refresh Match Telemetry"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-crimson" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Live Match Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-surface-100 border border-surface-border">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono uppercase mb-1">
            <span>Warriors In Combat</span>
            <Users className="w-3.5 h-3.5 text-brand-emerald" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-brand-emerald">
            {aliveParticipants.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-100 border border-surface-border">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono uppercase mb-1">
            <span>Eliminated</span>
            <Skull className="w-3.5 h-3.5 text-brand-crimson" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-brand-crimson">
            {eliminatedParticipants.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-100 border border-surface-border">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono uppercase mb-1">
            <span>Total Frags</span>
            <Trophy className="w-3.5 h-3.5 text-brand-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-brand-gold">
            {totalKills}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-100 border border-surface-border">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono uppercase mb-1">
            <span>Guaranteed Pool</span>
            <Shield className="w-3.5 h-3.5 text-brand-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">
            {formatCurrency(
              tournament.main_prize_pool_cents + tournament.performance_reward_pool_cents,
              tournament.currency
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Stream & Feed (Left 7 cols) + Leaderboard (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Stream & Real-time Killfeed */}
        <div className="lg:col-span-7 space-y-6">
          {/* Stream Embed Area */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-surface-border shadow-2xl">
            {tournament.stream_url && getStreamEmbedUrl(tournament.stream_url) ? (
              <iframe
                src={getStreamEmbedUrl(tournament.stream_url, {
                  autoplay: true,
                  muted: true,
                  hostname: typeof window !== "undefined" ? window.location.hostname : undefined,
                })!}
                title="Live Esports Match Stream"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <Radio className="w-12 h-12 text-brand-crimson animate-pulse mb-3" />
                <h3 className="font-display text-lg font-bold text-white uppercase">
                  Arena Telemetry Active
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm font-sans">
                  {tournament.stream_url
                    ? "OBS stream uplink connecting. Follow official referee telemetry and live leaderboard below."
                    : "No public broadcast stream configured for this match. Follow live telemetry and kill feed below."}
                </p>
              </div>
            )}
          </div>

          {/* Live Kill Feed / Match Events */}
          <div className="rounded-xl bg-surface-100 border border-surface-border p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-brand-crimson" />
                <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                  Official Match Event Feed
                </h3>
              </div>
              <span className="text-xs font-mono text-gray-500">
                {events.length} Recorded Events
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {events.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4 font-mono">
                  Awaiting first blood in Bermuda...
                </p>
              ) : (
                [...events].reverse().map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface-200/70 border border-surface-border/70 text-xs font-mono animate-fadeIn"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-gray-500 w-6">#{ev.sequence_number}</span>

                      {ev.event_type === "PLAYER_KILL" ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-brand-crimsonLight">{ev.actor_name}</span>
                          <span className="text-brand-crimson font-semibold text-[11px] px-1.5 py-0.5 rounded bg-red-950/40 border border-red-800/40">
                            ELIMINATED
                          </span>
                          <span className="font-bold text-gray-400 line-through">
                            {ev.target_name}
                          </span>
                          {Boolean(ev.metadata?.weapon) && (
                            <span className="text-[10px] text-gray-500 font-sans">
                              with {String(ev.metadata?.weapon)}
                            </span>
                          )}
                        </div>
                      ) : ev.event_type === "PLAYER_ELIMINATED" ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-brand-crimson font-bold">{ev.target_name}</span>
                          <span className="text-gray-400">
                            finished at #{String(ev.metadata?.placement || "?")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300">
                          {String(ev.metadata?.message || ev.event_type)}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                      {formatRelativeTime(ev.created_at)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Authoritative Leaderboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl bg-surface-100 border border-surface-border p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-brand-gold" />
                <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                  Live Match Leaderboard
                </h3>
              </div>
              <span className="text-xs font-mono text-brand-gold font-bold">
                Deterministic Scoring
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-gray-400 border-b border-surface-border/80 pb-2">
                    <th className="pb-2.5 px-2">Rank</th>
                    <th className="pb-2.5 px-2">Player</th>
                    <th className="pb-2.5 px-2 text-center">Kills</th>
                    <th className="pb-2.5 px-2 text-center">Place</th>
                    <th className="pb-2.5 px-2 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {sortedLeaderboard.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-surface-elevated/60 transition-colors ${
                        p.is_alive ? "" : "opacity-60"
                      }`}
                    >
                      <td className="py-2.5 px-2 font-bold">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.avatar_url}
                            alt={p.participant_name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-surface-border"
                          />
                          <div className="leading-tight">
                            <span className="font-sans font-bold text-white block">
                              {p.participant_name}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {p.is_alive ? (
                                <span className="text-brand-emerald font-semibold">● In Combat</span>
                              ) : (
                                <span className="text-gray-500">
                                  Eliminated {p.placement ? `(#${p.placement})` : ""}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-brand-crimson">
                        {p.kills}
                      </td>
                      <td className="py-2.5 px-2 text-center text-gray-300">
                        {p.placement_points}
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-brand-gold text-sm">
                        {p.total_score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Microcopy disclaimer */}
            <p className="text-[10px] text-gray-500 font-mono text-center pt-2 border-t border-surface-border/60">
              Official score calculated in real-time by referee logs. 15-min dispute window starts upon finalization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
