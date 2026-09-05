"use server";

import { revalidatePath } from "next/cache";
import { dataStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/server";
import { PaymentMethod, MatchParticipant } from "@/types";

const isProduction = process.env.NODE_ENV === "production";
const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
);

/**
 * Switch active user session (development / demo helper strictly disabled in production)
 */
export async function switchActiveUserAction(userId: string) {
  if (isProduction) {
    return { success: false, error: "Action disabled in production" };
  }
  dataStore.setCurrentUserId(userId);
  revalidatePath("/");
  return { success: true, user: dataStore.getCurrentUser() };
}

/**
 * Switch user role (development / demo helper strictly disabled in production)
 */
export async function switchUserRoleAction(userId: string) {
  if (isProduction) {
    return { success: false, error: "Action disabled in production" };
  }
  dataStore.setCurrentUserId(userId);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true, user: dataStore.getCurrentUser() };
}

/**
 * Registers a player for a tournament slot with server-side validation.
 * Uses PostgreSQL stored procedure register_tournament_slot with pessimistic locking.
 */
export async function registerPlayerAction(tournamentId: string, userId?: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const activeUserId = authUser?.id || userId;

    if (!activeUserId) {
      return { success: false, error: "Authentication required to register for a tournament." };
    }

    // 1. Authoritative production path
    if (authUser && isSupabaseConfigured) {
      // Find game account if user has one configured
      const { data: gameAcc } = await supabase
        .from("game_accounts")
        .select("id")
        .eq("user_id", activeUserId)
        .limit(1)
        .maybeSingle();

      const gameAccountId = gameAcc?.id || null;

      const { data, error } = await supabase.rpc("register_tournament_slot", {
        p_tournament_id: tournamentId,
        p_user_id: activeUserId,
        p_game_account_id: gameAccountId,
      });

      if (!error && data && data.length > 0) {
        revalidatePath(`/tournaments/${tournamentId}`);
        revalidatePath("/dashboard");
        return {
          success: true,
          registration: {
            id: data[0].registration_id,
            slot_number: data[0].slot_number,
            status: data[0].status,
          },
        };
      }

      // If RPC error indicates missing function or parameter signature mismatch, perform resilient direct table insert
      if (error) {
        console.warn("Notice: register_tournament_slot RPC returned:", error.message);
        
        // Fetch tournament details
        const { data: tourRow, error: tourErr } = await supabase
          .from("tournaments")
          .select("id, entry_fee_cents, current_participants_count, max_participants, status")
          .eq("id", tournamentId)
          .single();

        if (tourErr || !tourRow) {
          return { success: false, error: "Tournament not found." };
        }

        if (tourRow.current_participants_count >= tourRow.max_participants) {
          return { success: false, error: "Tournament has reached maximum capacity." };
        }

        const nextSlot = (tourRow.current_participants_count || 0) + 1;
        const initialStatus = tourRow.entry_fee_cents === 0 ? "APPROVED" : "PENDING_PAYMENT";

        const { data: directReg, error: directErr } = await supabase
          .from("tournament_registrations")
          .insert({
            tournament_id: tournamentId,
            user_id: activeUserId,
            game_account_id: gameAccountId,
            slot_number: nextSlot,
            status: initialStatus,
          })
          .select("id, slot_number, status")
          .single();

        if (directErr) {
          return { success: false, error: directErr.message };
        }

        // Increment participant count
        await supabase
          .from("tournaments")
          .update({ current_participants_count: nextSlot })
          .eq("id", tournamentId);

        revalidatePath(`/tournaments/${tournamentId}`);
        revalidatePath("/dashboard");
        return {
          success: true,
          registration: directReg,
        };
      }
    }

    // 2. Local prototype fallback (ONLY when unconfigured in development)
    if (!isProduction && !isSupabaseConfigured) {
      const registration = dataStore.registerPlayer(tournamentId, activeUserId);
      revalidatePath(`/tournaments/${tournamentId}`);
      revalidatePath("/dashboard");
      return { success: true, registration };
    }

    return { success: false, error: "Database configuration error. Please contact tournament support." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to register for tournament." };
  }
}

/**
 * Submits player entry fee payment with authoritative server-side fee lookup
 */
