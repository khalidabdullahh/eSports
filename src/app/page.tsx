import Link from "next/link";
import { dataStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TournamentCard } from "@/components/tournament-card";
import {
  Trophy,
  Radio,
  Users,
  ShieldCheck,
  Zap,
  Target,
  Flame,
  ArrowRight,
  TrendingUp,
  Award,
  Swords,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const tournaments = dataStore.getTournaments();
  const liveTournament = tournaments.find((t) => t.status === "LIVE") || tournaments[0];
  const upcomingTournaments = tournaments.filter((t) => t.id !== liveTournament?.id);
  const profiles = dataStore.getProfiles().filter((p) => p.role === "PLAYER");
  const match = dataStore.getMatch("match-night-battle-round-1");
  const matchParticipants = match?.participants || [];

  const topPlayers = [...matchParticipants].sort((a, b) => b.total_score - a.total_score);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-12">
      {/* ============================================================
          HERO SECTION: Featured Live Tournament / High Stakes Banner
      ============================================================ */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-12 sm:pb-16 border-b border-surface-border bg-gradient-to-b from-surface-100 via-surface-200 to-background">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-red-600/10 via-cyan-500/10 to-purple-600/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Platform Pitch */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated/90 border border-surface-border text-xs font-mono text-cyan-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>SEASON 4 CHAMPIONSHIP CIRCUIT</span>
                <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                <span>FREE FIRE OFFICIAL FORMAT</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
                JOIN. COMPETE. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">
                  PERFORM. EARN.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
                Elite tournament arena with authoritative live referee telemetry, protected room credentials, deterministic scoring, and instant verifiable bKash payouts.
              </p>

              {/* Core Platform Stats Row */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
                <div className="p-3 rounded-lg bg-surface-200/90 border border-surface-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
                    Total Disbursed
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-black text-amber-400">
                    ৳485,000+
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-200/90 border border-surface-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
                    Verified Players
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-black text-cyan-400">
                    12,850+
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-200/90 border border-surface-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
                    Fair Play Rate
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-black text-emerald-400">
                    99.8%
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href="/tournaments"
                  className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Explore Tournaments
                </Link>
                <Link
                  href="/live"
                  className="px-5 py-3 rounded-lg bg-surface-elevated hover:bg-surface-50 text-white border border-surface-border text-sm font-medium transition-all flex items-center gap-2"
                >
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  Watch Live Match
                </Link>
              </div>
            </div>

            {/* Right: Featured Live Card */}
            {liveTournament && (
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-surface-100/90 border-2 border-red-500/30 p-6 shadow-2xl shadow-red-500/10 backdrop-blur-md overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-600/90 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-bl-xl flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    FEATURED LIVE NOW
                  </div>

                  <div className="pt-2 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/60">
                        {liveTournament.game_name}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider text-gray-400 bg-surface-200 px-2 py-0.5 rounded border border-surface-border">
                        {liveTournament.format}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      {liveTournament.title}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">{liveTournament.mode}</p>
                  </div>

                  {/* Prize Highlight Box */}
                  <div className="p-4 rounded-xl bg-surface-200/90 border border-surface-border mb-5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400 uppercase font-mono tracking-wider">
                        Total Prize Pool
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-semibold">
                        Guaranteed
                      </span>
                    </div>
                    <div className="text-3xl font-black font-display text-amber-400 flex items-center gap-1.5">
                      <Trophy className="w-6 h-6 text-amber-400" />
                      <span>
                        {formatCurrency(
                          liveTournament.main_prize_pool_cents +
                            liveTournament.performance_reward_pool_cents,
                          liveTournament.currency
                        )}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono mt-1 flex justify-between">
                      <span>
                        Podium:{" "}
                        {formatCurrency(
                          liveTournament.main_prize_pool_cents,
                          liveTournament.currency
                        )}
                      </span>
                      <span>
                        Top Fraggers:{" "}
                        {formatCurrency(
                          liveTournament.performance_reward_pool_cents,
                          liveTournament.currency
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Slot Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-mono text-gray-400 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        Slots Filled
                      </span>
                      <span className="font-bold text-white">
                        {liveTournament.current_participants_count} /{" "}
                        {liveTournament.max_participants} (96%)
                      </span>
                    </div>
                    <ProgressBar
                      current={liveTournament.current_participants_count}
                      max={liveTournament.max_participants}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/live"
                      className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition-all"
                    >
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      Watch Live Match
                    </Link>
                    <Link
                      href={`/tournaments/${liveTournament.slug || liveTournament.id}`}
                      className="w-full py-2.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-gray-200 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1 border border-surface-border transition-all"
                    >
                      <span>Rules & Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: Categories / Formats
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
              Tournament Formats
            </h2>
            <p className="text-xs text-gray-400">Choose your battlefield and squad composition</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/tournaments?format=SOLO"
            className="group p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-cyan-500/40 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300">
              Solo Battle Royale
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Pure individual survival. 50 players, 1 champion. High kill rewards and podium payouts.
            </p>
          </Link>

          <Link
            href="/tournaments?format=SQUAD"
            className="group p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-amber-500/40 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-300">
              Squad Battles (4v4)
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Assemble your roster, assign roles and substitutes, and dominate team coordinates.
            </p>
          </Link>

          <Link
            href="/tournaments?format=LONE_WOLF"
            className="group p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-purple-500/40 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white group-hover:text-purple-300">
              Lone Wolf (1v1)
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Short intense rounds in Iron Cage. Sudden death mechanics with instant bracket updates.
            </p>
          </Link>

          <div className="p-5 rounded-xl bg-surface-100/60 border border-surface-border/60 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-gray-300">Multi-Game Hub</h3>
              <Badge variant="outline" className="text-[10px]">COMING SOON</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PUBG Mobile, Valorant Mobile, and COD Warzone tournament engines coming next.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: Active & Upcoming Tournaments
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
              Featured Tournaments
            </h2>
            <p className="text-xs text-gray-400">Join upcoming events or spectate ongoing matches</p>
          </div>
          <Link
            href="/tournaments"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All ({tournaments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 3: Live Match Leaderboard Preview
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-surface-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="live" pulse>
                  MATCH LIVE
                </Badge>
                <span className="text-xs font-mono text-gray-400">Round 1 • 3 Players Alive</span>
              </div>
              <h3 className="font-display text-2xl font-black text-white uppercase">
                Night Battle — Solo Cup Leaderboard
              </h3>
            </div>
            <Link
              href="/live"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Radio className="w-3.5 h-3.5 text-black" />
              Full Screen Match Room
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-gray-400 border-b border-surface-border pb-2">
                  <th className="pb-3 px-3">#</th>
                  <th className="pb-3 px-3">Warrior</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-center">Kills</th>
                  <th className="pb-3 px-3 text-center">Place Pts</th>
                  <th className="pb-3 px-3 text-right">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {topPlayers.slice(0, 5).map((p, idx) => (
                  <tr
                    key={p.id}
                    className="hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="py-3 px-3 font-bold text-gray-300">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.avatar_url}
                          alt={p.participant_name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-surface-border"
                        />
                        <div>
                          <span className="font-sans font-bold text-white block">
                            {p.participant_name}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            UID: {p.free_fire_uid}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {p.is_alive ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ALIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-800 text-gray-400">
                          ELIMINATED ({p.placement ? `#${p.placement}` : ""})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-400 text-sm">
                      {p.kills}
                    </td>
                    <td className="py-3 px-3 text-center text-gray-300">
                      {p.placement_points}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-cyan-400 text-base">
                      {p.total_score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: How It Works & Fair Play
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
            How The Arena Works
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Zero friction, 100% transparent tournament execution from registration to payout
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <span className="font-display font-black text-lg">01</span>
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Register & Lock Slot
            </h3>
            <p className="text-xs text-gray-400">
              Submit your Free Fire UID and complete entry fee verification via bKash / Nagad.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <span className="font-display font-black text-lg">02</span>
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Check-In & Room Key
            </h3>
            <p className="text-xs text-gray-400">
              Check in 30 minutes before drop. Room ID & Password are automatically decrypted for checked-in warriors.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
              <span className="font-display font-black text-lg">03</span>
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Fight Under Referees
            </h3>
            <p className="text-xs text-gray-400">
              Drop into Bermuda. Referees log verified kills and placements into the public real-time telemetry feed.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <span className="font-display font-black text-lg">04</span>
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Automatic Payouts
            </h3>
            <p className="text-xs text-gray-400">
              After the 15-minute dispute window closes, the reward engine disburses winnings straight to your bKash wallet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
