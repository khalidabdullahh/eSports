import {
  Tournament,
  Profile,
  TournamentRegistration,
  Match,
  MatchParticipant,
  MatchEvent,
  FinancialLedgerEntry,
  AuditLog,
  Dispute,
  Reward,
  Payout,
  RoomCredential,
  AppNotification,
  Payment,
  TournamentStatus,
} from "@/types";
import {
  DEMO_TOURNAMENT,
  ADDITIONAL_TOURNAMENTS,
  DEMO_ROOM_CREDENTIAL,
  INITIAL_MATCH_PARTICIPANTS,
  INITIAL_MATCH_EVENTS,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_AUDIT_LOGS,
  SEED_PROFILES,
  DEMO_MATCH_ID,
  DEMO_TOURNAMENT_ID,
} from "./seed-data";
import { ScoringEngine } from "./services/scoring-engine";
import { RewardEngine } from "./services/reward-engine";
import { TournamentStateMachine } from "./services/tournament-state-machine";

class EsportsDataStore {
  private tournaments: Map<string, Tournament> = new Map();
  private profiles: Map<string, Profile> = new Map();
  private registrations: Map<string, TournamentRegistration> = new Map();
  private payments: Map<string, Payment> = new Map();
  private matches: Map<string, Match> = new Map();
  private events: MatchEvent[] = [];
  private ledger: FinancialLedgerEntry[] = [];
  private auditLogs: AuditLog[] = [];
  private disputes: Dispute[] = [];
  private rewards: Reward[] = [];
  private payouts: Payout[] = [];
  private roomCredentials: Map<string, RoomCredential> = new Map();
  private notifications: AppNotification[] = [];
  private currentUserId: string = "user-player-1"; // Default active visitor/player mode

  private seed() {
    // Seed profiles if any
    SEED_PROFILES.forEach((p) => this.profiles.set(p.id, p));

    // Seed tournaments if any
    if (DEMO_TOURNAMENT) {
      this.tournaments.set(DEMO_TOURNAMENT.id, { ...DEMO_TOURNAMENT });
    }
    ADDITIONAL_TOURNAMENTS.forEach((t) => this.tournaments.set(t.id, { ...t }));

    // Empty initial structures for true production clean slate
    this.events = [...INITIAL_MATCH_EVENTS];
    this.ledger = [...INITIAL_LEDGER_ENTRIES];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.notifications = [];
  }

  // --- Auth / User Context ---
  getCurrentUserId(): string {
    return this.currentUserId;
  }

  setCurrentUserId(userId: string) {
    if (this.profiles.has(userId)) {
      this.currentUserId = userId;
    }
  }

  getCurrentUser(): Profile {
    const profile = this.profiles.get(this.currentUserId);
    if (profile) return profile;
    if (SEED_PROFILES.length > 0) return SEED_PROFILES[0];
    return {
      id: "user-visitor",
      username: "warrior",
      display_name: "Competitor",
      avatar_url: "",
      free_fire_uid: "",
      in_game_name: "",
      role: "PLAYER",
      country: "BD",
      is_banned: false,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };
  }

  getProfiles(): Profile[] {
    return Array.from(this.profiles.values());
  }

  getProfile(idOrUsername: string): Profile | undefined {
    return (
      this.profiles.get(idOrUsername) ||
      Array.from(this.profiles.values()).find(
        (p) => p.username.toLowerCase() === idOrUsername.toLowerCase()
      )
    );
  }

  // --- Tournaments ---
  getTournaments(): Tournament[] {
    return Array.from(this.tournaments.values());
  }

  getTournament(idOrSlug: string): Tournament | undefined {
    return (
      this.tournaments.get(idOrSlug) ||
      Array.from(this.tournaments.values()).find((t) => t.slug === idOrSlug)
    );
  }

  addTournament(tournament: Tournament): Tournament {
    this.tournaments.set(tournament.id, tournament);
    this.logAudit({
      action: "TOURNAMENT_CREATED",
      entity_type: "tournament",
      entity_id: tournament.id,
      metadata: { title: tournament.title, entry_fee_cents: tournament.entry_fee_cents },
    });
    return tournament;
  }