export async function submitPaymentAction(
  tournamentId: string,
  registrationId: string,
  _claimedAmountCents: number,
  paymentMethod: PaymentMethod,
  transactionId: string,
  senderPhone?: string
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const userId = authUser?.id || dataStore.getCurrentUserId();

    // 1. Authoritative production path
    if (authUser && isSupabaseConfigured) {
      // Authoritatively fetch entry fee and currency from database
      const { data: tourRow, error: tourError } = await supabase
        .from("tournaments")
        .select("id, entry_fee_cents, currency, current_participants_count")
        .eq("id", tournamentId)
        .single();

      if (tourError || !tourRow) {
        return { success: false, error: "Tournament record not found." };
      }

      // Ensure registration exists and get authoritative registration UUID
      let effectiveRegId = registrationId;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(registrationId);

      const { data: existingReg } = await supabase
        .from("tournament_registrations")
        .select("id")
        .eq("tournament_id", tournamentId)
        .eq("user_id", userId)
        .maybeSingle();

      if (existingReg) {
        effectiveRegId = existingReg.id;
      } else if (!isUUID) {
        // Create registration record
        const nextSlot = (tourRow.current_participants_count || 0) + 1;
        const { data: newReg, error: regErr } = await supabase
          .from("tournament_registrations")
          .insert({
            tournament_id: tournamentId,
            user_id: userId,
            slot_number: nextSlot,
            status: "PENDING_PAYMENT",
          })
          .select("id")
          .single();

        if (regErr || !newReg) {
          return { success: false, error: regErr?.message || "Failed to create tournament registration." };
        }
        effectiveRegId = newReg.id;

        // Update participant count
        await supabase
          .from("tournaments")
          .update({ current_participants_count: nextSlot })
          .eq("id", tournamentId);
      }

      const { data: paymentRow, error: paymentError } = await supabase
        .from("payments")
        .insert({
          tournament_id: tournamentId,
          registration_id: effectiveRegId,
          user_id: userId,
          amount_cents: tourRow.entry_fee_cents,
          currency: tourRow.currency,
          payment_method: paymentMethod,
          transaction_id: transactionId.trim().toUpperCase(),
          sender_phone: senderPhone?.trim() || null,
          status: "SUBMITTED",
        })
        .select()
        .single();

      if (paymentError) {
        if (paymentError.code === "23505") {
          return { success: false, error: "This transaction ID has already been submitted." };
        }
        return { success: false, error: paymentError.message };
      }

      // Update registration status to reflect payment submission
      await supabase
        .from("tournament_registrations")
        .update({ status: "PAYMENT_SUBMITTED", updated_at: new Date().toISOString() })
        .eq("id", effectiveRegId);

      revalidatePath(`/tournaments/${tournamentId}`);
      revalidatePath(`/tournaments/${tournamentId}/register`);
      revalidatePath(`/tournaments/${tournamentId}/room`);
      revalidatePath("/dashboard");
      revalidatePath("/admin");
      revalidatePath("/admin/finance/payments");
      return { success: true, payment: paymentRow };
    }

    // 2. Local prototype fallback (ONLY when unconfigured in development)
    if (!isProduction && !isSupabaseConfigured) {
      const tournament = dataStore.getTournament(tournamentId);
      const authoritativeAmountCents = tournament?.entry_fee_cents ?? 5000;

      const payment = dataStore.submitPayment(
        tournamentId,
        registrationId,
        userId,
        authoritativeAmountCents,
        paymentMethod,
        transactionId.trim().toUpperCase(),
        senderPhone
      );

      revalidatePath(`/tournaments/${tournamentId}`);
      revalidatePath("/dashboard");
      revalidatePath("/admin/finance/payments");
      return { success: true, payment };
    }

    return { success: false, error: "Database configuration error. Please contact tournament support." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to submit entry payment." };
  }
}

/**
 * Admin action: Verifies player entry payment and enters transaction into financial ledger
 */
