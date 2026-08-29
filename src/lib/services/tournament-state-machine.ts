import { TournamentStatus } from "@/types";

export interface StateTransitionResult {
  allowed: boolean;
  reason?: string;
}

const ALLOWED_TRANSITIONS: Record<TournamentStatus, TournamentStatus[]> = {
  DRAFT: ["PUBLISHED", "CANCELLED"],
  PUBLISHED: ["REGISTRATION_OPEN", "CANCELLED"],
  REGISTRATION_OPEN: ["REGISTRATION_CLOSED", "CANCELLED"],
  REGISTRATION_CLOSED: ["CHECK_IN", "CANCELLED"],
  CHECK_IN: ["LIVE", "CANCELLED"],
  LIVE: ["RESULT_SUBMITTED", "CANCELLED"],
  RESULT_SUBMITTED: ["VERIFICATION", "CANCELLED"],
  VERIFICATION: ["DISPUTE_WINDOW", "RESULT_SUBMITTED"],
  DISPUTE_WINDOW: ["FINALIZED", "VERIFICATION"],
  FINALIZED: ["PAYOUT_PROCESSING"],
  PAYOUT_PROCESSING: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: ["REFUNDING"],
  REFUNDING: ["REFUNDED"],
  REFUNDED: [],
};

export class TournamentStateMachine {
  /**
   * Check whether a transition from fromStatus to toStatus is valid
   */
  static canTransition(fromStatus: TournamentStatus, toStatus: TournamentStatus): StateTransitionResult {
    if (fromStatus === toStatus) {
      return { allowed: true };
    }

    const nextAllowed = ALLOWED_TRANSITIONS[fromStatus] || [];
    if (!nextAllowed.includes(toStatus)) {
      return {
        allowed: false,
        reason: `Invalid transition from "${fromStatus}" to "${toStatus}". Allowed targets: ${nextAllowed.join(", ") || "None"}`,
      };
    }

    return { allowed: true };
  }

  /**
   * Validate and return next state or throw error
   */
  static transition(fromStatus: TournamentStatus, toStatus: TournamentStatus): TournamentStatus {
    const result = this.canTransition(fromStatus, toStatus);
    if (!result.allowed) {
      throw new Error(result.reason || "Illegal tournament state transition");
    }
    return toStatus;
  }
}
