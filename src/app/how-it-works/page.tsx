import React from "react";
import Link from "next/link";
import {
  Trophy,
  ShieldCheck,
  Zap,
  Lock,
  Award,
  Crosshair,
  FileCheck,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle,
  Users,
  Swords,
  Flame,
} from "lucide-react";
import { VideoTutorialPlayer } from "@/components/video-tutorial-player";

export const metadata = {
  title: "How It Works & Tournament Architecture — ARENEX",
  description:
    "Explore the complete 5-step tournament lifecycle, deterministic scoring matrices, room key encryption gates, and automated prize ledger on AreNex.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Slot Hold & Instant Carrier Payment",
      tag: "STEP 1: REGISTRATION",
      icon: DollarSign,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      description:
        "When you select an open tournament and click 'Register', an atomic slot is reserved in the PostgreSQL database. You submit the entry fee via bKash, Nagad, or Rocket and provide your Transaction ID (TrxID). Our automated ledger cross-checks the carrier receipt against double-entry records and updates your registration status to APPROVED.",
      highlights: [
        "Atomic slot reservation with race-condition protection",
        "Instant Carrier Verification (bKash / Nagad / Rocket)",
        "Immutable transaction ledger in integer minor units (paisa)",
      ],
    },
    {
      step: "02",
      title: "Mandatory Check-In & Cryptographic Room Gate",
      tag: "STEP 2: CHECK-IN GATE",
      icon: Lock,
      color: "text-brand-gold bg-brand-gold/10 border-brand-gold/20",
      description:
        "30 minutes before drop time, the Check-In window opens. Players must click 'Confirm Check-In' on their tournament dashboard to verify attendance. Exactly 15 minutes before the match starts, custom Room ID and Password credentials are decrypted strictly on the server and revealed exclusively to checked-in participants.",
      highlights: [
        "30-minute pre-match check-in window",
        "Zero credential leak — server-side decryption gate",
        "Automatic forfeiture for unconfirmed slots to waiting reserves",
      ],
    },
    {
      step: "03",
      title: "Live Referee Telemetry & Match Combat",
      tag: "STEP 3: COMBAT & STREAM",
      icon: Zap,
      color: "text-brand-crimson bg-brand-crimson/10 border-brand-crimson/20",
      description:
        "Players join the custom in-game lobby using their verified Free Fire UID. Certified match referees spectate the custom room and record frags, survival placements, and zone eliminations in real time using the high-speed touch Referee Console. Telemetry streams instantly to the public live broadcast.",
      highlights: [
        "Certified referee live spectator logging",
        "Sub-second WebSocket event telemetry to public stream",
        "Zero trust on client-side game clients — server authoritative",
      ],
    },
    {
      step: "04",
      title: "15-Minute Transparent Dispute Window",
      tag: "STEP 4: EVIDENCE REVIEW",
      icon: FileCheck,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      description:
        "Once match results are compiled, a 15-minute dispute window opens. If any player believes their elimination count or placement was recorded inaccurately, they can submit unedited end-game screenshot or video proof directly to the Dispute Resolution Desk for instant referee review.",
      highlights: [
        "Formal 15-minute dispute window post-match",
        "Unedited screenshot and video proof submission",
        "Direct referee audit log inspection before finalization",
      ],
    },
    {
      step: "05",
      title: "Deterministic Reward Engine & Payouts",
      tag: "STEP 5: PRIZE DISBURSEMENT",
      icon: Trophy,
      color: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20",
      description:
        "Upon dispute window closure, the tournament transitions to Finalized. The mathematical reward engine executes, distributing guaranteed podium rewards (1st, 2nd, 3rd) and top-fragger bonuses into the player's wallet balance. Payouts are queued for immediate disbursement to their registered bKash/Nagad number.",
      highlights: [
        "Deterministic point-to-prize mathematical formula",
        "Dedicated top-fragger bonus distribution",
        "Instant disbursement to verified mobile wallet numbers",
      ],
    },
  ];

  const formats = [
    {
      title: "Solo Battle Royale",
      badge: "50 Players • 1 Winner",
      icon: Flame,
      color: "text-brand-crimson",
      description:
        "Pure individual survival. 50 solo warriors drop into Bermuda or Purgatory. High kill rewards and massive Booyah points.",
      rule: "Solo lobby, no teaming, individual placement scoring.",
      link: "/tournaments?format=SOLO",
    },
    {
      title: "Squad Clash",
      badge: "4v4 • Tactical Warfare",
      icon: Users,
      color: "text-brand-gold",
      description:
        "Organized clan combat. 4 starters + 1 substitute per roster. Roster snapshots are locked upon registration close.",
      rule: "Coordinated team points, cumulative squad frags.",
      link: "/tournaments?format=SQUAD",
    },
    {
      title: "Lone Wolf Duel",
      badge: "1v1 • Mechanical Mastery",
      icon: Swords,
      color: "text-brand-emerald",
      description:
        "Head-to-head close quarters combat. Standard competitive weapon rules, single elimination bracket rounds.",
      rule: "Round-based duel, reflex and aim supremacy.",
      link: "/tournaments?format=LONE_WOLF",
    },
  ];

  const faqs = [
    {
      q: "How do I know my Free Fire UID is verified?",
      a: "During onboarding or on your Profile page, you register your exact Free Fire UID and IGN. Our system checks that this UID matches the player entering the room lobby.",
    },
    {
      q: "When do I get the Room ID and Password?",
      a: "Room credentials are decrypted and revealed on the tournament's Match Room page exactly 15 minutes before the scheduled start time, provided you have checked in.",
    },
    {
      q: "How are prizes calculated?",
      a: "Prizes follow the published prize matrix for the tournament. The 1st, 2nd, and 3rd place podium winners receive guaranteed cash distributions, and the player with the most kills receives the Top Fragger bonus.",
    },
    {
      q: "How long does payout take after winning?",
      a: "Once the 15-minute dispute window closes, the reward engine calculates distributions immediately, and payouts to your verified bKash or Nagad wallet are processed by the finance desk.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 sm:space-y-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-crimson transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-gray-200 font-bold">How It Works</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-crimson/10 blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-xs font-mono text-brand-crimson font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SERVER-AUTHORITATIVE ARCHITECTURE</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          How AreNex Tournaments Work
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 font-sans max-w-3xl leading-relaxed font-medium">
          A transparent, 5-stage tournament lifecycle engineered for competitive mobile esports — from slot reservation and room key decryption to live referee telemetry and instant financial disbursements.
        </p>
      </div>

      {/* Interactive Bangla Video Tutorial Simulator */}
      <section className="space-y-4">
        <div className="border-l-2 border-cyan-400 pl-4">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider block">
            INTERACTIVE VIDEO WALKTHROUGH & AUDIO GUIDE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase mt-0.5">
            ভিডিও টিউটোরিয়াল ও সিমুলেটর
          </h2>
        </div>

        <VideoTutorialPlayer />
      </section>

      {/* 5-Step Operational Pipeline */}
      <section className="space-y-6">
        <div className="border-l-2 border-brand-crimson pl-4">
          <span className="text-xs font-mono font-semibold text-brand-crimson uppercase tracking-wider block">
            THE TOURNAMENT LIFECYCLE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase mt-0.5">
            5-Stage Match Pipeline
          </h2>
        </div>

        <div className="space-y-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-surface-100 border border-surface-border space-y-4 shadow-lg hover:border-surface-borderLight transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-200 border border-surface-border flex items-center justify-center font-display font-black text-base text-brand-crimson shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block">
                        {s.tag}
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white uppercase">
                        {s.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-center px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${s.color}`}
                  >
                    Phase {s.step}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 font-sans leading-relaxed font-medium">
                  {s.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {s.highlights.map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-2.5 rounded-lg bg-surface-200/80 border border-surface-border text-xs text-slate-700 dark:text-gray-300 font-sans flex items-center gap-2 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Deterministic Scoring Matrix */}
      <section className="p-6 sm:p-8 rounded-2xl bg-surface-100 border border-surface-border space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-semibold text-brand-gold uppercase tracking-wider block">
              OFFICIAL POINT SYSTEM
            </span>
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase mt-0.5">
              Battle Royale Scoring Matrix
            </h2>
          </div>
          <Link
            href="/rules"
            className="text-xs font-mono font-bold text-brand-crimson hover:underline flex items-center gap-1"
          >
            <span>Read Full Rulebook</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">
          <div className="p-3.5 rounded-xl bg-surface-200 border border-brand-gold/30 space-y-1">
            <span className="text-amber-400 block font-bold text-base">#1: 12 Pts</span>
            <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold">Booyah!</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-200 border border-surface-border space-y-1">
            <span className="text-slate-800 dark:text-gray-200 block font-bold text-base">#2: 9 Pts</span>
            <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold">2nd Place</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-200 border border-surface-border space-y-1">
            <span className="text-slate-800 dark:text-gray-200 block font-bold text-base">#3: 8 Pts</span>
            <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold">3rd Place</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-200 border border-surface-border space-y-1">
            <span className="text-slate-800 dark:text-gray-200 block font-bold text-base">#4: 7 Pts</span>
            <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold">4th Place</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-200 border border-brand-crimson/30 space-y-1">
            <span className="text-brand-crimson block font-bold text-base">Kill: +1 Pt</span>
            <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold">Per Frag</span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-mono pt-2 border-t border-surface-border">
          <div className="p-2 rounded bg-surface-200 text-slate-700 dark:text-gray-300">#5: 6 Pts</div>
          <div className="p-2 rounded bg-surface-200 text-slate-700 dark:text-gray-300">#6: 5 Pts</div>
          <div className="p-2 rounded bg-surface-200 text-slate-700 dark:text-gray-300">#7: 4 Pts</div>
          <div className="p-2 rounded bg-surface-200 text-slate-700 dark:text-gray-300">#8: 3 Pts</div>
          <div className="p-2 rounded bg-surface-200 text-slate-700 dark:text-gray-300">#9: 2 Pts</div>
          <div className="p-2 rounded bg-surface-200 text-slate-700 dark:text-gray-300">#10: 1 Pt</div>
        </div>
      </section>

      {/* Battle Formats Matrix */}
      <section className="space-y-6">
        <div className="border-l-2 border-brand-emerald pl-4">
          <span className="text-xs font-mono font-semibold text-brand-emerald uppercase tracking-wider block">
            GAME MODES & BRACKETS
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase mt-0.5">
            Supported Battle Formats
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formats.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-4 shadow-lg flex flex-col justify-between hover:border-brand-crimson/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-surface-200 text-brand-crimson border border-surface-border">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase bg-surface-200 border border-surface-border px-2 py-0.5 rounded text-slate-700 dark:text-gray-300">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase">
                    {f.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-gray-300 font-sans leading-relaxed font-medium">
                    {f.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400">{f.rule}</span>
                  <Link
                    href={f.link}
                    className="text-xs font-mono font-bold text-brand-crimson hover:text-brand-crimsonDark flex items-center gap-1"
                  >
                    <span>Browse</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="border-l-2 border-brand-gold pl-4">
          <span className="text-xs font-mono font-semibold text-brand-gold uppercase tracking-wider block">
            PLAYER KNOWLEDGE BASE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase mt-0.5">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-2 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-gold shrink-0" />
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white uppercase">
                  {faq.q}
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-gray-300 font-sans leading-relaxed pl-6 font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Action Footer */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-surface-100 via-surface-elevated to-surface-100 border border-brand-crimson/30 text-center space-y-5 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/15 border border-brand-crimson/30 text-xs font-mono text-brand-crimson font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ENTER THE ARENA</span>
        </div>
        <h3 className="font-display text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase">
          Ready to Test Your Skills?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 max-w-lg mx-auto font-medium">
          Browse upcoming tournaments, claim your slot, and battle for verified bKash cash prizes and leaderboard power ranking.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/tournaments"
            className="px-6 py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
          >
            <span>View All Tournaments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/support"
            className="px-6 py-3 rounded-xl bg-surface-200 hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 transition-colors"
          >
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  );
}