  updateTournamentStatus(tournamentId: string, nextStatus: TournamentStatus): Tournament {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    // Enforce strict State Machine validation
    TournamentStateMachine.transition(tournament.status, nextStatus);
    tournament.status = nextStatus;
    tournament.updated_at = new Date().toISOString();
    this.tournaments.set(tournamentId, tournament);

    this.logAudit({
      action: "TOURNAMENT_STATUS_CHANGE",
      entity_type: "tournament",
      entity_id: tournamentId,
      metadata: { previousStatus: tournament.status, newStatus: nextStatus },
    });

    return tournament;
  }

  // --- Registrations ---
  getRegistrations(tournamentId?: string): TournamentRegistration[] {
    const all = Array.from(this.registrations.values());
    if (tournamentId) {
      return all.filter((r) => r.tournament_id === tournamentId);
    }
    return all;
  }

  registerPlayer(tournamentId: string, userId: string): TournamentRegistration {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    if (
      tournament.status !== "REGISTRATION_OPEN" &&
      tournament.status !== "PUBLISHED" &&
      tournament.status !== "LIVE"
    ) {
      throw new Error(`Registration is not open (current status: ${tournament.status})`);
    }

    const existing = Array.from(this.registrations.values()).find(
      (r) => r.tournament_id === tournamentId && r.user_id === userId
    );
    if (existing) {
      return existing;
    }

    const currentCount = Array.from(this.registrations.values()).filter(
      (r) => r.tournament_id === tournamentId
    ).length;

    if (currentCount >= tournament.max_participants) {
      throw new Error("Tournament slots are completely full!");
    }

    const regId = `reg-${Date.now()}`;
    const user = this.profiles.get(userId);
    const reg: TournamentRegistration = {
      id: regId,
      tournament_id: tournamentId,
      user_id: userId,
      user,
      slot_number: currentCount + 1,
      status: tournament.entry_fee_cents > 0 ? "PENDING_PAYMENT" : "APPROVED",
      created_at: new Date().toISOString(),
    };

    this.registrations.set(regId, reg);
    tournament.current_participants_count = currentCount + 1;
    this.tournaments.set(tournamentId, tournament);

    this.logAudit({
      action: "PLAYER_REGISTERED",
      entity_type: "registration",
      entity_id: regId,
      metadata: { tournamentId, userId, slot: reg.slot_number },
    });

    return reg;
  }

  checkInPlayer(registrationId: string): TournamentRegistration {
    const reg = this.registrations.get(registrationId);
    if (!reg) throw new Error("Registration not found");

    if (reg.status !== "APPROVED" && reg.status !== "PAYMENT_VERIFIED") {
      throw new Error("Must have an approved registration before checking in");
    }

    reg.status = "CHECKED_IN";
    reg.checked_in_at = new Date().toISOString();
    this.registrations.set(registrationId, reg);

    this.logAudit({
      action: "PLAYER_CHECKED_IN",
      entity_type: "registration",
      entity_id: registrationId,
      metadata: { userId: reg.user_id, tournamentId: reg.tournament_id },
    });

    return reg;
  }

  // --- Payments & Ledger ---
  getPayments(tournamentId?: string): Payment[] {
    const all = Array.from(this.payments.values());
    if (tournamentId) return all.filter((p) => p.tournament_id === tournamentId);
    return all;
  }

  submitPayment(
    tournamentId: string,
    registrationId: string,
    userId: string,
    amountCents: number,
    paymentMethod: "bkash" | "nagad" | "rocket" | "manual",
    transactionId: string,
    senderPhone?: string
  ): Payment {
    const payId = `pay-${Date.now()}`;
    const pay: Payment = {
      id: payId,
      tournament_id: tournamentId,
      registration_id: registrationId,
      user_id: userId,
      user: this.profiles.get(userId),
      amount_cents: amountCents,
      currency: "BDT",
      payment_method: paymentMethod,
      transaction_id: transactionId,
      sender_phone: senderPhone,
      status: "SUBMITTED",
      submitted_at: new Date().toISOString(),
    };

    this.payments.set(payId, pay);

    const reg = this.registrations.get(registrationId);
    if (reg) {
      reg.status = "PAYMENT_SUBMITTED";
      this.registrations.set(registrationId, reg);
    }

    return pay;
  }

