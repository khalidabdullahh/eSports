"use server";

import { revalidatePath } from "next/cache";
import { dataStore } from "@/lib/store";
import { PaymentMethod, MatchParticipant } from "@/types";

export async function switchActiveUserAction(userId: string) {
  dataStore.setCurrentUserId(userId);
  revalidatePath("/");
  return { success: true, user: dataStore.getCurrentUser() };
}

export async function switchUserRoleAction(userId: string) {
  dataStore.setCurrentUserId(userId);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true, user: dataStore.getCurrentUser() };
}

export async function registerPlayerAction(tournamentId: string, userId?: string) {
  try {
    const activeUserId = userId || dataStore.getCurrentUserId();
    const registration = dataStore.registerPlayer(tournamentId, activeUserId);
    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath("/dashboard");
    return { success: true, registration };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function submitPaymentAction(
  tournamentId: string,
  registrationId: string,
  amountCents: number,
  paymentMethod: PaymentMethod,
  transactionId: string,
  senderPhone?: string
) {
  try {
    const userId = dataStore.getCurrentUserId();
    const payment = dataStore.submitPayment(
      tournamentId,
      registrationId,
      userId,
      amountCents,
      paymentMethod,
      transactionId,
      senderPhone
    );
    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath("/dashboard");
    revalidatePath("/admin/finance/payments");
    return { success: true, payment };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function verifyPaymentAction(paymentId: string) {
  try {
    const adminId = dataStore.getCurrentUserId();
    const payment = dataStore.verifyPayment(paymentId, adminId);
    revalidatePath("/admin/finance/payments");
    revalidatePath("/admin/finance/ledger");
    revalidatePath("/dashboard");
    return { success: true, payment };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function rejectPaymentAction(paymentId: string, reason: string) {
  try {
    const adminId = dataStore.getCurrentUserId();
    const payment = dataStore.rejectPayment(paymentId, adminId, reason);
    revalidatePath("/admin/finance/payments");
    revalidatePath("/dashboard");
    return { success: true, payment };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function checkInPlayerAction(registrationId: string) {
  try {
    const reg = dataStore.checkInPlayer(registrationId);
    revalidatePath("/dashboard");
    revalidatePath(`/tournaments/${reg.tournament_id}/room`);
    return { success: true, registration: reg };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getRoomCredentialAction(tournamentId: string) {
  try {
    const userId = dataStore.getCurrentUserId();
    const cred = dataStore.getRoomCredential(tournamentId, userId);
    return { success: true, credential: cred };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

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
    return { success: false, error: (err as Error).message };
  }
}

export async function voidMatchEventAction(eventId: string, reason: string) {
  try {
    const authorId = dataStore.getCurrentUserId();
    const event = dataStore.voidMatchEvent(eventId, reason, authorId);
    revalidatePath("/live");
    revalidatePath(`/matches/${event.match_id}`);
    revalidatePath(`/admin/referee/${event.match_id}`);
    return { success: true, event };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

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
      const placementPoints = placement ? (placementRules[placement] || 0) : 0;
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
        eliminated_at: !up.is_alive
          ? existing?.eliminated_at || new Date().toISOString()
          : undefined,
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
    return { success: false, error: (err as Error).message };
  }
}

export async function submitDisputeAction(
  tournamentId: string,
  matchId: string,
  reason: string,
  description: string,
  evidenceUrl: string
) {
  try {
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
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

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
    return { success: false, error: (err as Error).message };
  }
}

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
    return { success: false, error: (err as Error).message };
  }
}
