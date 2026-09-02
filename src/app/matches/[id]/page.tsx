import React from "react";
import { createClient } from "@/lib/supabase/server";
import { LiveMatchConsole } from "@/components/live-match-console";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  if (!isSupabaseConfigured) {
    notFound();
  }

  const supabase = await createClient();

  const { data: matchRow } = await supabase
    .from("matches")
    .select("*, tournaments(*)")
    .eq("id", id)
    .maybeSingle();

  if (!matchRow || !matchRow.tournaments) {
    notFound();
  }

  const { data: partRows } = await supabase
    .from("match_participants")
    .select("*, user:profiles(display_name, avatar_url, username)")
    .eq("match_id", id)
    .order("total_score", { ascending: false });

  const participants = (partRows || []).map((p: any) => ({
    id: p.id,
    match_id: id,
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
    .eq("match_id", id)
    .order("created_at", { ascending: true });

  const events = evRows || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <LiveMatchConsole
        tournament={matchRow.tournaments}
        initialMatch={match}
        initialEvents={events}
      />
    </div>
  );
}
