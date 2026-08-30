import Link from "next/link";
import { dataStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TournamentCard } from "@/components/tournament-card";
import { ArenexLogo } from "@/components/brand/arenex-logo";
import {
  Trophy,
  Radio,
  Users,
  Target,
  Flame,
  ArrowRight,
  Swords,
  ChevronRight,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const tournaments = dataStore.getTournaments();
  const liveTournament = tournaments.find((t) => t.status === "LIVE") || tournaments[0];
  const upcomingTournaments = tournaments.filter((t) => t.id !== liveTournament?.id);
  const match = dataStore.getMatch("match-night-battle-round-1");
  const matchParticipants = match?.participants || [];

  const topPlayers = [...matchParticipants].sort((a, b) => b.total_score - a.total_score);

  return (
    <div className="flex flex-col gap-12 sm:gap-20 pb-16">
      {/* ============================================================
          HERO SECTION: ARENEX — WHERE PLAYERS COMPETE. LEGENDS RISE.
      ============================================================ */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-surface-border bg-gradient-to-b from-surface-100 via-surface-200 to-background">
        {/* Ambient Crimson Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-r from-brand-crimson/15 via-red-600/10 to-amber-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Brand Hero */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ArenexLogo variant="symbol" size="lg" />
                  <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-[0.2em] text-gray-400 uppercase">
                    ARE<span className="text-brand-crimson">NEX</span>
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-[1.02]">
                  WHERE PLAYERS <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-crimson via-red-400 to-brand-gold">
                    COMPETE.
                  </span>{" "}
                  LEGENDS RISE.
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-700 dark:text-gray-300 max-w-xl leading-relaxed font-sans font-medium">
                Discover tournaments. Compete. Build your competitive record. Rise through verifiable performance in a next-generation digital arena.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/tournaments"
                  className="px-8 py-3.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-brand-crimson/25 hover:shadow-brand-crimson/40 active:scale-[0.98] flex items-center gap-2.5"
                >
                  <Trophy className="w-4 h-4" />
                  Compete Now
                </Link>
                <Link
                  href="/live"
                  className="px-7 py-3.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-slate-900 dark:text-gray-200 hover:text-brand-crimson dark:hover:text-white border border-surface-border hover:border-brand-crimson/50 font-display font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2.5 shadow-sm"
                >
                  <Radio className="w-4 h-4 text-brand-crimson animate-pulse" />
                  Watch Live
                </Link>
              </div>

              {/* Brand Stats Row */}
              <div className="grid grid-cols-3 gap-3.5 pt-4 max-w-lg">
                <div className="p-3.5 rounded-xl bg-surface-200/90 border border-surface-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-gray-400 font-semibold block">
                    Verified Payouts
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-black text-brand-gold">
                    ৳485,000+
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-200/90 border border-surface-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-gray-400 font-semibold block">
                    Active Warriors
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    12,850+
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-200/90 border border-surface-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-gray-400 font-semibold block">
                    Fair Play Index
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-black text-brand-emerald">
                    99.8%
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Featured Live Arena Card */}
            {liveTournament && (
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-surface-100/95 border-2 border-brand-crimson/40 p-6 sm:p-7 shadow-2xl shadow-brand-crimson/15 backdrop-blur-md overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-crimson text-white font-display text-xs font-bold uppercase tracking-wider rounded-bl-xl flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    ARENA LIVE NOW
                  </div>

                  <div className="pt-2 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-brand-crimson font-semibold bg-brand-crimson/10 px-2.5 py-0.5 rounded border border-brand-crimson/30">
                        {liveTournament.game_name}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider text-gray-400 bg-surface-200 px-2 py-0.5 rounded border border-surface-border">
                        {liveTournament.format}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {liveTournament.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium">{liveTournament.mode}</p>
                  </div>

                  {/* Guaranteed Prize Pool Breakdown */}
                  <div className="p-4 rounded-xl bg-surface-200/90 border border-surface-border mb-5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600 dark:text-gray-400 uppercase font-mono tracking-wider font-semibold">
                        Total Arena Pool
                      </span>
                      <span className="text-xs font-mono text-brand-emerald font-bold">
                        Deterministic
                      </span>
                    </div>
                    <div className="text-3xl font-black font-display text-brand-gold flex items-center gap-1.5">
                      <Trophy className="w-6 h-6 text-brand-gold" />
                      <span>
                        {formatCurrency(
                          liveTournament.main_prize_pool_cents +
                            liveTournament.performance_reward_pool_cents,
                          liveTournament.currency
                        )}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-gray-400 font-mono mt-1.5 flex justify-between border-t border-surface-border/50 pt-1.5">
                      <span>
                        Podium:{" "}
                        <strong className="text-slate-900 dark:text-gray-200 font-bold">
                          {formatCurrency(liveTournament.main_prize_pool_cents, liveTournament.currency)}
                        </strong>
                      </span>
                      <span>
                        Top Fraggers:{" "}
                        <strong className="text-slate-900 dark:text-gray-200 font-bold">
                          {formatCurrency(liveTournament.performance_reward_pool_cents, liveTournament.currency)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Slot Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-mono text-slate-600 dark:text-gray-400 mb-1.5 font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-gray-300">
                        <Users className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
                        Arena Capacity
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {liveTournament.current_participants_count} / {liveTournament.max_participants} Warriors
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
                      className="w-full py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-brand-crimson/25 transition-all"
                    >
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      Watch Arena
                    </Link>
                    <Link
                      href={`/tournaments/${liveTournament.slug || liveTournament.id}`}
                      className="w-full py-2.5 rounded-lg bg-surface-elevated hover:bg-surface-50 text-slate-900 dark:text-gray-200 hover:text-brand-crimson dark:hover:text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 border border-surface-border transition-all shadow-sm"
                    >
                      <span>Cup Rules</span>
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
          SECTION 1: THE PLAYER JOURNEY (ENTER -> COMPETE -> PERFORM -> PROVE -> RISE)
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-8 rounded-2xl bg-surface-100 border border-surface-border">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono text-brand-crimson tracking-widest uppercase font-semibold block mb-1">
              THE ARENEX PROGRESSION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              From Competitor to Legend
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Every legend begins as a player. The arena provides the stage for your performance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
            <div className="p-4 rounded-xl bg-surface-200/80 border border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-crimson block mb-1">STAGE 01</span>
              <h3 className="font-display font-black text-lg text-white uppercase">ENTER</h3>
              <p className="text-[11px] text-gray-400 mt-1">Discover upcoming cups and lock your slot.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-200/80 border border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-crimson block mb-1">STAGE 02</span>
              <h3 className="font-display font-black text-lg text-white uppercase">COMPETE</h3>
              <p className="text-[11px] text-gray-400 mt-1">Drop into the match room with verified opponents.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-200/80 border border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-crimson block mb-1">STAGE 03</span>
              <h3 className="font-display font-black text-lg text-white uppercase">PERFORM</h3>
              <p className="text-[11px] text-gray-400 mt-1">Stack placements and high frags on official telemetry.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-200/80 border border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-crimson block mb-1">STAGE 04</span>
              <h3 className="font-display font-black text-lg text-white uppercase">PROVE</h3>
              <p className="text-[11px] text-gray-400 mt-1">Build an immutable competitive record.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-200/80 border border-brand-crimson/40 col-span-2 sm:col-span-1 bg-gradient-to-b from-brand-crimson/10 to-transparent">
              <span className="text-xs font-mono font-bold text-brand-gold block mb-1">STAGE 05</span>
              <h3 className="font-display font-black text-lg text-white uppercase">RISE</h3>
              <p className="text-[11px] text-gray-400 mt-1">Top power rankings and claim podium prizes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: TOURNAMENT FORMATS
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
              Arena Battle Formats
            </h2>
            <p className="text-xs text-gray-400">Choose your combat discipline and roster composition</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/tournaments?format=SOLO"
            className="group p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-brand-crimson/50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-crimson/10 text-brand-crimson flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-crimsonLight transition-colors">
              Solo Battle Royale
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Pure individual survival. 50 warriors, 1 champion. Top fragger pools and podium payouts.
            </p>
          </Link>

          <Link
            href="/tournaments?format=SQUAD"
            className="group p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-brand-gold/50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              Squad Clash (4v4)
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Assemble your clan, designate captains and substitutes, and dominate squad coordinates.
            </p>
          </Link>

          <Link
            href="/tournaments?format=LONE_WOLF"
            className="group p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-purple-500/50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              Lone Wolf Duel (1v1)
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Fast-paced duel matches in Iron Cage. Sudden death mechanics with instant bracket advancement.
            </p>
          </Link>

          <div className="p-5 rounded-xl bg-surface-100/60 border border-surface-border/60 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-gray-300">Multi-Game Horizon</h3>
              <Badge variant="outline" className="text-[10px]">COMING NEXT</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Scalable tournament engines for PUBG Mobile, Valorant Mobile, and COD Warzone in development.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: ACTIVE & UPCOMING TOURNAMENTS
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
              Arena Tournaments
            </h2>
            <p className="text-xs text-gray-400">Join upcoming competitive cups or spectate live battles</p>
          </div>
          <Link
            href="/tournaments"
            className="text-xs font-semibold text-brand-crimsonLight hover:text-white flex items-center gap-1 font-display uppercase tracking-wider"
          >
            <span>All Cups ({tournaments.length})</span>
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
          SECTION 4: LIVE MATCH TELEMETRY PREVIEW
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-surface-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="live" pulse>
                  ARENA TELEMETRY
                </Badge>
                <span className="text-xs font-mono text-gray-400">Round 1 • 3 Players Alive</span>
              </div>
              <h3 className="font-display text-2xl font-black text-white uppercase">
                Night Battle — Solo Cup Leaderboard
              </h3>
            </div>
            <Link
              href="/live"
              className="px-4 py-2 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-brand-crimson/20"
            >
              <Radio className="w-3.5 h-3.5 text-white" />
              Full Broadcast Room
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
                  <th className="pb-3 px-3 text-center">Placement</th>
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
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                          IN COMBAT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-200 text-gray-400">
                          ELIMINATED ({p.placement ? `#${p.placement}` : ""})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-brand-crimson text-sm">
                      {p.kills}
                    </td>
                    <td className="py-3 px-3 text-center text-gray-300">
                      {p.placement_points}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-brand-gold text-base">
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
          SECTION 5: BRAND VALUES & INTEGRITY PILLARS
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono text-brand-crimson uppercase tracking-widest font-semibold block mb-1">
            BUILT ON INTEGRITY
          </span>
          <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
            The Arena Standards
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Gaming becomes meaningful when performance is measured, remembered, and rewarded fairly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-crimson/10 text-brand-crimson flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              1. Competition & Fairness
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every competitor drops under identical constraints. Zero tolerance for emulators or hacks, backed by device UID blacklists.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              2. Deterministic Rewards
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Guaranteed podium pools and ring-fenced top-fragger bonuses calculated by deterministic formulas with zero human bias.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              3. Authoritative Telemetry
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Live match events and eliminations verified by official referees before real-time publication to killfeeds and ledgers.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface-100 border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              4. Community & Reputation
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Track your lifetime tournament record, showcase clan rosters, and climb regional power leaderboards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
