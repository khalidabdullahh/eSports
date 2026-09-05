export type AppRole =
  | "PLAYER"
  | "SUPPORT"
  | "STREAM_MANAGER"
  | "FINANCE_ADMIN"
  | "RESULT_MANAGER"
  | "REFEREE"
  | "TOURNAMENT_ADMIN"
  | "SUPER_ADMIN"
  | "OWNER";

export type TournamentFormat = "SOLO" | "DUO" | "SQUAD" | "LONE_WOLF" | "CUSTOM";

export type TournamentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "CHECK_IN"
  | "LIVE"
  | "RESULT_SUBMITTED"
  | "VERIFICATION"
  | "DISPUTE_WINDOW"
  | "FINALIZED"
  | "PAYOUT_PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDING"
  | "REFUNDED";

export type RegistrationStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_SUBMITTED"
  | "PAYMENT_VERIFIED"
  | "APPROVED"
  | "CHECKED_IN"
  | "DISQUALIFIED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "SUBMITTED" | "VERIFIED" | "REJECTED" | "REFUNDED";

export type PaymentMethod = "bkash" | "nagad" | "rocket" | "manual";

export type LedgerEntryType =
  | "ENTRY_FEE"
  | "PRIZE_LIABILITY"
  | "PERFORMANCE_REWARD"
  | "REFUND"
  | "PAYOUT"
  | "PLATFORM_FEE"
  | "ADJUSTMENT";

export type LedgerDirection = "CREDIT" | "DEBIT";

export type MatchStatus =
  | "SCHEDULED"
  | "WARMUP"
  | "LIVE"
  | "PAUSED"
  | "ENDED"
  | "CANCELLED";

export type MatchEventType =
  | "PLAYER_KILL"
  | "PLAYER_ELIMINATED"
  | "TEAM_ELIMINATED"
  | "PLACEMENT_CONFIRMED"
  | "SCORE_ADJUSTMENT"
  | "MATCH_STATUS_CHANGE";

export type DisputeStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "CLOSED";

export type BanType =
  | "WARNING"
  | "DISQUALIFICATION"
  | "TOURNAMENT_BAN"
  | "TEMPORARY_BAN"
  | "PERMANENT_BAN";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  free_fire_uid?: string;
  in_game_name?: string;
  role: AppRole;
  country?: string;
  phone_number?: string;
  is_banned: boolean;
  ban_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface PrizeDistributionRule {
  place: number;
  label: string;
  amount_cents: number;
  percentage?: number;
}

export interface PerformanceRewardRule {
  rank: number;
  label: string;
  metric: "kills" | "survival_time" | "damage";
  amount_cents: number;
}

export interface ScoringRules {
  kill_points: number;
  placement_points: Record<number, number>; // e.g. {1: 12, 2: 9, 3: 8, 4: 7...}
  bonuses?: Record<string, number>;
}

export interface Tournament {
  id: string;
  title: string;
  slug: string;
  description: string;
  game_id: string;
  game_name: string;
  mode: string;
  format: TournamentFormat;
  status: TournamentStatus;
  entry_fee_cents: number; // Integer minor units (poisha / cents)
  currency: string; // e.g. BDT
  max_participants: number;
  min_participants: number;
  current_participants_count: number;
  registration_start: string;
  registration_end: string;
  checkin_start: string;
  checkin_end: string;
  match_start: string;
  room_release_time: string;
  dispute_window_minutes: number;
  main_prize_pool_cents: number;
  performance_reward_pool_cents: number;
  prize_distribution_rules: PrizeDistributionRule[];
  performance_reward_rules: PerformanceRewardRule[];
  scoring_rules: ScoringRules;
  roster_size: number;
  substitute_limit: number;
  stream_url?: string;
  stream_provider?: "youtube" | "twitch" | "facebook" | "custom";
  cancellation_policy: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  user_id: string;
  team_id?: string;
  slot_number: number;
  status: RegistrationStatus;
  user?: Profile;
  team?: Team;
  checked_in_at?: string;
  disqualified_reason?: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo_url?: string;
  captain_id: string;
  captain?: Profile;
  members?: TeamMember[];
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "CAPTAIN" | "MEMBER" | "SUBSTITUTE";
  profile?: Profile;
  joined_at: string;
}

