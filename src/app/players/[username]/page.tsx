import { notFound } from "next/navigation";
import { dataStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crosshair, Target, Award, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = dataStore.getProfile(username);

  if (!profile) {
    notFound();
  }

  const rewards = dataStore.getRewards().filter((r) => r.recipient_user_id === profile.id);
  const totalEarningsCents = rewards.reduce((acc, r) => acc + r.amount_cents, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        href="/rankings"
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Rankings
      </Link>

      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-surface-border">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-500/60 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
                  {profile.display_name}
                </h1>
                <Badge variant="cyan">{profile.role}</Badge>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-1">
                IGN: <strong className="text-cyan-300">{profile.in_game_name}</strong>
              </p>
              <p className="text-[11px] text-gray-500 font-mono">
                Free Fire UID: {profile.free_fire_uid} • Verified Warrior
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-200 border border-surface-border text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase text-gray-400 block">
              Total Earnings
            </span>
            <span className="text-2xl font-black font-display text-amber-400">
              {formatCurrency(totalEarningsCents, "BDT")}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
          <div className="p-3.5 rounded-lg bg-surface-200 border border-surface-border">
            <span className="text-gray-400 block text-[10px]">Tournaments</span>
            <span className="text-xl font-bold text-white">18</span>
          </div>
          <div className="p-3.5 rounded-lg bg-surface-200 border border-surface-border">
            <span className="text-gray-400 block text-[10px]">Podium Finishes</span>
            <span className="text-xl font-bold text-amber-400">7 🏆</span>
          </div>
          <div className="p-3.5 rounded-lg bg-surface-200 border border-surface-border">
            <span className="text-gray-400 block text-[10px]">Total Kills</span>
            <span className="text-xl font-bold text-cyan-400">84</span>
          </div>
          <div className="p-3.5 rounded-lg bg-surface-200 border border-surface-border">
            <span className="text-gray-400 block text-[10px]">Win Rate</span>
            <span className="text-xl font-bold text-emerald-400">38.8%</span>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3 pt-2">
          <h3 className="font-display text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Competitive Badges & Accolades
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-surface-200 border border-amber-500/30 text-xs">
              <span className="font-bold text-amber-300 block">Apex Predator</span>
              <span className="text-[11px] text-gray-400">7+ kills in single tournament round</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-200 border border-cyan-500/30 text-xs">
              <span className="font-bold text-cyan-300 block">Cold-Blooded Sniper</span>
              <span className="text-[11px] text-gray-400">AWM long-range elimination ace</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-200 border border-emerald-500/30 text-xs">
              <span className="font-bold text-emerald-300 block">Verified Survivor</span>
              <span className="text-[11px] text-gray-400">100% fair play compliance record</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