  verifyPayment(paymentId: string, adminId: string): Payment {
    const pay = this.payments.get(paymentId);
    if (!pay) throw new Error("Payment not found");

    pay.status = "VERIFIED";
    pay.verified_by = adminId;
    pay.verified_at = new Date().toISOString();
    this.payments.set(paymentId, pay);

    const reg = this.registrations.get(pay.registration_id);
    if (reg) {
      reg.status = "APPROVED";
      this.registrations.set(pay.registration_id, reg);
    }

    // Append to append-only financial ledger
    this.addLedgerEntry({
      tournament_id: pay.tournament_id,
      user_id: pay.user_id,
      type: "ENTRY_FEE",
      direction: "CREDIT",
      amount_cents: pay.amount_cents,
      currency: pay.currency,
      reference_type: "payment",
      reference_id: pay.id,
      notes: `Verified registration fee for ${pay.user?.display_name || pay.user_id} via ${pay.payment_method.toUpperCase()} (${pay.transaction_id})`,
    });

    this.logAudit({
      action: "PAYMENT_VERIFIED",
      entity_type: "payment",
      entity_id: pay.id,
      metadata: { amountCents: pay.amount_cents, transactionId: pay.transaction_id },
    });

    return pay;
  }

  rejectPayment(paymentId: string, adminId: string, reason: string): Payment {
    const pay = this.payments.get(paymentId);
    if (!pay) throw new Error("Payment not found");

    pay.status = "REJECTED";
    pay.verified_by = adminId;
    pay.rejection_reason = reason;
    this.payments.set(paymentId, pay);

    const reg = this.registrations.get(pay.registration_id);
    if (reg) {
      reg.status = "PENDING_PAYMENT";
      this.registrations.set(pay.registration_id, reg);
    }

    this.logAudit({
      action: "PAYMENT_REJECTED",
      entity_type: "payment",
      entity_id: pay.id,
      metadata: { reason },
    });

    return pay;
  }

  getLedger(tournamentId?: string): FinancialLedgerEntry[] {
    if (tournamentId) {
      return this.ledger.filter((e) => e.tournament_id === tournamentId);
    }
    return this.ledger;
  }

