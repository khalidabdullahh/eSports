import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { dataStore } from "@/lib/store";
import { Trophy, ArrowRight, Shield, Award, Sparkles } from "lucide-react";
import { MatchParticipant } from "@/types";

export const dynamic = "force-dynamic";

export default async function RankingsPage() {
  const isProduction = process.env.NODE_ENV === "production";
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let participants: MatchParticipant[] = [];
  let tournamentTitle = "ARENEX Official Circuit";

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    // 1. Fetch latest completed or live match
    const { data: matchRow } = await supabase
      .from("matches")
      .select("id, tournament_id, title, tournaments(title)")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (matchRow) {
      tournamentTitle = (matchRow.tournaments as any)?.title || matchRow.title || tournamentTitle;

      // 2. Fetch participants for this match
      const { data: partRows } = await supabase
        .from("match_participants")
        .select("*, user:profiles(display_name, avatar_url, username)")
        .eq("match_id", matchRow.id)
        .order("total_score", { ascending: false });

      if (partRows && partRows.length > 0) {
        participants = partRows.map((p: any) => ({
          id: p.id,
          match_id: p.match_id || matchRow.id,
          registration_id: p.registration_id || p.id,
          user_id: p.user_id,
          participant_name: p.user?.display_name || p.user?.username || "Warrior",
          free_fire_uid: p.free_fire_uid || "1098234871",
          avatar_url: p.user?.avatar_url || "",
          kills: p.kills || 0,
          placement: p.placement || 0,
          placement_points: p.placement_points || 0,
          kill_points: p.kill_points || 0,
          total_score: p.total_score || 0,
          is_alive: p.is_alive ?? false,
        }));
      }
    }
  }

  // Ranked by total_score descending, then kills
  const sortedWarriors = [...participants].sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    return b.kills - a.kills;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
              OFFICIAL LEADERBOARDS
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Warrior Power Rankings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
            Deterministic leaderboard calculated from verified tournament placements, kill counts, and prize earnings.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button className="px-3 py-1.5 rounded-lg bg-brand-crimson text-white font-bold uppercase shadow-sm">
            Global Season
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-surface-elevated text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white border border-surface-border uppercase font-semibold transition-colors">
            Weekly
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-surface-elevated text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white border border-surface-border uppercase font-semibold transition-colors">
            Clans & Teams
          </button>
        </div>
      </div>

      {/* Clean Empty State if no real match standings exist yet */}
      {sortedWarriors.length === 0 ? (
        <div className="p-10 sm:p-16 rounded-3xl bg-surface-100 border border-surface-border text-center space-y-5 shadow-xl max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-crimson">
              Season Rankings Initializing
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase">
              No Official Standings Recorded Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-sans max-w-md mx-auto leading-relaxed">
              Official standings and kill telemetry will automatically update here as upcoming tournament matches conclude under referee telemetry.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-crimson/25 transition-all"
            >
              <span>Explore Upcoming Tournaments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* 2nd Place */}
            {sortedWarriors[1] && (
              <div className="order-2 md:order-1 p-6 rounded-2xl bg-surface-100 border border-surface-border text-center space-y-3 relative overflow-hidden shadow-lg">
                <div className="text-4xl mb-2">🥈</div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-gray-400 font-bold block">
                  2nd Place Runner-Up
                </span>
                <img
                  src={
                    sortedWarriors[1].avatar_url ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={sortedWarriors[1].participant_name}
                  className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-gray-400"
                />
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {sortedWarriors[1].participant_name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-mono font-medium">
                    UID: {sortedWarriors[1].free_fire_uid}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-200 font-mono text-xs flex justify-around">
                  <div>
                    <span className="text-slate-600 dark:text-gray-400 block text-[10px] font-semibold uppercase">Kills</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {sortedWarriors[1].kills}
                    </span>
                  </div>
                  <div className="border-x border-surface-border px-3">
                    <span className="text-slate-600 dark:text-gray-400 block text-[10px] font-semibold uppercase">Place Pts</span>
                    <span className="font-bold text-slate-900 dark:text-gray-200 text-sm">
                      {sortedWarriors[1].placement_points}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-gray-400 block text-[10px] font-semibold uppercase">Total Score</span>
                    <span className="font-bold text-brand-crimson dark:text-cyan-400 text-sm">
                      {sortedWarriors[1].total_score}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {sortedWarriors[0] && (
              <div className="order-1 md:order-2 p-6 rounded-2xl bg-surface-100 border-2 border-amber-500/50 text-center space-y-3 relative overflow-hidden shadow-2xl shadow-amber-500/10">
                <div className="text-5xl mb-2 animate-bounce">🥇</div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold block">
                  Apex Champion
                </span>
                <img
                  src={
                    sortedWarriors[0].avatar_url ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={sortedWarriors[0].participant_name}
                  className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-amber-400/80"
                />
                <div>
                  <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                    {sortedWarriors[0].participant_name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-mono font-medium">
                    UID: {sortedWarriors[0].free_fire_uid}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-200 font-mono text-xs flex justify-around">
                  <div>
                    <span className="text-slate-600 dark:text-gray-400 block text-[10px] font-semibold uppercase">Kills</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-base">
                      {sortedWarriors[0].kills}
                    </span>
                  </div>
                  <div className="border-x border-surface-border px-3">
                    <span className="text-slate-600 dark:text-gray-400 block text-[10px] font-semibold uppercase">Place Pts</span>
                    <span className="font-bold text-slate-900 dark:text-gray-200 text-base">
                      {sortedWarriors[0].placement_points}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-gray-400 block text-[10px] font-semibold uppercase">Total Score</span>
                    <span className="font-bold text-brand-crimson dark:text-cyan-400 text-base">
                      {sortedWarriors[0].total_score}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {sortedWarriors[2] && (
              <div className="order-3 p-6 rounded-2xl bg-surface-100 border border-surface-border text-center space-y-3 relative overflow-hidden shadow-lg">
                <div className="text-4xl mb-2">🥉</div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-gray-400 font-bold block">
                  3rd Place Runner-Up
                </span>
                <img
                  src={
                    sortedWarriors[2].avatar_url ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={sortedWarriors[2].participant_name}
                  className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-amber-700/60"
                />
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {sortedWarriors[2].participant_name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-mono font-medium">
                    UID: {sortedWarriors[2].free_fire_uid}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-200 font-mono text-xs flex justify-around">
                  <div>
                    <span className="text-slate-600 dark:text-gray-400 block text-[10px] font-semibold uppercase">Kills</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {sortedWarriors[2].kills}
                    </span>
                  </div>
                  <div className="border-x border-surface-border px-3">
                    <span className="text-slate-600 dark:text-gray-400 block text-[10px] font-semibold uppercase">Place Pts</span>
                    <span className="font-bold text-slate-900 dark:text-gray-200 text-sm">
                      {sortedWarriors[2].placement_points}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-gray-400 block text-[10px] font-semibold uppercase">Total Score</span>
                    <span className="font-bold text-brand-crimson dark:text-cyan-400 text-sm">
                      {sortedWarriors[2].total_score}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Leaderboard Table */}
          <div className="rounded-2xl bg-surface-100 border border-surface-border overflow-hidden p-6 space-y-4 shadow-xl">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase">
              Full Circuit Standings ({tournamentTitle})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-700 dark:text-gray-400 border-b border-surface-border bg-surface-200/60 font-bold">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Warrior</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Kills</th>
                    <th className="py-3 px-3 text-center">Place Pts</th>
                    <th className="py-3 px-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {sortedWarriors.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-surface-elevated/80 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-gray-300">
                        {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              p.avatar_url ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                            }
                            alt={p.participant_name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-surface-border"
                          />
                          <div>
                            <span className="font-sans font-bold text-slate-900 dark:text-white block text-sm">
                              {p.participant_name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                              UID: {p.free_fire_uid}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {p.is_alive ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Alive</span>
                        ) : (
                          <span className="text-slate-500 dark:text-gray-400 font-medium">Eliminated</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {p.kills}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-800 dark:text-gray-300 font-semibold">
                        {p.placement_points}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-brand-crimson dark:text-cyan-400 text-sm">
                        {p.total_score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
