"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { dataStore } from "@/lib/store";
import { TournamentFormat, TournamentStatus } from "@/types";

export interface CreateTournamentInput {
  title: string;
  gameName: string;
  format: TournamentFormat;
  mode: string;
  description: string;
  bannerUrl?: string;
  entryFeeCents: number;
  mainPrizePoolCents: number;
  performanceRewardPoolCents: number;
  currency: string;
  maxParticipants: number;
  registrationOpenAt: string;
  registrationCloseAt: string;
  scheduledStartAt: string;
}

export async function createTournamentAction(input: CreateTournamentInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    // Verify admin role
    const currentUser = dataStore.getCurrentUser();
    const isStaff =
      currentUser.role === "SUPER_ADMIN" ||
      currentUser.role === "OWNER" ||
      currentUser.role === "TOURNAMENT_ADMIN";

    if (!isStaff && !authUser) {
      return { success: false, error: "Unauthorized: Only administrators can create tournaments." };
    }

    const slug = input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);

    // 1. Attempt Supabase insertion
    if (authUser && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")) {
      // Find game ID
      let gameId = "00000000-0000-0000-0000-000000000001";
      const { data: gameRow } = await supabase.from("games").select("id").limit(1).single();
      if (gameRow) gameId = gameRow.id;

      const { data: tournamentRow, error: tourError } = await supabase
        .from("tournaments")
        .insert({
          slug,
          title: input.title.trim(),
          game_id: gameId,
          format: input.format,
          mode: input.mode.trim(),
          description: input.description.trim(),
          banner_url: input.bannerUrl || null,
          entry_fee_cents: input.entryFeeCents,
          main_prize_pool_cents: input.mainPrizePoolCents,
          performance_reward_pool_cents: input.performanceRewardPoolCents,
          currency: input.currency || "BDT",
          max_participants: input.maxParticipants,
          current_participants_count: 0,
          registration_open_at: input.registrationOpenAt,
          registration_close_at: input.registrationCloseAt,
          scheduled_start_at: input.scheduledStartAt,
          status: "DRAFT",
          created_by: authUser.id,
        })
        .select()
        .single();

      if (!tourError && tournamentRow) {
        // Insert default tournament rules
        await supabase.from("tournament_rules").insert({
          tournament_id: tournamentRow.id,
          kill_points: 1,
          placement_points: {
            "1": 12,
            "2": 9,
            "3": 8,
            "4": 7,
            "5": 6,
            "6": 5,
            "7": 4,
            "8": 3,
            "9": 2,
            "10": 1,
          },
          prize_distribution: [
            { place: 1, label: "1st Place (Champion)", amount_cents: input.mainPrizePoolCents },
          ],
          performance_rules: [
            { rank: 1, label: "Top Fragger (Most Kills)", metric: "kills", amount_cents: input.performanceRewardPoolCents },
          ],
        });

        // Audit log
        await supabase.from("audit_logs").insert({
          actor_id: authUser.id,
          action: "CREATE_TOURNAMENT",
          target_type: "TOURNAMENT",
          target_id: tournamentRow.id,
          details: { title: input.title, entry_fee_cents: input.entryFeeCents },
        });

        revalidatePath("/tournaments");
        revalidatePath("/admin/tournaments");
        revalidatePath("/admin");
        return { success: true, tournamentId: tournamentRow.id, slug };
      }
    }

    // 2. Local store fallback
    const id = `tournament-${Date.now()}`;
    const newTournament = {
      id,
      slug,
      title: input.title.trim(),
      game_id: "free-fire",
      game_name: input.gameName,
      mode: input.mode.trim(),
      format: input.format,
      status: "DRAFT" as TournamentStatus,
      description: input.description.trim(),
      entry_fee_cents: input.entryFeeCents,
      currency: input.currency || "BDT",
      max_participants: input.maxParticipants,
      min_participants: 2,
      current_participants_count: 0,
      registration_start: input.registrationOpenAt,
      registration_end: input.registrationCloseAt,
      checkin_start: input.registrationCloseAt,
      checkin_end: input.scheduledStartAt,
      match_start: input.scheduledStartAt,
      room_release_time: input.scheduledStartAt,
      dispute_window_minutes: 30,
      main_prize_pool_cents: input.mainPrizePoolCents,
      performance_reward_pool_cents: input.performanceRewardPoolCents,
      prize_distribution_rules: [
        { place: 1, label: "1st Place (Champion)", amount_cents: input.mainPrizePoolCents },
      ],
      performance_reward_rules: [
        { rank: 1, label: "Top Fragger", metric: "kills" as const, amount_cents: input.performanceRewardPoolCents },
      ],
      scoring_rules: {
        kill_points: 1,
        placement_points: {
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
        },
      },
      roster_size: 1,
      substitute_limit: 0,
      cancellation_policy: "Standard fair play cancellation policy.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dataStore.addTournament(newTournament);

    revalidatePath("/tournaments");
    revalidatePath("/admin/tournaments");
    revalidatePath("/admin");
    return { success: true, tournamentId: id, slug };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to create tournament." };
  }
}

export async function updateTournamentStatusAction(
  tournamentId: string,
  newStatus: TournamentStatus
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    // Verify admin role
    const currentUser = dataStore.getCurrentUser();
    const isStaff =
      currentUser.role === "SUPER_ADMIN" ||
      currentUser.role === "OWNER" ||
      currentUser.role === "TOURNAMENT_ADMIN";

    if (!isStaff && !authUser) {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    if (authUser && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")) {
      await supabase
        .from("tournaments")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", tournamentId);

      await supabase.from("audit_logs").insert({
        actor_id: authUser.id,
        action: "UPDATE_TOURNAMENT_STATUS",
        target_type: "TOURNAMENT",
        target_id: tournamentId,
        details: { newStatus },
      });
    }

    dataStore.updateTournamentStatus(tournamentId, newStatus);

    revalidatePath("/tournaments");
    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath("/admin/tournaments");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update status." };
  }
}
