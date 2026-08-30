import { dataStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Trophy, Flame, Crosshair, Target, Medal } from "lucide-react";

export const dynamic = "force-dynamic";

export default function RankingsPage() {
  const match = dataStore.getMatch("match-night-battle-round-1");
  const participants = match?.participants || [];

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
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
              OFFICIAL LEADERBOARDS
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Warrior Power Rankings
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Deterministic leaderboard calculated from verified tournament placements, kill counts, and prize earnings
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button className="px-3 py-1.5 rounded-lg bg-brand-crimson text-white font-bold uppercase">
            Global Season
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-surface-elevated text-gray-300 hover:text-white border border-surface-border uppercase">
            Weekly
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-surface-elevated text-gray-300 hover:text-white border border-surface-border uppercase">
            Clans & Teams
          </button>
        </div>
      </div>

      {/* Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* 2nd Place */}
        {sortedWarriors[1] && (
          <div className="order-2 md:order-1 p-6 rounded-2xl bg-surface-100 border border-surface-border text-center space-y-3 relative overflow-hidden">
            <div className="text-4xl mb-2">🥈</div>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
              2nd Place Runner-Up
            </span>
            <img
              src={sortedWarriors[1].avatar_url}
              alt={sortedWarriors[1].participant_name}
              className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-gray-400"
            />
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                {sortedWarriors[1].participant_name}
              </h3>
              <span className="text-xs text-gray-500 font-mono">
                UID: {sortedWarriors[1].free_fire_uid}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-200 font-mono text-xs flex justify-around">
              <div>
                <span className="text-gray-500 block text-[10px]">Kills</span>
                <span className="font-bold text-amber-400 text-sm">
                  {sortedWarriors[1].kills}
                </span>
              </div>
              <div className="border-x border-surface-border px-3">
                <span className="text-gray-500 block text-[10px]">Place Pts</span>
                <span className="font-bold text-gray-200 text-sm">
                  {sortedWarriors[1].placement_points}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Total Score</span>
                <span className="font-bold text-cyan-400 text-sm">
                  {sortedWarriors[1].total_score}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {sortedWarriors[0] && (
          <div className="order-1 md:order-2 p-6 rounded-2xl bg-surface-100 border-2 border-amber-500/40 text-center space-y-3 relative overflow-hidden shadow-2xl shadow-amber-500/10">
            <div className="text-5xl mb-2 animate-bounce">🥇</div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
              Apex Champion
            </span>
            <img
              src={sortedWarriors[0].avatar_url}
              alt={sortedWarriors[0].participant_name}
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-amber-400/80"
            />
            <div>
              <h3 className="font-display text-2xl font-black text-white">
                {sortedWarriors[0].participant_name}
              </h3>
              <span className="text-xs text-gray-500 font-mono">
                UID: {sortedWarriors[0].free_fire_uid}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-200 font-mono text-xs flex justify-around">
              <div>
                <span className="text-gray-500 block text-[10px]">Kills</span>
                <span className="font-bold text-amber-400 text-base">
                  {sortedWarriors[0].kills}
                </span>
              </div>
              <div className="border-x border-surface-border px-3">
                <span className="text-gray-500 block text-[10px]">Place Pts</span>
                <span className="font-bold text-gray-200 text-base">
                  {sortedWarriors[0].placement_points}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Total Score</span>
                <span className="font-bold text-cyan-400 text-base">
                  {sortedWarriors[0].total_score}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {sortedWarriors[2] && (
          <div className="order-3 p-6 rounded-2xl bg-surface-100 border border-surface-border text-center space-y-3 relative overflow-hidden">
            <div className="text-4xl mb-2">🥉</div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-600 block">
              3rd Place Podium
            </span>
            <img
              src={sortedWarriors[2].avatar_url}
              alt={sortedWarriors[2].participant_name}
              className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-amber-700"
            />
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                {sortedWarriors[2].participant_name}
              </h3>
              <span className="text-xs text-gray-500 font-mono">
                UID: {sortedWarriors[2].free_fire_uid}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-200 font-mono text-xs flex justify-around">
              <div>
                <span className="text-gray-500 block text-[10px]">Kills</span>
                <span className="font-bold text-amber-400 text-sm">
                  {sortedWarriors[2].kills}
                </span>
              </div>
              <div className="border-x border-surface-border px-3">
                <span className="text-gray-500 block text-[10px]">Place Pts</span>
                <span className="font-bold text-gray-200 text-sm">
                  {sortedWarriors[2].placement_points}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Total Score</span>
                <span className="font-bold text-cyan-400 text-sm">
                  {sortedWarriors[2].total_score}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-xl bg-surface-100 border border-surface-border overflow-hidden p-6 space-y-4">
        <h3 className="font-display text-lg font-bold text-white uppercase">
          Full Circuit Standings
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-surface-border bg-surface-200/50">
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
                <tr key={p.id} className="hover:bg-surface-elevated/40">
                  <td className="py-3.5 px-3 font-bold text-gray-300">
                    {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.avatar_url}
                        alt={p.participant_name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-surface-border"
                      />
                      <div>
                        <span className="font-sans font-bold text-white block">
                          {p.participant_name}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          UID: {p.free_fire_uid}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {p.is_alive ? (
                      <span className="text-emerald-400 font-semibold">● Alive</span>
                    ) : (
                      <span className="text-gray-500">Eliminated</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-amber-400">
                    {p.kills}
                  </td>
                  <td className="py-3.5 px-3 text-center text-gray-300">
                    {p.placement_points}
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-cyan-400 text-sm">
                    {p.total_score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
