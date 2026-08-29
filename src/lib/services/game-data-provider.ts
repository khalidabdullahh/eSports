import { Match, MatchEvent, MatchParticipant, MatchEventType } from "@/types";

export interface MatchStateSnapshot {
  matchId: string;
  tournamentId: string;
  isLive: boolean;
  participants: MatchParticipant[];
  events: MatchEvent[];
  aliveCount: number;
  eliminatedCount: number;
  totalKills: number;
}

export interface RecordEventPayload {
  matchId: string;
  tournamentId: string;
  eventType: MatchEventType;
  actorParticipantId?: string;
  targetParticipantId?: string;
  quantity?: number;
  metadata?: Record<string, unknown>;
  createdBy: string;
}

export interface GameDataProvider {
  id: string;
  name: string;
  startMatch(matchId: string, authorId: string): Promise<Match>;
  stopMatch(matchId: string, authorId: string): Promise<Match>;
  recordEvent(payload: RecordEventPayload): Promise<{ event: MatchEvent; state: MatchStateSnapshot }>;
  voidEvent(eventId: string, reason: string, authorId: string): Promise<{ voidedEvent: MatchEvent; state: MatchStateSnapshot }>;
  getCurrentState(matchId: string): Promise<MatchStateSnapshot>;
}

/**
 * Manual Referee Game Data Provider
 * Authoritative referee console driving match events with audit trails & voiding
 */
export class ManualRefereeGameDataProvider implements GameDataProvider {
  id = "manual-referee-provider";
  name = "Manual Referee Official Console";

  constructor(
    private readonly stateGetter: (matchId: string) => Promise<MatchStateSnapshot>,
    private readonly eventRecorder: (payload: RecordEventPayload) => Promise<{ event: MatchEvent; state: MatchStateSnapshot }>,
    private readonly eventVoider: (eventId: string, reason: string, authorId: string) => Promise<{ voidedEvent: MatchEvent; state: MatchStateSnapshot }>,
    private readonly matchStarter: (matchId: string, authorId: string) => Promise<Match>,
    private readonly matchStopper: (matchId: string, authorId: string) => Promise<Match>
  ) {}

  async startMatch(matchId: string, authorId: string): Promise<Match> {
    return this.matchStarter(matchId, authorId);
  }

  async stopMatch(matchId: string, authorId: string): Promise<Match> {
    return this.matchStopper(matchId, authorId);
  }

  async recordEvent(payload: RecordEventPayload): Promise<{ event: MatchEvent; state: MatchStateSnapshot }> {
    return this.eventRecorder(payload);
  }

  async voidEvent(eventId: string, reason: string, authorId: string): Promise<{ voidedEvent: MatchEvent; state: MatchStateSnapshot }> {
    return this.eventVoider(eventId, reason, authorId);
  }

  async getCurrentState(matchId: string): Promise<MatchStateSnapshot> {
    return this.stateGetter(matchId);
  }
}