  addLedgerEntry(entry: Omit<FinancialLedgerEntry, "id" | "created_at">): FinancialLedgerEntry {
    const newEntry: FinancialLedgerEntry = {
      ...entry,
      id: `led-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
    };
    this.ledger.unshift(newEntry);
    return newEntry;
  }

  // --- Room Credentials Security ---
  getRoomCredential(tournamentId: string, userId: string): RoomCredential | null {
    const cred = this.roomCredentials.get(tournamentId);
    if (!cred) return null;

    const user = this.profiles.get(userId);
    const isStaff =
      user?.role === "SUPER_ADMIN" ||
      user?.role === "OWNER" ||
      user?.role === "TOURNAMENT_ADMIN" ||
      user?.role === "REFEREE";

    if (isStaff) {
      return cred;
    }

    const reg = Array.from(this.registrations.values()).find(
      (r) => r.tournament_id === tournamentId && r.user_id === userId
    );

    if (!reg || (reg.status !== "CHECKED_IN" && reg.status !== "APPROVED")) {
      return null;
    }

    // Check release time
    const releaseTime = new Date(cred.release_at).getTime();
    if (Date.now() < releaseTime) {
      return null; // Locked until release_at
    }

    // Log access
    this.logAudit({
      action: "ROOM_CREDENTIAL_ACCESSED",
      entity_type: "room_credential",
      entity_id: cred.id,
      metadata: { userId, tournamentId },
    });

    return cred;
  }

  setRoomCredential(
    tournamentId: string,
    roomId: string,
    roomPassword: string,
    releaseAt: string
  ): RoomCredential {
    const cred: RoomCredential = {
      id: `cred-${tournamentId}`,
      tournament_id: tournamentId,
      room_id: roomId,
      room_password: roomPassword,
      release_at: releaseAt,
    };
    this.roomCredentials.set(tournamentId, cred);
    return cred;
  }

  // --- Match & Referee Operations ---
  getMatch(matchId: string): Match | undefined {
    return this.matches.get(matchId);
  }

  getMatchEvents(matchId: string): MatchEvent[] {
    return this.events.filter((e) => e.match_id === matchId && !e.voided_at);
  }

  addMatchEvent(
    matchId: string,
    tournamentId: string,
    eventType: MatchEvent["event_type"],
    actorParticipantId?: string,
    targetParticipantId?: string,
    quantity = 1,
    metadata: Record<string, unknown> = {}
  ): MatchEvent {
    const match = this.matches.get(matchId);
    if (!match) throw new Error("Match not found");

    const actor = match.participants.find((p) => p.id === actorParticipantId);
    const target = match.participants.find((p) => p.id === targetParticipantId);

    const event: MatchEvent = {
      id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      match_id: matchId,
      tournament_id: tournamentId,
      event_type: eventType,
      actor_participant_id: actorParticipantId,
      actor_name: actor?.participant_name,
      target_participant_id: targetParticipantId,
      target_name: target?.participant_name,
      quantity,
      metadata,
      sequence_number: this.events.length + 1,
      created_by: this.currentUserId,
      created_at: new Date().toISOString(),
    };

    // Apply state changes to participants
    if (eventType === "PLAYER_KILL" && actor) {
      actor.kills += quantity;
      actor.kill_points = actor.kills * 1;
      actor.total_score = actor.placement_points + actor.kill_points;
    }

    if (eventType === "PLAYER_ELIMINATED" && target) {
      target.is_alive = false;
      target.eliminated_at = new Date().toISOString();
      if (actor) {
        target.eliminated_by_name = actor.participant_name;
      }
      if (metadata.placement) {
        const place = Number(metadata.placement);
        target.placement = place;
        const tournament = this.tournaments.get(tournamentId);
        const rules = tournament?.scoring_rules || ScoringEngine.getDefaultRules();
        target.placement_points = rules.placement_points[place] || 0;
        target.total_score = target.placement_points + target.kill_points;
      }
    }

    this.events.push(event);
    this.matches.set(matchId, { ...match });

    return event;
  }

  voidMatchEvent(eventId: string, reason: string, authorId: string): MatchEvent {
    const event = this.events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    event.voided_at = new Date().toISOString();
    event.voided_by = authorId;

    // Rollback participant score
    const match = this.matches.get(event.match_id);
    if (match) {
      if (event.event_type === "PLAYER_KILL" && event.actor_participant_id) {
        const actor = match.participants.find((p) => p.id === event.actor_participant_id);
        if (actor) {
          actor.kills = Math.max(0, actor.kills - event.quantity);
          actor.kill_points = actor.kills * 1;
          actor.total_score = actor.placement_points + actor.kill_points;
        }
      }
      if (event.event_type === "PLAYER_ELIMINATED" && event.target_participant_id) {
        const target = match.participants.find((p) => p.id === event.target_participant_id);
        if (target) {
          target.is_alive = true;
          target.eliminated_at = undefined;
          target.placement = undefined;
          target.placement_points = 0;
          target.total_score = target.kill_points;
        }
      }
      this.matches.set(match.id, { ...match });
    }

    this.logAudit({
      action: "MATCH_EVENT_VOIDED",
      entity_type: "match_event",
      entity_id: eventId,
      metadata: { reason, authorId },
    });

    return event;
  }

  // --- Finalize & Rewards Pipeline ---
  finalizeMatchResults(tournamentId: string, matchId: string): { rewards: Reward[]; ledgerEntries: FinancialLedgerEntry[] } {
    const tournament = this.tournaments.get(tournamentId);
    const match = this.matches.get(matchId);
    if (!tournament || !match) throw new Error("Tournament or match not found");

    match.status = "ENDED";
    match.ended_at = new Date().toISOString();
    this.matches.set(matchId, match);

    // Calculate deterministic rewards
    const participantInputs = match.participants.map((p, idx) => ({
      participantId: p.id,
      userId: p.user_id,
      teamId: p.team_id,
      participantName: p.participant_name,
      finalPlacement: p.placement ?? idx + 1,
      finalKills: p.kills,
      totalScore: p.total_score,
    }));

    const result = RewardEngine.calculateTournamentRewards(tournament, participantInputs, {
      excludePodiumFromPerformance: true,
    });

    const createdRewards: Reward[] = [];
    for (const r of result.rewards) {
      const reward: Reward = {
        id: `rew-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        tournament_id: tournamentId,
        recipient_user_id: r.recipientUserId,
        recipient_team_id: r.recipientTeamId,
        recipient_name: r.recipientName,
        reward_type: r.rewardType,
        placement: r.placement,
        amount_cents: r.amountCents,
        currency: tournament.currency,
        reason: r.reason,
        calculation_snapshot: r.calculationSnapshot,
        is_payout_processed: false,
        created_at: new Date().toISOString(),
      };
      this.rewards.push(reward);
      createdRewards.push(reward);

      // Create payout record
      if (r.recipientUserId) {
        this.payouts.push({
          id: `payo-${reward.id}`,
          reward_id: reward.id,
          user_id: r.recipientUserId,
          recipient_name: r.recipientName,
          amount_cents: r.amountCents,
          currency: tournament.currency,
          payout_method: "bkash",
          account_number: "017XXXXXXXX",
          status: "PENDING",
          created_at: new Date().toISOString(),
        });
      }
    }

