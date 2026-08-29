import Link from "next/link";
import { Shield, AlertCircle, ArrowLeft } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <div className="rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-8 space-y-6">
        <div className="border-b border-surface-border pb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <Shield className="w-4 h-4" />
            <span>COMPETITIVE INTEGRITY & FAIR PLAY</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase">
            Official Tournament Rulebook
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Standard operating rules for all Free Fire competitive cups on NexusOps
          </p>
        </div>

        <div className="space-y-6 text-xs text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-white uppercase">
              1. Identity & Device Eligibility
            </h2>
            <p>
              Only mobile devices (iOS / Android) are permitted unless the tournament title explicitly states &quot;PC / Emulator Allowed&quot;. Emulators are strictly blocked by custom room settings. The Free Fire UID submitted during registration must match the in-game account in the custom match room.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-white uppercase">
              2. Teaming & Third-Party Software
            </h2>
            <p>
              Any evidence of teaming with non-team players, wallhacks, auto-aim, radar scripts, or game file modifications will result in immediate match disqualification, forfeiture of prize money, and a permanent platform and UID ban.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-white uppercase">
              3. Check-In & No-Show Policy
            </h2>
            <p>
              Check-in opens 30 minutes before match start and closes 15 minutes before match start. Registered players who fail to check in will forfeit their slot to reserve players without refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-white uppercase">
              4. Dispute Protocol
            </h2>
            <p>
              Disputes must be formally logged through the platform within 15 minutes of match result publication with screenshot or video evidence. Referees review spectator telemetry and Carrier logs to make binding determinations.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