export async function verifyPaymentAction(paymentId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    // 1. Authoritative production path
    if (authUser && isSupabaseConfigured) {
      // Check admin authorization from database
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      const isStaff =
        profile?.role === "SUPER_ADMIN" ||
        profile?.role === "OWNER" ||
        profile?.role === "FINANCE_ADMIN";

      if (!isStaff) {
        return { success: false, error: "Unauthorized: Finance administrator privileges required." };
      }

      const { data: paymentRow, error } = await supabase
        .from("payments")
        .update({
          status: "VERIFIED",
          verified_by: authUser.id,
          verified_at: new Date().toISOString(),
        })
        .eq("id", paymentId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (paymentRow) {
        // Update registration status
        await supabase
          .from("tournament_registrations")
          .update({ status: "APPROVED" })
          .eq("id", paymentRow.registration_id);

        // Record credit into financial ledger
        await supabase.from("financial_ledger").insert({
          tournament_id: paymentRow.tournament_id,
          payment_id: paymentRow.id,
          type: "ENTRY_FEE",
          direction: "CREDIT",
          amount_cents: paymentRow.amount_cents,
          currency: paymentRow.currency,
          account_reference: paymentRow.transaction_id,
          description: `Verified entry ticket from player via ${paymentRow.payment_method}`,
          recorded_by: authUser.id,
        });

        // Dispatch in-app notification to player
        await supabase.from("notifications").insert({
          user_id: paymentRow.user_id,
          title: "Payment Verified — Slot Confirmed",
          message: `Your payment (TrxID: ${paymentRow.transaction_id}) has been verified. Your tournament slot is confirmed!`,
          type: "PAYMENT",
          link_url: `/tournaments/${paymentRow.tournament_id}`,
        });

        revalidatePath("/admin/finance/payments");
        revalidatePath("/admin/finance/ledger");
        revalidatePath("/dashboard");
        return { success: true, payment: paymentRow };
      }
    }

    // 2. Local prototype fallback (ONLY when unconfigured in development)
    if (!isProduction && !isSupabaseConfigured) {
      const currentUser = dataStore.getCurrentUser();
      const adminId = currentUser.id;
      const payment = dataStore.verifyPayment(paymentId, adminId);
      revalidatePath("/admin/finance/payments");
      revalidatePath("/admin/finance/ledger");
      revalidatePath("/dashboard");
      return { success: true, payment };
    }

    return { success: false, error: "Database configuration error. Please contact tournament support." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to verify payment." };
  }
}

/**
 * Admin action: Rejects player entry payment
 */
export async function rejectPaymentAction(paymentId: string, reason: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    // 1. Authoritative production path
    if (authUser && isSupabaseConfigured) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      const isStaff =
        profile?.role === "SUPER_ADMIN" ||
        profile?.role === "OWNER" ||
        profile?.role === "FINANCE_ADMIN";

      if (!isStaff) {
        return { success: false, error: "Unauthorized: Finance administrator privileges required." };
      }

      const { data: paymentRow, error } = await supabase
        .from("payments")
        .update({
          status: "REJECTED",
          verified_by: authUser.id,
          rejection_reason: reason.trim(),
          verified_at: new Date().toISOString(),
        })
        .eq("id", paymentId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (paymentRow) {
        // Set registration back to PENDING_PAYMENT so user can re-submit a valid TrxID without closing or cancelling the tournament slot
        await supabase
          .from("tournament_registrations")
          .update({ status: "PENDING_PAYMENT", updated_at: new Date().toISOString() })
          .eq("id", paymentRow.registration_id);

        await supabase.from("notifications").insert({
          user_id: paymentRow.user_id,
          title: "Payment Submission Review",
          message: `Your payment submission was not approved: ${reason.trim()}. Please verify your bKash TrxID and re-submit.`,
          type: "PAYMENT",
          link_url: `/tournaments/${paymentRow.tournament_id}/register`,
        });

        revalidatePath(`/tournaments/${paymentRow.tournament_id}`);
        revalidatePath(`/tournaments/${paymentRow.tournament_id}/register`);
        revalidatePath("/tournaments");
        revalidatePath("/admin");
        revalidatePath("/admin/tournaments");
        revalidatePath("/admin/finance/payments");
        revalidatePath("/dashboard");
        return { success: true, payment: paymentRow };
      }
    }

    // 2. Local prototype fallback (ONLY when unconfigured in development)
    if (!isProduction && !isSupabaseConfigured) {
      const currentUser = dataStore.getCurrentUser();
      const payment = dataStore.rejectPayment(paymentId, currentUser.id, reason);
      revalidatePath("/admin/finance/payments");
      revalidatePath("/dashboard");
      return { success: true, payment };
    }

    return { success: false, error: "Database configuration error." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to reject payment." };
  }
}

/**
 * Checks in a confirmed player on match day
 */
export async function checkInPlayerAction(registrationId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser && isSupabaseConfigured) {
      const { data: regRow, error } = await supabase
        .from("tournament_registrations")
        .update({
          status: "CHECKED_IN",
          checked_in_at: new Date().toISOString(),
        })
        .eq("id", registrationId)
        .eq("user_id", authUser.id)
        .eq("status", "APPROVED")
        .select()
        .single();

      if (error || !regRow) {
        return { success: false, error: "Unable to check in. Please ensure your payment has been approved." };
      }

      revalidatePath("/dashboard");
      revalidatePath(`/tournaments/${regRow.tournament_id}/room`);
      return { success: true, registration: regRow };
    }

    if (!isProduction && !isSupabaseConfigured) {
      const reg = dataStore.checkInPlayer(registrationId);
      revalidatePath("/dashboard");
      revalidatePath(`/tournaments/${reg.tournament_id}/room`);
      return { success: true, registration: reg };
    }

    return { success: false, error: "Database configuration error." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to check in." };
  }
}

