import Link from "next/link";
import { TournamentService } from "@/lib/services/tournament-service";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TournamentCard } from "@/components/tournament-card";
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
  Plus,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tournaments = await TournamentService.getTournaments();
  const liveTournament = tournaments.find((t) => t.status === "LIVE");
  const upcomingTournaments = tournaments.filter((t) => t.id !== liveTournament?.id);

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
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next-Gen Competitive Esports Ecosystem</span>
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
                  className="px-8 py-3.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-brand-crimson/25 hover:shadow-brand-crimson/40 active:scale-[0.98] flex items-center gap-2.5"
                >
                  <Trophy className="w-4 h-4" />
                  Compete Now
                </Link>
                <Link
                  href="/live"
                  className="px-7 py-3.5 rounded-xl bg-surface-elevated hover:bg-surface-50 text-slate-900 dark:text-gray-200 hover:text-brand-crimson dark:hover:text-white border border-surface-border hover:border-brand-crimson/50 font-display font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2.5 shadow-sm"
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
                    100% Guaranteed
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-200/90 border border-surface-border">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-600 dark:text-gray-400 font-semibold block">
                    Telemetry Engine
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Live Real-Time
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

            {/* Right: Featured Live Arena Card or Ready State */}
            <div className="lg:col-span-5">
              {liveTournament ? (
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
              ) : (
                <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-5 shadow-2xl text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-crimson/10 border border-brand-crimson/30 flex items-center justify-center mx-auto text-brand-crimson shadow-md">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-crimson">
                      Competitive Circuit Initialized
                    </span>
                    <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase">
                      Tournament Arena Ready
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-gray-300 font-sans max-w-sm mx-auto leading-relaxed">
                      Official cups created and published via the Operations Desk will appear here live for instant registration.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/admin/tournaments/new"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-crimson/20 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create First Cup</span>
                    </Link>
                    <Link
                      href="/tournaments"
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-800 dark:text-gray-200 font-display font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Browse Cups
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: THE PLAYER JOURNEY
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-8 rounded-2xl bg-surface-100 border border-surface-border">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono text-brand-crimson tracking-widest uppercase font-semibold block mb-1">
              THE ARENEX PROGRESSION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              From Competitor to Legend
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium">
              Every legend begins as a player. The arena provides the stage for your performance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
            <div className="p-4 rounded-xl bg-surface-200/80 border border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-crimson block mb-1">STAGE 01</span>
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">ENTER</h3>
              <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-1">Discover upcoming cups and lock your slot.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-200/80 border border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-crimson block mb-1">STAGE 02</span>
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">COMPETE</h3>
              <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-1">Drop into the match room with verified opponents.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-200/80 border border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-crimson block mb-1">STAGE 03</span>
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">PERFORM</h3>
              <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-1">Stack placements and high frags on official telemetry.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-200/80 border border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-crimson block mb-1">STAGE 04</span>
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">PROVE</h3>
              <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-1">Build an immutable competitive record.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-200/80 border border-brand-crimson/40 col-span-2 sm:col-span-1 bg-gradient-to-b from-brand-crimson/10 to-transparent">
              <span className="text-xs font-mono font-bold text-brand-gold block mb-1">STAGE 05</span>
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">RISE</h3>
              <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-1">Top power rankings and claim podium prizes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: BATTLE FORMATS
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-brand-crimson uppercase tracking-widest font-semibold block mb-1">
              COMPETITIVE MODES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Choose Your Discipline
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1">
              Official rule sets tailored for individual fraggers, coordinated duos, and strategic 4-man squads.
            </p>
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
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-crimson transition-colors">
              Solo Battle Royale
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
              48–50 players. Pure individual survival and fragger skill. High kill point weight.
            </p>
          </Link>

          <Link
            href="/tournaments?format=SQUAD"
            className="group p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-cyan-500/50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">
              Squad Battle Royale (4v4)
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
              12 full squads. Team positioning, utility execution, and synchronized rotations dominate.
            </p>
          </Link>

          <Link
            href="/tournaments?format=LONE_WOLF"
            className="group p-5 rounded-xl bg-surface-100 hover:bg-surface-elevated border border-surface-border hover:border-purple-500/50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-300 transition-colors">
              Lone Wolf Duel (1v1)
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
              Fast-paced duel matches in Iron Cage. Sudden death mechanics with instant bracket advancement.
            </p>
          </Link>

          <div className="p-5 rounded-xl bg-surface-100/60 border border-surface-border/60 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-slate-800 dark:text-gray-300">Multi-Game Horizon</h3>
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
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Arena Tournaments
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-400">Join upcoming competitive cups or spectate live battles</p>
          </div>
          <Link
            href="/tournaments"
            className="text-xs font-semibold text-brand-crimsonLight hover:text-white flex items-center gap-1 font-display uppercase tracking-wider"
          >
            <span>All Cups ({tournaments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-surface-100 border border-surface-border text-center space-y-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-brand-crimson/10 border border-brand-crimson/30 flex items-center justify-center mx-auto text-brand-crimson">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase">
              No Tournaments Scheduled Yet
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-sans max-w-md mx-auto">
              New cash cups and battle royale tournaments created from the Admin Desk will appear here in real time.
            </p>
            <div className="pt-1">
              <Link
                href="/admin/tournaments/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Launch First Tournament</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </section>

      {/* ============================================================
          SECTION 4: LIVE MATCH TELEMETRY PREVIEW
      ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-surface-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={liveTournament ? "live" : "outline"} pulse={Boolean(liveTournament)}>
                  {liveTournament ? "ARENA TELEMETRY LIVE" : "ARENA ENGINE READY"}
                </Badge>
                <span className="text-xs font-mono text-gray-400">Server-Authoritative Match Engine</span>
              </div>
              <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase">
                {liveTournament ? liveTournament.title : "ARENEX Official Esports Circuit"}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/live"
                className="px-4 py-2 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-brand-crimson/20"
              >
                <Radio className="w-3.5 h-3.5 text-white" />
                <span>Full Broadcast Room</span>
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-xl bg-surface-200/80 border border-surface-border text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20 flex items-center justify-center mx-auto shadow-sm">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white uppercase">
              Live Referee Telemetry & Verified Leaderboards
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-sans max-w-md mx-auto">
              Match kills, survival placements, and official podium distributions are calculated deterministically as live games conclude.
            </p>
            <div className="pt-2">
              <Link
                href="/tournaments"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-slate-800 dark:text-gray-200 transition-all"
              >
                <span>View All Active Tournaments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
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
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            The Three Pillars of ARENEX
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-crimson/10 text-brand-crimson flex items-center justify-center font-black">
              01
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase">
              Authoritative Security
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-sans leading-relaxed">
              Every score, point, and entry fee is calculated server-side. Zero client-side fee tampering or score injection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center font-black">
              02
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase">
              Verified Payouts
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-sans leading-relaxed">
              Immutable double-entry financial ledger records every transaction. Direct payouts to verified bKash, Nagad, and Rocket numbers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black">
              03
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase">
              Fair Play Enforcement
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-sans leading-relaxed">
              Strict identity binding with Free Fire UIDs, referee telemetry auditing, and transparent dispute resolution.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
