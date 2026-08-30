"use server";

import { revalidatePath } from "next/cache";
import { dataStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/server";
import { PaymentMethod, MatchParticipant } from "@/types";

/**
 * Switch active user session (development / demo helper)
 */
export async function switchActiveUserAction(userId: string) {
  dataStore.setCurrentUserId(userId);
  revalidatePath("/");
  return { success: true, user: dataStore.getCurrentUser() };
}

/**
 * Switch user role (admin desk unlocking)
 */
export async function switchUserRoleAction(userId: string) {
  dataStore.setCurrentUserId(userId);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true, user: dataStore.getCurrentUser() };
}

/**
 * Registers a player for a tournament slot with server-side validation
 */
export async function registerPlayerAction(tournamentId: string, userId?: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const activeUserId = authUser?.id || userId || dataStore.getCurrentUserId();

    // 1. Attempt Supabase PostgreSQL registration procedure if connected
    if (authUser && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")) {
      const { data, error } = await supabase.rpc("register_tournament_slot", {
        p_tournament_id: tournamentId,
        p_user_id: activeUserId,
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
    }

    // 2. Fallback to server-authoritative data store
    const registration = dataStore.registerPlayer(tournamentId, activeUserId);
    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath("/dashboard");
    return { success: true, registration };
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

    // Authoritative fee lookup: Never trust client-submitted amount
    const tournament = dataStore.getTournament(tournamentId);
    const authoritativeAmountCents = tournament?.entry_fee_cents ?? 5000;

    // 1. Attempt Supabase payment insertion
    if (authUser && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")) {
      const { data: paymentRow, error: paymentError } = await supabase
        .from("payments")
        .insert({
          tournament_id: tournamentId,
          registration_id: registrationId,
          user_id: userId,
          amount_cents: authoritativeAmountCents,
          currency: tournament?.currency || "BDT",
          payment_method: paymentMethod,
          transaction_id: transactionId.trim().toUpperCase(),
          sender_phone: senderPhone?.trim() || null,
          status: "SUBMITTED",
        })
        .select()
        .single();

      if (!paymentError && paymentRow) {
        revalidatePath(`/tournaments/${tournamentId}`);
        revalidatePath("/dashboard");
        revalidatePath("/admin/finance/payments");
        return { success: true, payment: paymentRow };
      }
    }

    // 2. Fallback to server-authoritative data store
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

    const adminId = authUser?.id || dataStore.getCurrentUserId();

    // Authorize admin caller
    const currentUser = dataStore.getCurrentUser();
    const isStaff =
      currentUser.role === "SUPER_ADMIN" ||
      currentUser.role === "OWNER" ||
      currentUser.role === "FINANCE_ADMIN";

    if (!isStaff && !authUser) {
      return { success: false, error: "Unauthorized: Only finance administrators can verify payments." };
    }

    // 1. Supabase database update
    if (authUser && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")) {
      const { data: paymentRow, error } = await supabase
        .from("payments")
        .update({
          status: "VERIFIED",
          verified_by: adminId,
          verified_at: new Date().toISOString(),
        })
        .eq("id", paymentId)
        .select()
        .single();

      if (!error && paymentRow) {
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
          recorded_by: adminId,
        });

        revalidatePath("/admin/finance/payments");
        revalidatePath("/admin/finance/ledger");
        revalidatePath("/dashboard");
        return { success: true, payment: paymentRow };
      }
    }

    // 2. Fallback to data store
    const payment = dataStore.verifyPayment(paymentId, adminId);
    revalidatePath("/admin/finance/payments");
    revalidatePath("/admin/finance/ledger");
    revalidatePath("/dashboard");
    return { success: true, payment };
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

    const adminId = authUser?.id || dataStore.getCurrentUserId();

    const payment = dataStore.rejectPayment(paymentId, adminId, reason);
    revalidatePath("/admin/finance/payments");
    revalidatePath("/dashboard");
    return { success: true, payment };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to reject payment." };
  }
}

/**
 * Checks in a confirmed player on match day
 */
export async function checkInPlayerAction(registrationId: string) {
  try {
    const reg = dataStore.checkInPlayer(registrationId);
    revalidatePath("/dashboard");
    revalidatePath(`/tournaments/${reg.tournament_id}/room`);
    return { success: true, registration: reg };
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

    const userId = authUser?.id || dataStore.getCurrentUserId();
    const cred = dataStore.getRoomCredential(tournamentId, userId);
    return { success: true, credential: cred };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to retrieve room credentials." };
  }
}

/**
 * Referee action: Records a live telemetry event (frag, elimination, etc.)
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
    const match = dataStore.getMatch(matchId);
    const tournament = dataStore.getTournament(tournamentId);
    if (!match || !tournament) throw new Error("Match or tournament not found");

    const placementRules = tournament.scoring_rules.placement_points;
    const killMultiplier = tournament.scoring_rules.kill_points;

    const newParticipants: MatchParticipant[] = updatedParticipants.map((up) => {
      const existing = match.participants.find((p) => p.id === up.id);
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

    match.participants = newParticipants;

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

    const reporterId = authUser?.id || dataStore.getCurrentUserId();
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
