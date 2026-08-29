import { ScoringRules } from "@/types";

export interface ParticipantScoreInput {
  kills: number;
  placement?: number;
  survivalSeconds?: number;
  penalties?: number;
  bonusPoints?: number;
}

export interface ParticipantScoreBreakdown {
  placementPoints: number;
  killPoints: number;
  bonusPoints: number;
  penalties: number;
  totalScore: number;
}

export class ScoringEngine {
  /**
   * Deterministically calculates placement points, kill points, and total score
   */
  static calculateScore(
    input: ParticipantScoreInput,
    rules: ScoringRules
  ): ParticipantScoreBreakdown {
    const killMultiplier = rules.kill_points ?? 1;
    const killPoints = Math.max(0, input.kills) * killMultiplier;

    let placementPoints = 0;
    if (input.placement && rules.placement_points) {
      placementPoints = rules.placement_points[input.placement] ?? 0;
    }

    const bonusPoints = input.bonusPoints ?? 0;
    const penalties = input.penalties ?? 0;
    const totalScore = Math.max(0, placementPoints + killPoints + bonusPoints - penalties);

    return {
      placementPoints,
      killPoints,
      bonusPoints,
      penalties,
      totalScore,
    };
  }

  /**
   * Default standard Free Fire competitive scoring matrix
   * 1st: 12pts, 2nd: 9pts, 3rd: 8pts, 4th: 7pts, 5th: 6pts, 6th: 5pts, 7th: 4pts, 8th: 3pts, 9th: 2pts, 10th: 1pt
   * Kills: 1pt per kill
   */
  static getDefaultRules(): ScoringRules {
    return {
      kill_points: 1,
      placement_points: {
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
    };
  }
}
