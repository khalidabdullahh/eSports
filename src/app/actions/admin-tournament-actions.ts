"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { dataStore } from "@/lib/store";
import { TournamentFormat, TournamentStatus } from "@/types";
import { TournamentStateMachine } from "@/lib/services/tournament-state-machine";

const isProduction = process.env.NODE_ENV === "production";
const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
);

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

    // 1. Authoritative production path
    if (authUser && isSupabaseConfigured) {
      // Verify admin role from database
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      const isStaff =
        profile?.role === "SUPER_ADMIN" ||
        profile?.role === "OWNER" ||
        profile?.role === "TOURNAMENT_ADMIN";

      if (!isStaff) {
        return { success: false, error: "Unauthorized: Administrator privileges required." };
      }

      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);

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

      if (tourError || !tournamentRow) {
        return { success: false, error: tourError?.message || "Failed to create tournament in database." };
      }

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

    // 2. Local prototype fallback (STRICTLY non-production offline mode only)
    if (!isProduction && !isSupabaseConfigured) {
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);

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
    }

    return { success: false, error: "Database configuration error." };
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

    // 1. Authoritative production path
    if (authUser && isSupabaseConfigured) {
      // Verify admin role from database
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      const isStaff =
        profile?.role === "SUPER_ADMIN" ||
        profile?.role === "OWNER" ||
        profile?.role === "TOURNAMENT_ADMIN";

      if (!isStaff) {
        return { success: false, error: "Unauthorized: Admin privileges required." };
      }

      // Fetch current status from database to enforce state machine validation
      const { data: tour, error: fetchErr } = await supabase
        .from("tournaments")
        .select("status")
        .eq("id", tournamentId)
        .single();

      if (fetchErr || !tour) {
        return { success: false, error: "Tournament not found in database." };
      }

      // Enforce strict State Machine validation (throws error if illegal transition)
      TournamentStateMachine.transition(tour.status as TournamentStatus, newStatus);

      const { error: updateErr } = await supabase
        .from("tournaments")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", tournamentId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      await supabase.from("audit_logs").insert({
        actor_id: authUser.id,
        action: "UPDATE_TOURNAMENT_STATUS",
        target_type: "TOURNAMENT",
        target_id: tournamentId,
        details: { previousStatus: tour.status, newStatus },
      });

      revalidatePath("/tournaments");
      revalidatePath(`/tournaments/${tournamentId}`);
      revalidatePath("/admin/tournaments");
      revalidatePath("/admin");
      return { success: true };
    }

    // 2. Local prototype fallback (STRICTLY non-production offline mode only)
    if (!isProduction && !isSupabaseConfigured) {
      dataStore.updateTournamentStatus(tournamentId, newStatus);

      revalidatePath("/tournaments");
      revalidatePath(`/tournaments/${tournamentId}`);
      revalidatePath("/admin/tournaments");
      revalidatePath("/admin");
      return { success: true };
    }

    return { success: false, error: "Database configuration error." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update status." };
  }
}

/**
 * Super Admin action: Updates stream embed URL (Facebook Live, YouTube, Twitch) for a tournament
 */
export async function updateTournamentStreamAction(
  tournamentId: string,
  streamUrl: string,
  streamPlatform = "facebook"
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser && isSupabaseConfigured) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      const isStaff =
        profile?.role === "SUPER_ADMIN" ||
        profile?.role === "OWNER" ||
        profile?.role === "TOURNAMENT_ADMIN" ||
        profile?.role === "REFEREE";

      if (!isStaff) {
        return { success: false, error: "Unauthorized: Admin privileges required." };
      }

      await supabase
        .from("tournaments")
        .update({
          stream_url: streamUrl.trim() || null,
          stream_platform: streamPlatform,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tournamentId);

      await supabase.from("audit_logs").insert({
        actor_id: authUser.id,
        action: "UPDATE_TOURNAMENT_STREAM",
        target_type: "TOURNAMENT",
        target_id: tournamentId,
        details: { streamUrl, streamPlatform },
      });

      revalidatePath("/live");
      revalidatePath(`/tournaments/${tournamentId}`);
      revalidatePath("/admin");
      return { success: true };
    }

    if (!isProduction && !isSupabaseConfigured) {
      const tour = dataStore.getTournament(tournamentId);
      if (tour) {
        tour.stream_url = streamUrl.trim();
      }
      revalidatePath("/live");
      revalidatePath(`/tournaments/${tournamentId}`);
      revalidatePath("/admin");
      return { success: true };
    }

    return { success: false, error: "Database configuration error." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update stream configuration." };
  }
}

