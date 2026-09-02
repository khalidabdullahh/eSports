import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LiveMatchConsole } from "@/components/live-match-console";
import { Radio, Trophy, ArrowRight, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let liveMatch: any = null;
  let tournament: any = null;
  let events: any[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    // 1. Fetch first match with LIVE status
    const { data: matchRow } = await supabase
      .from("matches")
      .select("*, tournaments(*)")
      .eq("status", "LIVE")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (matchRow) {
      tournament = matchRow.tournaments;

      // 2. Fetch match participants
      const { data: partRows } = await supabase
        .from("match_participants")
        .select("*, user:profiles(display_name, avatar_url, username)")
        .eq("match_id", matchRow.id)
        .order("total_score", { ascending: false });

      const participants = (partRows || []).map((p: any) => ({
        id: p.id,
        match_id: matchRow.id,
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

      liveMatch = {
        ...matchRow,
        participants,
      };

      // 3. Fetch match events
      const { data: evRows } = await supabase
        .from("match_events")
        .select("*")
        .eq("match_id", matchRow.id)
        .order("created_at", { ascending: true });

      events = evRows || [];
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {liveMatch && tournament ? (
        <LiveMatchConsole
          tournament={tournament}
          initialMatch={liveMatch}
          initialEvents={events}
        />
      ) : (
        <div className="p-10 sm:p-16 rounded-3xl bg-surface-100 border border-surface-border text-center space-y-6 shadow-2xl max-w-2xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-brand-crimson/10 border border-brand-crimson/30 flex items-center justify-center mx-auto text-brand-crimson shadow-md">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-crimson">
              ARENA BROADCAST OFFLINE
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              No Live Match Broadcast Currently
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-sans max-w-md mx-auto leading-relaxed">
              When an official tournament match commences under referee scoring, the live stream feed and real-time kill telemetry will automatically broadcast here.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/tournaments"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-crimson/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Tournaments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-800 dark:text-gray-200 font-display font-bold text-xs uppercase tracking-wider transition-all"
            >
              Admin Operations Desk
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