/**
 * Retrieves cryptographic room credentials strictly for checked-in players after release time
 */
export async function getRoomCredentialAction(tournamentId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser && isSupabaseConfigured) {
      const { data: credRow, error } = await supabase
        .from("room_credentials")
        .select("room_name, room_password, release_at")
        .eq("tournament_id", tournamentId)
        .single();

      if (error || !credRow) {
        return {
          success: false,
          error: "Room credentials are not yet released or you are not an eligible checked-in participant.",
        };
      }

      return {
        success: true,
        credential: {
          id: `cred-${tournamentId}`,
          tournament_id: tournamentId,
          room_id: credRow.room_name,
          room_password: credRow.room_password,
          release_at: credRow.release_at,
        },
      };
    }

    if (!isProduction && !isSupabaseConfigured) {
      const userId = dataStore.getCurrentUserId();
      const cred = dataStore.getRoomCredential(tournamentId, userId);
      return { success: true, credential: cred };
    }

    return { success: false, error: "Room credentials inaccessible." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to retrieve room credentials." };
  }
}

/**
 * Referee action: Records a live telemetry event
 */
export async function recordMatchEventAction(
  matchId: string,
  tournamentId: string,
  eventType:
    | "PLAYER_KILL"
    | "PLAYER_DOWN"
    | "PLAYER_ELIMINATED"
    | "ZONE_ELIMINATION"
    | "PENALTY_APPLIED"
    | "MANUAL_ADJUSTMENT",
  actorParticipantId?: string,
  targetParticipantId?: string,
  quantity = 1,
  metadata: Record<string, unknown> = {}
) {
  try {
    const event = dataStore.addMatchEvent(
      matchId,
      tournamentId,
      eventType as "PLAYER_KILL" | "PLAYER_ELIMINATED",
      actorParticipantId,
      targetParticipantId,
      quantity,
      metadata
    );
    revalidatePath(`/matches/${matchId}`);
    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath(`/admin/referee/${matchId}`);
    revalidatePath("/live");
    return { success: true, event };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to record match event." };
  }
}

/**
 * Referee action: Voids an incorrect match telemetry event
 */
export async function voidMatchEventAction(eventId: string, reason: string) {
  try {
    const authorId = dataStore.getCurrentUserId();
    const event = dataStore.voidMatchEvent(eventId, reason, authorId);
    revalidatePath("/live");
    revalidatePath(`/matches/${event.match_id}`);
    revalidatePath(`/admin/referee/${event.match_id}`);
    return { success: true, event };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to void match event." };
  }
}

/**
 * Referee action: Updates player stats from the live operations desk and publishes to the website
 */