    tournament.status = "FINALIZED";
    this.tournaments.set(tournamentId, tournament);

    this.logAudit({
      action: "MATCH_FINALIZED_REWARDS_CALCULATED",
      entity_type: "tournament",
      entity_id: tournamentId,
      metadata: {
        totalAllocatedCents: result.totalAllocatedCents,
        rewardsCount: createdRewards.length,
      },
    });

    return { rewards: createdRewards, ledgerEntries: this.ledger };
  }

  getRewards(tournamentId?: string): Reward[] {
    if (tournamentId) return this.rewards.filter((r) => r.tournament_id === tournamentId);
    return this.rewards;
  }

  getPayouts(): Payout[] {
    return this.payouts;
  }

  // --- Disputes ---
  getDisputes(tournamentId?: string): Dispute[] {
    if (tournamentId) return this.disputes.filter((d) => d.tournament_id === tournamentId);
    return this.disputes;
  }

  submitDispute(
    tournamentId: string,
    matchId: string,
    reporterId: string,
    reason: string,
    description: string,
    evidenceUrl: string
  ): Dispute {
    const reporter = this.profiles.get(reporterId);
    const dispute: Dispute = {
      id: `disp-${Date.now()}`,
      tournament_id: tournamentId,
      match_id: matchId,
      reporter_id: reporterId,
      reporter_name: reporter?.display_name || "Player",
      reason,
      description,
      evidence_url: evidenceUrl,
      status: "OPEN",
      created_at: new Date().toISOString(),
    };

    this.disputes.unshift(dispute);

    this.logAudit({
      action: "DISPUTE_SUBMITTED",
      entity_type: "dispute",
      entity_id: dispute.id,
      metadata: { reason, reporterId },
    });

    return dispute;
  }

  resolveDispute(disputeId: string, status: "ACCEPTED" | "REJECTED", notes: string): Dispute {
    const disp = this.disputes.find((d) => d.id === disputeId);
    if (!disp) throw new Error("Dispute not found");

    disp.status = status;
    disp.resolution_notes = notes;
    disp.reviewed_by = this.currentUserId;
    disp.resolved_at = new Date().toISOString();

    this.logAudit({
      action: "DISPUTE_RESOLVED",
      entity_type: "dispute",
      entity_id: disputeId,
      metadata: { status, notes },
    });

    return disp;
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  private logAudit(entry: {
    action: string;
    entity_type: string;
    entity_id: string;
    metadata?: Record<string, unknown>;
  }) {
    const actor = this.getCurrentUser();
    this.auditLogs.unshift({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_user_id: actor.id,
      actor_name: actor.display_name,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      metadata: entry.metadata || {},
      created_at: new Date().toISOString(),
    });
  }

  // --- Notifications ---
  getNotifications(userId: string): AppNotification[] {
    return this.notifications.filter((n) => n.user_id === userId);
  }
}

// Global Singleton Store
const globalForStore = globalThis as unknown as { esportsStore: EsportsDataStore };
export const dataStore = globalForStore.esportsStore || new EsportsDataStore();
if (process.env.NODE_ENV !== "production") globalForStore.esportsStore = dataStore;
