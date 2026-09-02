import { TournamentStateMachine } from "../src/lib/services/tournament-state-machine";
import { ScoringEngine } from "../src/lib/services/scoring-engine";
import { RewardEngine, ParticipantRewardInput } from "../src/lib/services/reward-engine";
import { Tournament } from "../src/types";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log("============================================================");
console.log("RUNNING SUITE: ESPORTS PLATFORM CORE ENGINE TESTS");
console.log("============================================================\n");

// ------------------------------------------------------------
// 1. TOURNAMENT STATE MACHINE TESTS
// ------------------------------------------------------------
console.log("TEST GROUP 1: Tournament State Machine & Illegal Transitions");
assert(
  TournamentStateMachine.canTransition("DRAFT", "PUBLISHED").allowed === true,
  "Can transition from DRAFT to PUBLISHED"
);
assert(
  TournamentStateMachine.canTransition("PUBLISHED", "REGISTRATION_OPEN").allowed === true,
  "Can transition from PUBLISHED to REGISTRATION_OPEN"
);
assert(
  TournamentStateMachine.canTransition("REGISTRATION_OPEN", "CHECK_IN").allowed === false,
  "Cannot jump from REGISTRATION_OPEN directly to CHECK_IN without REGISTRATION_CLOSED"
);
assert(
  TournamentStateMachine.canTransition("CHECK_IN", "LIVE").allowed === true,
  "Can transition from CHECK_IN to LIVE"
);
assert(
  TournamentStateMachine.canTransition("LIVE", "COMPLETED").allowed === true,
  "Can transition from LIVE to COMPLETED"
);
assert(
  TournamentStateMachine.canTransition("COMPLETED", "LIVE").allowed === false,
  "Cannot reopen completed tournament to LIVE"
);