export interface Payment {
  id: string;
  tournament_id: string;
  tournament?: {
    id?: string;
    title: string;
    entry_fee_cents?: number;
    currency?: string;
  };
  registration_id: string;
  user_id: string;
  user?: Profile;
  in_game_name?: string;
  free_fire_uid?: string;
  amount_cents: number;
  currency: string;
  payment_method: PaymentMethod;
  transaction_id: string;
  sender_phone?: string;
  evidence_url?: string;
  status: PaymentStatus;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  submitted_at: string;
  created_at?: string;
}

export interface FinancialLedgerEntry {
  id: string;
  tournament_id?: string;
  user_id?: string;
  team_id?: string;
  type: LedgerEntryType;
  direction: LedgerDirection;
  amount_cents: number;
  currency: string;
  reference_type: string;
  reference_id?: string;
  notes?: string;
  created_at: string;
}

export interface RoomCredential {
  id: string;
  tournament_id: string;
  room_id: string;
  room_password: string;
  release_at: string;
}

export interface Match {
  id: string;
  tournament_id: string;
  match_number: number;
  title: string;
  status: MatchStatus;
  started_at?: string;
  ended_at?: string;
  participants: MatchParticipant[];
  created_at: string;
}

export interface MatchParticipant {
  id: string;
  match_id: string;
  registration_id: string;
  user_id?: string;
  team_id?: string;
  participant_name: string;
  avatar_url?: string;
  free_fire_uid?: string;
  is_alive: boolean;
  kills: number;
  placement?: number;
  placement_points: number;
  kill_points: number;
  total_score: number;
  eliminated_at?: string;
  eliminated_by_name?: string;
}

export interface MatchEvent {
  id: string;
  match_id: string;
  tournament_id: string;
  event_type: MatchEventType;
  actor_participant_id?: string;
  actor_name?: string;
  target_participant_id?: string;
  target_name?: string;
  quantity: number;
  metadata?: Record<string, unknown>;
  sequence_number: number;
  correction_of_event_id?: string;
  voided_at?: string;
  voided_by?: string;
  created_by: string;
  created_at: string;
}

export interface MatchResult {
  id: string;
  match_id: string;
  participant_id: string;
  participant_name: string;
  final_placement: number;
  final_kills: number;
  final_points: number;
  evidence_url?: string;
  submitted_by: string;
  verified_by?: string;
  verified_at?: string;
  finalized_at?: string;
}

export interface Dispute {
  id: string;
  tournament_id: string;
  match_id: string;
  reporter_id: string;
  reporter_name?: string;
  target_participant_name?: string;
  reason: string;
  description: string;
  evidence_url: string;
  status: DisputeStatus;
  reviewed_by?: string;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Reward {
  id: string;
  tournament_id: string;
  recipient_user_id?: string;
  recipient_team_id?: string;
  recipient_name: string;
  reward_type: "MAIN_PRIZE" | "PERFORMANCE_BONUS";
  placement?: number;
  amount_cents: number;
  currency: string;
  reason: string;
  calculation_snapshot: Record<string, unknown>;
  is_payout_processed: boolean;
  created_at: string;
}

export interface Payout {
  id: string;
  reward_id: string;
  user_id: string;
  recipient_name: string;
  amount_cents: number;
  currency: string;
  payout_method: string;
  account_number: string;
  transaction_reference?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  processed_by?: string;
  processed_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id?: string;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "REGISTRATION" | "PAYMENT" | "ROOM" | "MATCH" | "REWARD" | "GENERAL";
  link_url?: string;
  is_read: boolean;
  created_at: string;
}
