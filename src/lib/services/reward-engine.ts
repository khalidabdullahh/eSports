import { Tournament, MatchParticipant, Reward } from "@/types";

export interface ParticipantRewardInput {
  participantId: string;
  userId?: string;
  teamId?: string;
  participantName: string;
  finalPlacement: number;
  finalKills: number;
  totalScore: number;
}

export interface CalculatedReward {
  recipientUserId?: string;
  recipientTeamId?: string;
  recipientName: string;
  rewardType: "MAIN_PRIZE" | "PERFORMANCE_BONUS";
  placement?: number;
  amountCents: number;
  reason: string;
  calculationSnapshot: Record<string, unknown>;
}

export interface RewardCalculationResult {
  rewards: CalculatedReward[];
  totalMainPrizeAllocatedCents: number;
  totalPerformanceAllocatedCents: number;
  totalAllocatedCents: number;
  podiumExcludedIds: string[];
}

export class RewardEngine {
  /**
   * Deterministically calculates main podium prizes and performance rewards
   * Enforces that:
   * 1. Podium winners are excluded from the performance pool by default
   * 2. Total performance rewards never exceed tournament.performance_reward_pool_cents
   * 3. Total main prize rewards never exceed tournament.main_prize_pool_cents
   * 4. Complete calculation snapshots are produced for permanent audit
   */
  static calculateTournamentRewards(
    tournament: Tournament,
    participants: ParticipantRewardInput[],
    options: { excludePodiumFromPerformance?: boolean } = { excludePodiumFromPerformance: true }
  ): RewardCalculationResult {
    const rewards: CalculatedReward[] = [];
    const excludePodium = options.excludePodiumFromPerformance ?? true;

    // 1. Calculate Main Prize Pool Rewards (Based on Final Placement)
    const sortedByPlacement = [...participants].sort(
      (a, b) => a.finalPlacement - b.finalPlacement
    );

    let totalMainPrizeAllocatedCents = 0;
    const podiumWinners = new Set<string>();

    for (const rule of tournament.prize_distribution_rules) {
      const match = sortedByPlacement.find((p) => p.finalPlacement === rule.place);
      if (match && rule.amount_cents > 0) {
        // Enforce cap against main prize pool budget
        if (totalMainPrizeAllocatedCents + rule.amount_cents <= tournament.main_prize_pool_cents) {
          totalMainPrizeAllocatedCents += rule.amount_cents;
          podiumWinners.add(match.participantId);

          rewards.push({
            recipientUserId: match.userId,
            recipientTeamId: match.teamId,
            recipientName: match.participantName,
            rewardType: "MAIN_PRIZE",
            placement: match.finalPlacement,
            amountCents: rule.amount_cents,
            reason: `${rule.label || `${rule.place}${getOrdinalSuffix(rule.place)} Place`} Podium Winner`,
            calculationSnapshot: {
              ruleType: "MAIN_PRIZE",
              place: rule.place,
              awardedAmountCents: rule.amount_cents,
              configuredPoolCents: tournament.main_prize_pool_cents,
              participantStats: {
                kills: match.finalKills,
                placement: match.finalPlacement,
                score: match.totalScore,
              },
            },
          });
        }
      }
    }

    // 2. Calculate Performance Reward Pool (Based on Kills / Metric, excluding podium winners if configured)
    let totalPerformanceAllocatedCents = 0;

    // Filter candidates for performance rewards
    const performanceCandidates = participants.filter((p) => {
      if (excludePodium && podiumWinners.has(p.participantId)) {
        return false;
      }
      return true;
    });

    // Sort eligible candidates by kills descending, then totalScore descending
    performanceCandidates.sort((a, b) => {
      if (b.finalKills !== a.finalKills) {
        return b.finalKills - a.finalKills;
      }
      return b.totalScore - a.totalScore;
    });

    const perfRules = [...tournament.performance_reward_rules].sort((a, b) => a.rank - b.rank);

    for (let i = 0; i < perfRules.length; i++) {
      const rule = perfRules[i];
      const candidate = performanceCandidates[i];

      if (candidate && rule.amount_cents > 0) {
        // Strict guard: Never exceed configured performance reward pool
        if (
          totalPerformanceAllocatedCents + rule.amount_cents <=
          tournament.performance_reward_pool_cents
        ) {
          totalPerformanceAllocatedCents += rule.amount_cents;

          rewards.push({
            recipientUserId: candidate.userId,
            recipientTeamId: candidate.teamId,
            recipientName: candidate.participantName,
            rewardType: "PERFORMANCE_BONUS",
            placement: candidate.finalPlacement,
            amountCents: rule.amount_cents,
            reason: `${rule.label || `#${rule.rank} Top Fragger`} (${candidate.finalKills} Kills)`,
            calculationSnapshot: {
              ruleType: "PERFORMANCE_BONUS",
              performanceRank: rule.rank,
              metric: rule.metric,
              awardedAmountCents: rule.amount_cents,
              configuredPoolCents: tournament.performance_reward_pool_cents,
              podiumExcluded: excludePodium,
              candidateStats: {
                kills: candidate.finalKills,
                placement: candidate.finalPlacement,
                score: candidate.totalScore,
              },
            },
          });
        }
      }
    }

    return {
      rewards,
      totalMainPrizeAllocatedCents,
      totalPerformanceAllocatedCents,
      totalAllocatedCents: totalMainPrizeAllocatedCents + totalPerformanceAllocatedCents,
      podiumExcludedIds: Array.from(podiumWinners),
    };
  }
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
