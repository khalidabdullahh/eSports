import { createClient } from "@/lib/supabase/server";
import { dataStore } from "@/lib/store";
import { Tournament, TournamentStatus } from "@/types";

/**
 * Service to fetch and manage tournaments authoritative from Supabase PostgreSQL
 * with fallback to local store for offline/demo development.
 */
export class TournamentService {
  /**
   * Fetch all active tournaments visible to the public or admin
   */
  static async getTournaments(includeDrafts = false): Promise<Tournament[]> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")) {
        const supabase = await createClient();
        let query = supabase
          .from("tournaments")
          .select("*, games(name, slug), tournament_rules(*)")
          .order("scheduled_start_at", { ascending: true });

        if (!includeDrafts) {
          query = query.neq("status", "DRAFT");
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          return data.map((t) => ({
            id: t.id,
            title: t.title,
            slug: t.slug,
            description: t.description || "",
            game_id: t.game_id,
            game_name: t.games?.name || "Free Fire Battle Royale",
            mode: t.mode,
            format: t.format,
            status: t.status,
            entry_fee_cents: t.entry_fee_cents,
            currency: t.currency || "BDT",
            max_participants: t.max_participants,
            min_participants: 2,
            current_participants_count: t.current_participants_count,
            registration_start: t.registration_open_at,
            registration_end: t.registration_close_at,
            checkin_start: t.registration_close_at,
            checkin_end: t.scheduled_start_at,
            match_start: t.scheduled_start_at,
            room_release_time: t.scheduled_start_at,
            dispute_window_minutes: 30,
            main_prize_pool_cents: t.main_prize_pool_cents,
            performance_reward_pool_cents: t.performance_reward_pool_cents,
            prize_distribution_rules: t.tournament_rules?.prize_distribution || [
              { place: 1, label: "1st Place (Champion)", amount_cents: t.main_prize_pool_cents },
            ],
            performance_reward_rules: t.tournament_rules?.performance_rules || [],
            scoring_rules: {
              kill_points: t.tournament_rules?.kill_points || 1,
              placement_points: t.tournament_rules?.placement_points || {
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
            cancellation_policy: "100% refund if cancelled before registration closing time.",
            created_at: t.created_at,
            updated_at: t.updated_at,
          }));
        }
      }
    } catch {
      // Fallback cleanly to dataStore
    }

    // Default to store tournaments
    return dataStore.getTournaments().filter((t) => includeDrafts || t.status !== "DRAFT");
  }

  /**
   * Fetch single tournament by ID or slug
   */
  static async getTournamentById(idOrSlug: string): Promise<Tournament | null> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")) {
        const supabase = await createClient();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

        let query = supabase
          .from("tournaments")
          .select("*, games(name, slug), tournament_rules(*)");

        if (isUuid) {
          query = query.eq("id", idOrSlug);
        } else {
          query = query.eq("slug", idOrSlug);
        }

        const { data, error } = await query.single();

        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            slug: data.slug,
            description: data.description || "",
            game_id: data.game_id,
            game_name: data.games?.name || "Free Fire Battle Royale",
            mode: data.mode,
            format: data.format,
            status: data.status,
            entry_fee_cents: data.entry_fee_cents,
            currency: data.currency || "BDT",
            max_participants: data.max_participants,
            min_participants: 2,
            current_participants_count: data.current_participants_count,
            registration_start: data.registration_open_at,
            registration_end: data.registration_close_at,
            checkin_start: data.registration_close_at,
            checkin_end: data.scheduled_start_at,
            match_start: data.scheduled_start_at,
            room_release_time: data.scheduled_start_at,
            dispute_window_minutes: 30,
            main_prize_pool_cents: data.main_prize_pool_cents,
            performance_reward_pool_cents: data.performance_reward_pool_cents,
            prize_distribution_rules: data.tournament_rules?.prize_distribution || [
              { place: 1, label: "1st Place", amount_cents: data.main_prize_pool_cents },
            ],
            performance_reward_rules: data.tournament_rules?.performance_rules || [],
            scoring_rules: {
              kill_points: data.tournament_rules?.kill_points || 1,
              placement_points: data.tournament_rules?.placement_points || {
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
            cancellation_policy: "100% refund if cancelled before registration closing time.",
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        }
      }
    } catch {
      // Fallback
    }

    return dataStore.getTournament(idOrSlug) || null;
  }
}