// ------------------------------------------------------------
// 2. DETERMINISTIC SCORING ENGINE TESTS
// ------------------------------------------------------------
console.log("\nTEST GROUP 2: Deterministic Scoring Engine (Free Fire BR Bermuda)");
const scoringRules = {
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

const winnerScore = ScoringEngine.calculateScore({ kills: 8, placement: 1 }, scoringRules);
assert(winnerScore.killPoints === 8, "8 kills = 8 kill points");
assert(winnerScore.placementPoints === 12, "1st place = 12 placement points");
assert(winnerScore.totalScore === 20, "1st place with 8 kills = 20 total score (12 + 8)");

const runnerUpScore = ScoringEngine.calculateScore({ kills: 5, placement: 2 }, scoringRules);
assert(runnerUpScore.placementPoints === 9, "2nd place = 9 placement points");
assert(runnerUpScore.totalScore === 14, "2nd place with 5 kills = 14 total score (9 + 5)");

const unplacedFraggerScore = ScoringEngine.calculateScore({ kills: 12, placement: 25 }, scoringRules);
assert(unplacedFraggerScore.placementPoints === 0, "25th place = 0 placement points");
assert(unplacedFraggerScore.totalScore === 12, "25th place with 12 kills = 12 total score (0 + 12)");

// ------------------------------------------------------------
// 3. REWARD & PRIZE CALCULATION ENGINE TESTS
// ------------------------------------------------------------
console.log("\nTEST GROUP 3: Reward Calculation & Anti-Double-Dipping Engine");

const TEST_TOURNAMENT: Tournament = {
  id: "test-tourn-1",
  title: "Test Cup",
  slug: "test-cup",
  description: "Test cup",
  game_id: "free-fire",
  game_name: "Free Fire",
  mode: "Solo",
  format: "SOLO",
  status: "COMPLETED",
  entry_fee_cents: 5000,
  currency: "BDT",
  max_participants: 50,
  min_participants: 2,
  current_participants_count: 7,
  registration_start: new Date().toISOString(),
  registration_end: new Date().toISOString(),
  checkin_start: new Date().toISOString(),
  checkin_end: new Date().toISOString(),
  match_start: new Date().toISOString(),
  room_release_time: new Date().toISOString(),
  dispute_window_minutes: 15,
  main_prize_pool_cents: 100000,
  performance_reward_pool_cents: 50000,
  prize_distribution_rules: [
    { place: 1, label: "1st Place Champion", amount_cents: 50000, percentage: 50 },
    { place: 2, label: "2nd Place Runner-Up", amount_cents: 30000, percentage: 30 },
    { place: 3, label: "3rd Place 2nd Runner-Up", amount_cents: 20000, percentage: 20 },
  ],
  performance_reward_rules: [
    { rank: 1, label: "Top Fragger MVP", metric: "kills", amount_cents: 20000 },
    { rank: 2, label: "2nd Best Fragger", metric: "kills", amount_cents: 15000 },
    { rank: 3, label: "3rd Best Fragger", metric: "kills", amount_cents: 10000 },
    { rank: 4, label: "4th Best Fragger", metric: "kills", amount_cents: 5000 },
  ],
  scoring_rules: scoringRules,
  roster_size: 1,
  substitute_limit: 0,
  cancellation_policy: "Standard refund",
  created_by: "test-admin",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const testParticipants: ParticipantRewardInput[] = [
  {
    participantId: "p-alpha",
    userId: "user-alpha",
    participantName: "ALPHA〆KILLER",
    finalPlacement: 1,
    finalKills: 7,
    totalScore: 19,
  },
  {
    participantId: "p-shadow",
    userId: "user-shadow",
    participantName: "SHADOW⚡99",
    finalPlacement: 2,
    finalKills: 5,
    totalScore: 14,
  },
  {
    participantId: "p-viper",
    userId: "user-viper",
    participantName: "VIPER✿QUEEN",
    finalPlacement: 3,
    finalKills: 4,
    totalScore: 12,
  },
  {
    participantId: "p-blaze",
    userId: "user-blaze",
    participantName: "BLAZE亗HEAD",
    finalPlacement: 4,
    finalKills: 11,
    totalScore: 18,
  },
  {
    participantId: "p-ghost",
    userId: "user-ghost",
    participantName: "GHOST〆OP",
    finalPlacement: 5,
    finalKills: 7,
    totalScore: 13,
  },
  {
    participantId: "p-sniper",
    userId: "user-sniper",
    participantName: "SNIPER_GOD",
    finalPlacement: 6,
    finalKills: 5,
    totalScore: 10,
  },
  {
    participantId: "p-reaper",
    userId: "user-reaper",
    participantName: "REAPER_FF",
    finalPlacement: 7,
    finalKills: 3,
    totalScore: 7,
  },
];

const rewardResult = RewardEngine.calculateTournamentRewards(TEST_TOURNAMENT, testParticipants, {
  excludePodiumFromPerformance: true,
});

// Check Main Podium Prizes
const p1Reward = rewardResult.rewards.find((r) => r.placement === 1 && r.rewardType === "MAIN_PRIZE");
const p2Reward = rewardResult.rewards.find((r) => r.placement === 2 && r.rewardType === "MAIN_PRIZE");
const p3Reward = rewardResult.rewards.find((r) => r.placement === 3 && r.rewardType === "MAIN_PRIZE");

assert(p1Reward?.amountCents === 50000, "1st place champion awarded exactly ৳500 (50,000 cents)");
assert(p2Reward?.amountCents === 30000, "2nd place runner-up awarded exactly ৳300 (30,000 cents)");
assert(p3Reward?.amountCents === 20000, "3rd place 2nd runner-up awarded exactly ৳200 (20,000 cents)");
assert(
  rewardResult.totalMainPrizeAllocatedCents === 100000,
  "Total main prize allocated exactly matches configured budget ৳1,000"
);

// Check Performance Rewards (Top Fraggers) - Podium winners must be excluded!
const perfRewards = rewardResult.rewards.filter((r) => r.rewardType === "PERFORMANCE_BONUS");

assert(
  perfRewards.length === 4,
  "4 performance bonuses awarded according to performance_reward_rules"
);

assert(
  perfRewards[0].recipientName === "BLAZE亗HEAD",
  "BLAZE亗HEAD (11 kills, 4th place) wins 1st Top Fragger performance reward"
);
assert(
  perfRewards[0].amountCents === 20000,
  "1st Top Fragger receives ৳200 bonus"
);

assert(
  perfRewards[1].recipientName === "GHOST〆OP",
  "GHOST〆OP (7 kills, 5th place) wins 2nd Top Fragger performance reward"
);
assert(
  perfRewards[1].amountCents === 15000,
  "2nd Top Fragger receives ৳150 bonus"
);

// Ensure Podium Winners (ALPHA, SHADOW, VIPER) were NOT given performance bonuses
const podiumUserIds = ["p-alpha", "p-shadow", "p-viper"];
const podiumGotPerfBonus = perfRewards.some((r) =>
  testParticipants.some((p) => p.userId === r.recipientUserId && podiumUserIds.includes(p.participantId))
);
assert(
  !podiumGotPerfBonus,
  "Podium winners (1st, 2nd, 3rd) are strictly excluded from performance pool bonuses"
);

assert(
  rewardResult.totalPerformanceAllocatedCents <= TEST_TOURNAMENT.performance_reward_pool_cents,
  "Performance rewards payout does not exceed configured cap of ৳500"
);

console.log("\n============================================================");
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("============================================================\n");

if (failed > 0) {
  process.exit(1);
}
