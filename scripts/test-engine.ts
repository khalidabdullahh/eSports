import { TournamentStateMachine } from "../src/lib/services/tournament-state-machine";
import { ScoringEngine } from "../src/lib/services/scoring-engine";
import { RewardEngine, ParticipantRewardInput } from "../src/lib/services/reward-engine";
import { DEMO_TOURNAMENT } from "../src/lib/seed-data";
import { dataStore } from "../src/lib/store";

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
  TournamentStateMachine.canTransition("DRAFT", "LIVE").allowed === false,
  "Illegal transition DRAFT -> LIVE is strictly rejected"
);
assert(
  TournamentStateMachine.canTransition("COMPLETED", "DRAFT").allowed === false,
  "Terminal state COMPLETED cannot transition backwards"
);

// ------------------------------------------------------------
// 2. DETERMINISTIC SCORING ENGINE TESTS
// ------------------------------------------------------------
console.log("\nTEST GROUP 2: Deterministic Scoring Engine");
const rules = ScoringEngine.getDefaultRules();
// Standard Free Fire matrix: 1st place = 12pts, 5 kills = 5pts => Total 17pts
const score1 = ScoringEngine.calculateScore({ placement: 1, kills: 5 }, rules);
assert(score1.placementPoints === 12, "1st place correctly awarded 12 placement points");
assert(score1.killPoints === 5, "5 kills correctly calculated as 5 kill points");
assert(score1.totalScore === 17, "Total score computed deterministically as 17 (12 + 5)");

// 4th place = 7pts, 10 kills = 10pts => Total 17pts
const score2 = ScoringEngine.calculateScore({ placement: 4, kills: 10 }, rules);
assert(score2.placementPoints === 7, "4th place correctly awarded 7 placement points");
assert(score2.killPoints === 10, "10 kills correctly calculated as 10 kill points");
assert(score2.totalScore === 17, "Total score computed deterministically as 17 (7 + 10)");

// ------------------------------------------------------------
// 3. DETERMINISTIC REWARD ENGINE TESTS (NIGHT BATTLE SOLO CUP)
// ------------------------------------------------------------
console.log("\nTEST GROUP 3: Reward Engine & Budget Caps (Night Battle Solo Cup)");
const testParticipants: ParticipantRewardInput[] = [
  {
    participantId: "p-alpha",
    userId: "user-alpha",
    participantName: "ALPHA〆KILLER",
    finalPlacement: 1,
    finalKills: 8,
    totalScore: 20,
  },
  {
    participantId: "p-shadow",
    userId: "user-shadow",
    participantName: "SHADOW⚡99",
    finalPlacement: 2,
    finalKills: 6,
    totalScore: 15,
  },
  {
    participantId: "p-viper",
    userId: "user-viper",
    participantName: "VIPER✿QUEEN",
    finalPlacement: 3,
    finalKills: 5,
    totalScore: 13,
  },
  {
    participantId: "p-blaze",
    userId: "user-blaze",
    participantName: "BLAZE亗HEAD",
    finalPlacement: 4,
    finalKills: 11, // High kills, but finished 4th
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
    participantName: "SNIPER_BD",
    finalPlacement: 6,
    finalKills: 4,
    totalScore: 9,
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

const rewardResult = RewardEngine.calculateTournamentRewards(DEMO_TOURNAMENT, testParticipants, {
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

// BLAZE亗HEAD has 11 kills and finished 4th (not on podium), so he must be #1 Top Fragger
assert(
  perfRewards[0].recipientName === "BLAZE亗HEAD",
  "BLAZE亗HEAD (11 kills, 4th place) wins 1st Top Fragger performance reward"
);
assert(
  perfRewards[0].amountCents === 20000,
  "1st Top Fragger receives ৳200 bonus"
);

// GHOST〆OP has 7 kills and finished 5th, so he must be #2 Top Fragger
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
  rewardResult.totalPerformanceAllocatedCents <= DEMO_TOURNAMENT.performance_reward_pool_cents,
  "Performance rewards payout does not exceed configured cap of ৳500"
);

// ------------------------------------------------------------
// 4. PROTECTED ROOM CREDENTIALS GATE
// ------------------------------------------------------------
console.log("\nTEST GROUP 4: Protected Room Credentials Gate");
// Unregistered user should be denied access
const guestAccess = dataStore.getRoomCredential(DEMO_TOURNAMENT.id, "unregistered-user-id");
assert(guestAccess === null, "Unregistered guest denied room credentials");

// Staff bypass allows room access
const staffAccess = dataStore.getRoomCredential(DEMO_TOURNAMENT.id, "user-admin-1");
assert(staffAccess !== null, "Tournament staff can view room credentials");

// ------------------------------------------------------------
// 5. FINANCIAL LEDGER INTEGRITY
// ------------------------------------------------------------
console.log("\nTEST GROUP 5: Financial Ledger & Currency Units");
const ledgerEntries = dataStore.getLedger(DEMO_TOURNAMENT.id);
const allCentsIntegers = ledgerEntries.every((e) => Number.isInteger(e.amount_cents));
assert(allCentsIntegers, "All ledger monetary amounts are stored as integers (cents/poisha)");

console.log("\n============================================================");
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("============================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
