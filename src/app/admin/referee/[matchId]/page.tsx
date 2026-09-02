import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RefereeConsoleClient } from "./referee-client";
import { Shield } from "lucide-react";
import Link from "next/link";
import { AdminAuthWall } from "@/components/admin-auth-wall";

export const dynamic = "force-dynamic";

export default async function RefereePage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  if (!isSupabaseConfigured) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return <AdminAuthWall />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authUser.id)
    .maybeSingle();

  const isStaff =
    profile?.role === "SUPER_ADMIN" ||
    profile?.role === "OWNER" ||
    profile?.role === "TOURNAMENT_ADMIN" ||
    profile?.role === "REFEREE";

  if (!isStaff) {
    return <AdminAuthWall />;
  }

  const { data: matchRow } = await supabase
    .from("matches")
    .select("*, tournaments(*)")
    .eq("id", matchId)
    .maybeSingle();

  if (!matchRow || !matchRow.tournaments) {
    notFound();
  }

  const { data: partRows } = await supabase
    .from("match_participants")
    .select("*, user:profiles(display_name, avatar_url, username)")
    .eq("match_id", matchId)
    .order("total_score", { ascending: false });

  const participants = (partRows || []).map((p: any) => ({
    id: p.id,
    match_id: matchId,
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

  const match = {
    ...matchRow,
    participants,
  };

  const { data: evRows } = await supabase
    .from("match_events")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  const events = evRows || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-crimson font-semibold mb-1">
            <Shield className="w-4 h-4" />
            <span>OFFICIAL REFEREE MATCH DESK</span>
            <span className="text-gray-500">•</span>
            <span className="text-slate-600 dark:text-gray-400">{matchRow.tournaments.title}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase">
            Referee Match Operations Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-slate-700 dark:text-gray-300 text-xs font-medium border border-surface-border transition-colors font-display uppercase tracking-wider"
          >
            Admin Portal
          </Link>
          <Link
            href="/live"
            target="_blank"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors font-display uppercase tracking-wider"
          >
            Live Telemetry Feed →
          </Link>
        </div>
      </div>

      <RefereeConsoleClient
        tournament={matchRow.tournaments}
        initialMatch={match}
        initialEvents={events}
      />
    </div>
  );
}