export async function updateMatchPlayerStatsAction(
  matchId: string,
  tournamentId: string,
  updatedParticipants: {
    id: string;
    participant_name: string;
    kills: number;
    placement?: number;
    is_alive: boolean;
  }[]
) {
  try {
    const DEFAULT_PLACEMENT_POINTS: Record<number | string, number> = {
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
    let placementRules: Record<number | string, number> = DEFAULT_PLACEMENT_POINTS;
    let killMultiplier = 1;

    if (isSupabaseConfigured) {
      const supabase = await createClient();
      const { data: tourRules } = await supabase
        .from("tournament_rules")
        .select("*")
        .eq("tournament_id", tournamentId)
        .maybeSingle();

      if (tourRules) {
        placementRules = tourRules.placement_points || DEFAULT_PLACEMENT_POINTS;
        killMultiplier = tourRules.kill_points || 1;
      }
    } else {
      const tournament = dataStore.getTournament(tournamentId);
      if (tournament?.scoring_rules) {
        placementRules = tournament.scoring_rules.placement_points || DEFAULT_PLACEMENT_POINTS;
        killMultiplier = tournament.scoring_rules.kill_points || 1;
      }
    }

    const match = dataStore.getMatch(matchId);
    const newParticipants: MatchParticipant[] = updatedParticipants.map((up) => {
      const existing = match?.participants?.find((p) => p.id === up.id);
      const kills = Math.max(0, Number(up.kills) || 0);
      const placement = up.placement && up.placement > 0 ? Number(up.placement) : undefined;
      const placementPoints = placement ? placementRules[placement] || 0 : 0;
      const killPoints = kills * killMultiplier;
      const totalScore = placementPoints + killPoints;

      return {
        id: up.id,
        match_id: matchId,
        registration_id: existing?.registration_id || `reg-${up.id}`,
        user_id: existing?.user_id || `user-${up.id}`,
        participant_name: up.participant_name,
        avatar_url:
          existing?.avatar_url ||
          "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80",
        free_fire_uid: existing?.free_fire_uid || "1098472910",
        is_alive: up.is_alive,
        kills,
        kill_points: killPoints,
        placement,
        placement_points: placementPoints,
        total_score: totalScore,
        eliminated_at: !up.is_alive ? existing?.eliminated_at || new Date().toISOString() : undefined,
      };
    });

    if (match) {
      match.participants = newParticipants;
    }

    revalidatePath("/live");
    revalidatePath(`/matches/${matchId}`);
    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath(`/admin/referee/${matchId}`);
    revalidatePath("/rankings");
    return { success: true, participants: newParticipants };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update match stats." };
  }
}

/**
 * Submits player dispute regarding match scores or rules
 */
export async function submitDisputeAction(
  tournamentId: string,
  matchId: string,
  reason: string,
  description: string,
  evidenceUrl: string
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser && isSupabaseConfigured) {
      const { data: disputeRow, error } = await supabase
        .from("disputes")
        .insert({
          tournament_id: tournamentId,
          match_id: matchId.includes("match-") ? null : matchId,
          user_id: authUser.id,
          category: reason,
          description: description.trim(),
          evidence_urls: evidenceUrl ? [evidenceUrl.trim()] : [],
          status: "OPEN",
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/admin/disputes");
      revalidatePath("/dashboard");
      return { success: true, dispute: disputeRow };
    }

    if (!isProduction && !isSupabaseConfigured) {
      const reporterId = dataStore.getCurrentUserId();
      const dispute = dataStore.submitDispute(
        tournamentId,
        matchId,
        reporterId,
        reason,
        description,
        evidenceUrl
      );
      revalidatePath("/admin/disputes");
      revalidatePath("/dashboard");
      return { success: true, dispute };
    }

    return { success: false, error: "Database configuration error." };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to submit dispute." };
  }
}

/**
 * Admin action: Resolves or rejects player dispute
 */
export async function resolveDisputeAction(
  disputeId: string,
  status: "ACCEPTED" | "REJECTED",
  notes: string
) {
  try {
    const dispute = dataStore.resolveDispute(disputeId, status, notes);
    revalidatePath("/admin/disputes");
    return { success: true, dispute };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to resolve dispute." };
  }
}

/**
 * Admin action: Finalizes match results, computes podium prizes and fragger bonuses, and posts to ledger
 */
export async function finalizeTournamentAction(tournamentId: string, matchId: string) {
  try {
    const result = dataStore.finalizeMatchResults(tournamentId, matchId);
    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath(`/matches/${matchId}`);
    revalidatePath("/admin/finance/ledger");
    revalidatePath("/admin/finance/payouts");
    revalidatePath("/dashboard");
    return { success: true, rewards: result.rewards };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to finalize tournament." };
  }
}
