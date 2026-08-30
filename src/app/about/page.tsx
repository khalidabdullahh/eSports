import Link from "next/link";
import { ArenexLogo } from "@/components/brand/arenex-logo";
import {
  Trophy,
  ShieldCheck,
  Target,
  Users,
  Award,
  Zap,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "About AreNex — Where Players Compete. Legends Rise.",
  description:
    "Learn about the mission, vision, philosophy, and competitive architecture of AreNex — the next-generation digital arena.",
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header / Brand Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center">
          <ArenexLogo variant="stacked" size="xl" showTagline />
        </div>
        <div className="pt-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-crimson">
            Brand Origin & Manifesto
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">
            Arena + Next = AreNex
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-gray-300 mt-3 leading-relaxed font-sans font-medium">
            A digital arena where players compete, prove their skill, build their reputation, and rise toward greatness.
          </p>
        </div>
      </div>

      {/* The Brand Story */}
      <section className="p-8 sm:p-12 rounded-2xl bg-surface-100 border border-surface-border space-y-6 shadow-xl">
        <div className="border-l-2 border-brand-crimson pl-4">
          <span className="text-xs font-mono font-semibold text-brand-crimson uppercase tracking-wider block">
            The Narrative
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase mt-0.5">
            The AreNex Story
          </h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-gray-300 leading-relaxed font-sans">
          <p>
            Gaming has always been competitive. From local cyber cafes to mobile squad scrims, millions of players drop into battlegrounds with the singular ambition to prove their reflex, tactics, and will to win.
          </p>
          <p className="text-slate-900 dark:text-white font-semibold text-lg font-display tracking-wide border-y border-surface-border/80 py-4 my-2">
            &ldquo;But competition needs a stage. A place where skill can be tested. Where performance can be recognized. Where victories matter. Where players can build an authentic name.&rdquo;
          </p>
          <p>
            AreNex is that arena. We believe gaming becomes profoundly more meaningful when every kill, every placement, and every strategic sacrifice is measured accurately, remembered permanently, and rewarded fairly.
          </p>
          <p>
            Every legend begins as an ordinary player. They enter the arena. They compete under strict referee integrity. Their performance builds their reputation. Their victories create recognition. And from the heat of combat, the true champions rise.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-4 border-t border-surface-border/80">
          <div className="p-3.5 rounded-xl bg-surface-200/80 border border-surface-border flex-1 min-w-[200px]">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">50-Word Essence</span>
            <p className="text-xs text-gray-200 mt-1 italic">
              "AreNex is a next-generation competitive esports arena. Built for players who demand fair play, authoritative live telemetry, and verifiable rewards. Here, every match counts toward your competitive legacy. Where players compete. Legends rise."
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Matrix */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-surface-100 border border-surface-border space-y-4">
          <div className="w-10 h-10 rounded-lg bg-brand-crimson/10 text-brand-crimson flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-display text-2xl font-black text-white uppercase">Our Mission</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            To create a trusted, tournament-grade digital ecosystem where competitive gamers can discover tournaments, prove their skills under strict referee integrity, build an immutable reputation, and rise through deterministic performance.
          </p>
          <div className="pt-2 space-y-2 text-xs text-gray-400 font-mono">
            <div className="p-2 rounded bg-surface-200 border border-surface-border">
              <strong className="text-gray-200 block">Short Mission:</strong>
              "To empower competitive gamers through fair, verified, and rewarding tournament competition."
            </div>
            <div className="p-2 rounded bg-surface-200 border border-surface-border">
              <strong className="text-gray-200 block">Investor Vision:</strong>
              "Building the scalable competitive infrastructure layer for mobile and emerging esports markets."
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-surface-100 border border-surface-border space-y-4">
          <div className="w-10 h-10 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-display text-2xl font-black text-white uppercase">Our Vision</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Starting with premier Free Fire Battle Royale, AreNex is architected to scale into a multi-game esports powerhouse supporting solo brackets, squad leagues, verified clan rosters, live streaming telemetry, and regional championships across South Asia and beyond.
          </p>
          <div className="pt-2 space-y-2 text-xs text-gray-400 font-mono">
            <div className="p-2 rounded bg-surface-200 border border-surface-border">
              <strong className="text-gray-200 block">Initial Phase:</strong>
              "Free Fire Solo, Squad, and Lone Wolf cups with automated bKash prize ledgers."
            </div>
            <div className="p-2 rounded bg-surface-200 border border-surface-border">
              <strong className="text-gray-200 block">Multi-Game Horizon:</strong>
              "Expanding into PUBG Mobile, Valorant Mobile, and global title formats."
            </div>
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="p-8 sm:p-12 rounded-2xl bg-surface-100 border border-surface-border space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono text-brand-crimson font-semibold uppercase tracking-widest block mb-1">
            THE CODE OF THE ARENA
          </span>
          <h2 className="font-display text-3xl font-black text-white uppercase">
            The AreNex Philosophy
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-surface-200 border border-surface-border space-y-2">
            <h4 className="font-display text-base font-bold text-white uppercase text-brand-crimsonLight">
              Skill Deserves a Stage
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              True mechanical proficiency, tactical movement, and game sense shouldn't remain buried in unranked matches.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-200 border border-surface-border space-y-2">
            <h4 className="font-display text-base font-bold text-white uppercase text-brand-crimsonLight">
              Competition Builds Reputation
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your name is earned in the heat of combat. We preserve every match event as permanent proof of your track record.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-200 border border-surface-border space-y-2">
            <h4 className="font-display text-base font-bold text-white uppercase text-brand-crimsonLight">
              Performance Must Matter
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Prizes should not be random. Our deterministic reward engine rewards both podium placement and aggressive fraggers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-200 border border-surface-border space-y-2">
            <h4 className="font-display text-base font-bold text-white uppercase text-brand-crimsonLight">
              Every Match Tells a Story
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              From the initial drop to the final 1v1 duel in the shrinking circle, every engagement is tracked in real-time telemetry.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-200 border border-surface-border space-y-2">
            <h4 className="font-display text-base font-bold text-white uppercase text-brand-crimsonLight">
              The Arena Must Be Fair
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Without competitive integrity, victory is meaningless. We enforce zero-tolerance hardware UID bans against cheaters.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-200 border border-surface-border space-y-2">
            <h4 className="font-display text-base font-bold text-white uppercase text-brand-crimsonLight">
              Legends Rise
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Greatness is not handed out. It is taken through consistent performance across rounds, cups, and seasons.
            </p>
          </div>
        </div>
      </section>

      {/* Core Brand Values */}
      <section className="space-y-6">
        <div className="border-l-2 border-brand-gold pl-4">
          <span className="text-xs font-mono font-semibold text-brand-gold uppercase tracking-wider block">
            Core Values
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white uppercase mt-0.5">
            What Drives Every Decision
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border">
            <h4 className="font-display text-lg font-bold text-white uppercase">1. Fairness</h4>
            <p className="text-xs text-gray-400 mt-2">
              Every participant enters under identical tournament rules. Protected room keys are decrypted strictly for verified check-ins.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border">
            <h4 className="font-display text-lg font-bold text-white uppercase">2. Performance</h4>
            <p className="text-xs text-gray-400 mt-2">
              We reward aggressive gameplay and survival mastery through deterministic placement and kill multipliers with zero guesswork.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border">
            <h4 className="font-display text-lg font-bold text-white uppercase">3. Trust</h4>
            <p className="text-xs text-gray-400 mt-2">
              Double-entry append-only accounting in integer minor units ensures entry fees, liabilities, and payouts are always auditable.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border">
            <h4 className="font-display text-lg font-bold text-white uppercase">4. Growth</h4>
            <p className="text-xs text-gray-400 mt-2">
              Amateur players have a clear path to build a verified track record, attract clan sponsors, and climb official power rankings.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border">
            <h4 className="font-display text-lg font-bold text-white uppercase">5. Community</h4>
            <p className="text-xs text-gray-400 mt-2">
              We empower team captains, shoutcasters, and tournament organizers with operational tools and instant broadcast feeds.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-100 border border-surface-border">
            <h4 className="font-display text-lg font-bold text-white uppercase">6. Ambition</h4>
            <p className="text-xs text-gray-400 mt-2">
              We don't settle for casual tournament forms. We build the stadium infrastructure for the future of competitive mobile gaming.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-surface-100 via-surface-elevated to-surface-100 border border-brand-crimson/30 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/15 border border-brand-crimson/30 text-xs font-mono text-brand-crimsonLight">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JOIN THE ARENA TODAY</span>
        </div>
        <h3 className="font-display text-3xl sm:text-4xl font-black text-white uppercase">
          Ready to Prove Your Skill?
        </h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Explore our open tournaments, verify your Free Fire UID, and take your first step toward the leaderboard.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/tournaments"
            className="px-8 py-3 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-brand-crimson/25"
          >
            Enter Tournaments
          </Link>
          <Link
            href="/brand"
            className="px-6 py-3 rounded-lg bg-surface-elevated hover:bg-surface-50 text-gray-200 font-display font-semibold text-sm tracking-wider uppercase border border-surface-border"
          >
            Explore Brand Guidelines
          </Link>
        </div>
      </div>
    </div>
  );
}
