import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Smartphone,
  Ban,
  Clock,
  Trophy,
  WifiOff,
  Users2,
  FileCheck2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Official Competitive Rulebook — ARENEX",
  description:
    "Standard operational rulebook, competitive integrity standards, device eligibility, scoring calculations, and dispute protocols for all tournaments on AreNex.",
};

export default function RulesPage() {
  const chapters = [
    {
      id: "eligibility",
      num: "01",
      title: "Device & Player Eligibility",
      icon: Smartphone,
      severity: "STRICT REQUIREMENT",
      severityColor: "text-brand-crimson bg-brand-crimson/10 border-brand-crimson/20",
      content: [
        "Mobile Devices Only: All standard tournaments are restricted to genuine handheld mobile devices (iOS / Android). Emulators (Bluestacks, LDPlayer, GameLoop, etc.) are strictly prohibited unless the tournament title explicitly states '[EMULATOR ALLOWED]'.",
        "UID Matching: The Free Fire Player UID and In-Game Name (IGN) registered on AreNex must exactly match the account entering the custom room lobby. Impersonation or account sharing will result in an immediate forfeit.",
        "Single Entry per User: A player may not participate in the same tournament under multiple accounts or concurrently on behalf of another participant.",
      ],
    },
    {
      id: "anticheat",
      num: "02",
      title: "Anti-Cheat & Competitive Integrity",
      icon: Ban,
      severity: "ZERO TOLERANCE",
      severityColor: "text-red-500 bg-red-500/10 border-red-500/20",
      content: [
        "Unauthorized Third-Party Software: Use of auto-aim, wallhacks, speed mods, radar overlays, APK modifications, or macro scripts results in an instant permanent hardware UID ban and complete forfeiture of all prize balances.",
        "Teaming & Collusion: Teaming between non-allied players or passing strategic room data to external spectators is strictly forbidden and monitored via referee telemetry.",
        "Hardware Fingerprinting: System logs capture suspicious connection and input anomalies for forensic referee review.",
      ],
    },
    {
      id: "room-protocol",
      num: "03",
      title: "Room Access & Cryptographic Key Gate",
      icon: ShieldCheck,
      severity: "SECURITY PROTOCOL",
      severityColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      content: [
        "Automated Decryption: Custom Room ID and Password are encrypted and revealed strictly inside the Match Room page exactly 15 minutes before the match start time to checked-in players.",
        "Key Sharing Violation: Sharing room credentials with non-registered players or external social channels will lead to immediate match ban and wallet forfeiture.",
        "Lobby Slot Allocation: In Solo mode, players may occupy any open slot unless assigned by a referee. In Squad mode, entire rosters must occupy their designated team slot.",
      ],
    },
    {
      id: "checkin",
      num: "04",
      title: "Mandatory Check-In & No-Show Policy",
      icon: Clock,
      severity: "TIME-CRITICAL",
      severityColor: "text-brand-gold bg-brand-gold/10 border-brand-gold/20",
      content: [
        "Check-In Window: The check-in window opens 30 minutes before match time and closes 10 minutes before start time.",
        "Unconfirmed Slots: Failure to click 'Confirm Check-In' before the window closes automatically forfeits the slot to waiting reserve players without refund.",
        "Match Start Punctuality: Custom match rooms launch exactly at the scheduled time. Referees will not restart rooms for tardy players.",
      ],
    },
    {
      id: "scoring",
      num: "05",
      title: "Deterministic Scoring Matrix",
      icon: Trophy,
      severity: "MATHEMATICAL FORMULA",
      severityColor: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20",
      content: [
        "Booyah (1st Place): 12 Points",
        "2nd Place: 9 Points | 3rd Place: 8 Points | 4th Place: 7 Points | 5th Place: 6 Points",
        "6th Place: 5 Points | 7th Place: 4 Points | 8th Place: 3 Points | 9th Place: 2 Points | 10th Place: 1 Point",
        "Elimination Frags: Exactly 1 Point per confirmed referee-verified kill.",
        "Tiebreaker Hierarchy: In case of equal total points: 1) Highest total kills, 2) Highest single match placement, 3) Earliest registration timestamp.",
      ],
    },
    {
      id: "disconnections",
      num: "06",
      title: "Disconnections & Client Lag Policy",
      icon: WifiOff,
      severity: "OPERATIONAL RULE",
      severityColor: "text-slate-400 bg-surface-200 border-surface-border",
      content: [
        "Individual Connection Drops: If a player disconnects due to their personal ISP, ping spike, or device battery drain, the match will proceed without pause.",
        "Server-Wide Crashes: If more than 30% of the lobby disconnects due to a global Garena server crash before the first safe zone shrinks, the referee desk may declare a void and schedule an immediate rematch.",
      ],
    },
    {
      id: "sportsmanship",
      num: "07",
      title: "Code of Conduct & Toxicity",
      icon: Users2,
      severity: "CODE OF CONDUCT",
      severityColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      content: [
        "Respectful Communication: Harassment, hate speech, abusive language in global chat, or referee intimidation will result in point penalties and potential platform suspension.",
        "Streaming Etiquette: Players broadcasting their POV must use at least a 120-second delay to prevent stream sniping.",
      ],
    },
    {
      id: "disputes",
      num: "08",
      title: "Dispute Window & Official Appeals",
      icon: FileCheck2,
      severity: "APPEAL PROTOCOL",
      severityColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      content: [
        "15-Minute Window: All score disputes must be submitted via the Dispute Resolution Desk within 15 minutes of match conclusion.",
        "Evidence Requirement: Claims must be accompanied by unedited end-game screenshots or video recordings showing the match UID and kill feed.",
        "Binding Verdicts: The decision of the Head Referee and Server Telemetry Audit is final once the tournament reaches Finalized status.",
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-crimson transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-gray-200 font-bold">Rulebook</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-surface-100 border border-surface-border p-6 sm:p-10 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-crimson/10 blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-xs font-mono text-brand-crimson font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>OFFICIAL COMPETITIVE STANDARD • v2.1</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          AreNex Tournament Rulebook
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 font-sans max-w-3xl leading-relaxed font-medium">
          The official competitive standards and operational rules governing all Free Fire Battle Royale tournaments, custom lobbies, scoring calculations, and referee enforcement across the AreNex esports ecosystem.
        </p>

        {/* Quick Chapter Jump Bar */}
        <div className="pt-4 border-t border-surface-border flex flex-wrap gap-2">
          {chapters.map((ch) => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className="px-3 py-1.5 rounded-lg bg-surface-200 hover:bg-surface-elevated border border-surface-border text-[11px] font-mono font-bold text-slate-700 dark:text-gray-300 hover:text-brand-crimson transition-all"
            >
              {ch.num}. {ch.title.split(" ")[0]}
            </a>
          ))}
        </div>
      </div>

      {/* Chapters List */}
      <div className="space-y-8">
        {chapters.map((ch) => {
          const Icon = ch.icon;
          return (
            <section
              key={ch.id}
              id={ch.id}
              className="p-6 sm:p-8 rounded-2xl bg-surface-100 border border-surface-border space-y-4 shadow-lg hover:border-surface-borderLight transition-all scroll-mt-24"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-surface-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-200 border border-surface-border flex items-center justify-center text-brand-crimson shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block">
                      Chapter {ch.num}
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase">
                      {ch.title}
                    </h2>
                  </div>
                </div>

                <span
                  className={`self-start sm:self-center px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${ch.severityColor}`}
                >
                  {ch.severity}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {ch.content.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-gray-300 font-sans leading-relaxed font-medium">
                    <span className="w-5 h-5 rounded-full bg-surface-200 border border-surface-border flex items-center justify-center text-[10px] font-mono font-bold text-slate-600 dark:text-gray-400 shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p>{rule}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom CTA Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-surface-100 via-surface-elevated to-surface-100 border border-brand-crimson/30 text-center space-y-5 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/15 border border-brand-crimson/30 text-xs font-mono text-brand-crimson font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>READY FOR BATTLE</span>
        </div>
        <h3 className="font-display text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase">
          Compete Under Pure Competitive Integrity
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 max-w-lg mx-auto font-medium">
          Join our open brackets, submit your UID, and experience deterministic tournaments with zero compromise on fair play.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/tournaments"
            className="px-6 py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-crimson/25 transition-all"
          >
            <span>Explore Tournaments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/support"
            className="px-6 py-3 rounded-xl bg-surface-200 hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 transition-colors"
          >
            Contact Referees
          </Link>
        </div>
      </div>
    </div>
  );
}