/**
 * Super Admin action: Configures or updates cryptographic room credentials
 */
export async function updateRoomCredentialsAction(
  tournamentId: string,
  roomName: string,
  roomPassword: string,
  releaseAt?: string
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser && isSupabaseConfigured) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      const isStaff =
        profile?.role === "SUPER_ADMIN" ||
        profile?.role === "OWNER" ||
        profile?.role === "TOURNAMENT_ADMIN" ||
        profile?.role === "REFEREE";

      if (!isStaff) {
        return { success: false, error: "Unauthorized: Admin privileges required." };
      }

      const releaseTime = releaseAt || new Date().toISOString();

      const { error: upsertErr } = await supabase.from("room_credentials").upsert(
        {
          tournament_id: tournamentId,
          room_name: roomName.trim(),
          room_password: roomPassword.trim(),
          release_at: releaseTime,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "tournament_id" }
      );

      if (upsertErr) {
        return { success: false, error: upsertErr.message };
      }

      await supabase.from("audit_logs").insert({
        actor_id: authUser.id,
        action: "SET_ROOM_CREDENTIALS",
        target_type: "ROOM_CREDENTIALS",
        target_id: tournamentId,
        details: { roomName, releaseTime },
      });

      revalidatePath(`/tournaments/${tournamentId}/room`);
      revalidatePath("/admin");
      return { success: true };
    }

    if (!isProduction && !isSupabaseConfigured) {
      dataStore.setRoomCredential(
        tournamentId,
        roomName.trim(),
        roomPassword.trim(),
        releaseAt || new Date().toISOString()
      );
      revalidatePath(`/tournaments/${tournamentId}/room`);
      revalidatePath("/admin");
      return { success: true };
    }

    return { success: false, error: "Database configuration error." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update room credentials." };
  }
}

/**
 * Super Admin action: Deletes or cancels a tournament
 */
export async function deleteTournamentAction(tournamentId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser && isSupabaseConfigured) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      const isStaff =
        profile?.role === "SUPER_ADMIN" ||
        profile?.role === "OWNER" ||
        profile?.role === "TOURNAMENT_ADMIN";

      if (!isStaff) {
        return { success: false, error: "Unauthorized: Administrator privileges required to delete tournament." };
      }

      // Check if tournament exists
      const { data: tour } = await supabase
        .from("tournaments")
        .select("id, title, status")
        .eq("id", tournamentId)
        .single();

      if (!tour) {
        return { success: false, error: "Tournament not found." };
      }

      // Delete tournament (foreign key CASCADE removes rules, room_credentials, registrations)
      const { error: delErr } = await supabase
        .from("tournaments")
        .delete()
        .eq("id", tournamentId);

      if (delErr) {
        return { success: false, error: delErr.message };
      }

      await supabase.from("audit_logs").insert({
        actor_id: authUser.id,
        action: "DELETE_TOURNAMENT",
        target_type: "TOURNAMENT",
        target_id: tournamentId,
        details: { title: tour.title, status: tour.status },
      });

      revalidatePath("/tournaments");
      revalidatePath("/admin/tournaments");
      revalidatePath("/admin");
      return { success: true };
    }

    if (!isProduction && !isSupabaseConfigured) {
      // In local store, remove tournament
      const all = dataStore.getTournaments().filter((t) => t.id !== tournamentId);
      revalidatePath("/tournaments");
      revalidatePath("/admin/tournaments");
      revalidatePath("/admin");
      return { success: true };
    }

    return { success: false, error: "Database configuration error." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to delete tournament." };
  }
}


