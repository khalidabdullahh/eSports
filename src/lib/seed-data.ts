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
} from "@/types";

export const SEED_PROFILES: Profile[] = [];

export const DEMO_TOURNAMENT_ID = "";
export const DEMO_MATCH_ID = "";

export const DEMO_TOURNAMENT: Tournament | null = null;
export const ADDITIONAL_TOURNAMENTS: Tournament[] = [];
export const DEMO_ROOM_CREDENTIAL: RoomCredential | null = null;
export const INITIAL_MATCH_PARTICIPANTS: MatchParticipant[] = [];
export const INITIAL_MATCH_EVENTS: MatchEvent[] = [];
export const INITIAL_LEDGER_ENTRIES: FinancialLedgerEntry[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
