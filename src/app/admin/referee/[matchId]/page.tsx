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

  let matchRow: any = null;

  // 1. Attempt to find match directly by match ID
  const { data: matchById } = await supabase
    .from("matches")
    .select("*, tournaments(*)")
    .eq("id", matchId)
    .maybeSingle();

  if (matchById && matchById.tournaments) {
    matchRow = matchById;
  } else {
    // 2. Attempt to find match by tournament ID
    const { data: matchByTour } = await supabase
      .from("matches")
      .select("*, tournaments(*)")
      .eq("tournament_id", matchId)
      .order("round_number", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (matchByTour && matchByTour.tournaments) {
      matchRow = matchByTour;
    } else {
      // 3. Find tournament and auto-provision Match Round 1
      let { data: tournament } = await supabase
        .from("tournaments")
        .select("*, room_credentials(*)")
        .eq("id", matchId)
        .maybeSingle();

      if (!tournament) {
        const { data: tourBySlug } = await supabase
          .from("tournaments")
          .select("*, room_credentials(*)")
          .eq("slug", matchId)
          .maybeSingle();
        tournament = tourBySlug;
      }

      if (!tournament) {
        const { data: latestTour } = await supabase
          .from("tournaments")
          .select("*, room_credentials(*)")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        tournament = latestTour;
      }

      if (tournament) {
        const { data: newMatch } = await supabase
          .from("matches")
          .insert({
            tournament_id: tournament.id,
            title: `${tournament.title} - Round 1`,
            round_number: 1,
            status: "IN_PROGRESS",
            server_region: "BD_DHAKA_01",
            custom_room_id: (tournament.room_credentials as any)?.[0]?.room_name || "ROOM-01",
            custom_room_password: (tournament.room_credentials as any)?.[0]?.room_password || "1234",
          })
          .select("*, tournaments(*)")
          .single();

        if (newMatch) {
          matchRow = newMatch;
        } else {
          matchRow = {
            id: `match-${tournament.id}-r1`,
            tournament_id: tournament.id,
            title: `${tournament.title} - Round 1`,
            round_number: 1,
            status: "IN_PROGRESS",
            server_region: "BD_DHAKA_01",
            tournaments: tournament,
          };
        }
      }
    }
  }

  if (!matchRow || !matchRow.tournaments) {
    notFound();
  }

  const { data: partRows } = await supabase
    .from("match_participants")
    .select("*, user:profiles(display_name, avatar_url, username)")
    .eq("match_id", matchRow.id)
    .order("total_score", { ascending: false });

  let participants = (partRows || []).map((p: any) => ({
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

  if (participants.length === 0 && matchRow.tournament_id) {
    const { data: approvedRegs } = await supabase
      .from("tournament_registrations")
      .select("*, user:profiles(display_name, avatar_url, username)")
      .eq("tournament_id", matchRow.tournament_id)
      .eq("status", "APPROVED");

    if (approvedRegs && approvedRegs.length > 0) {
      participants = approvedRegs.map((reg: any, index: number) => ({
        id: `part-${reg.id}`,
        match_id: matchRow.id,
        registration_id: reg.id,
        user_id: reg.user_id,
        participant_name: reg.in_game_name || reg.user?.display_name || reg.user?.username || `Warrior #${index + 1}`,
        free_fire_uid: reg.in_game_uid || "1098234871",
        avatar_url: reg.user?.avatar_url || "",
        kills: 0,
        placement: 0,
        placement_points: 0,
        kill_points: 0,
        total_score: 0,
        is_alive: true,
      }));
    }
  }

  const match = {
    ...matchRow,
    participants,
  };

  const { data: evRows } = await supabase
    .from("match_events")
    .select("*")
    .eq("match_id", matchRow.id)
    .order("created_at", { ascending: true });

  const events = evRows || [];

  const defaultPlacementPoints: Record<number, number> = {
    1: 12,
    2: 9,
    3: 8,
    4: 7,
    5: 6,
    6: 5,
    7: 4,
    8: 3,
    9: 2,
    10: 1,
  };

  const { data: tourRules } = await supabase
    .from("tournament_rules")
    .select("*")
    .eq("tournament_id", matchRow.tournament_id)
    .maybeSingle();

  const formattedTournament = {
    ...matchRow.tournaments,
    scoring_rules: {
      kill_points: tourRules?.kill_points ?? 1,
      placement_points: tourRules?.placement_points ?? defaultPlacementPoints,
    },
    prize_distribution_rules: tourRules?.prize_distribution ?? [
      { place: 1, label: "1st Place (Champion)", amount_cents: matchRow.tournaments.main_prize_pool_cents || 100000 },
    ],
    performance_reward_rules: tourRules?.performance_rules ?? [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 sm:pb-24 space-y-6 animate-admin-portal">
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
        tournament={formattedTournament}
        initialMatch={match}
        initialEvents={events}
      />
    </div>
  );
}
