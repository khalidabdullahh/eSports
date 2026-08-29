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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-surface-border text-xs font-mono text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FAIR PLAY & OPERATIONAL TRANSPARENCY</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          How The Tournament System Operates
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          From slot reservation to verified bKash disbursement — understanding our deterministic scoring, protected rooms, and append-only financial ledger.
        </p>
      </div>

      {/* 5-Step Operational Pipeline */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-display font-black text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase">
              Slot Hold & Payment Verification
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed pl-11">
            When you register, an atomic slot is reserved in the database. You submit the entry fee via bKash, Nagad, or Rocket and provide your Transaction ID (TrxID). Our finance desk cross-checks the carrier receipt against the append-only ledger and marks the registration <code>APPROVED</code>.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-display font-black text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase">
              Mandatory Check-In & Room Decryption Gate
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed pl-11">
            30 minutes prior to drop time, the check-in window opens. Players must click &quot;Confirm Check-In&quot; to verify their attendance. Exactly at scheduled release time, custom room credentials (Room ID and Password) are decrypted strictly on the server and revealed only to checked-in users.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 font-display font-black text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase">
              Official Referee Match Telemetry
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed pl-11">
            Certified referees spectate the custom room and log kills and eliminations in real-time through the Referee Console. Every event produces an immutable record with sequence numbers and timestamps, updating the public live broadcast without client-side trusting.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 font-display font-black text-sm flex items-center justify-center">
              04
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase">
              15-Minute Dispute Window
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed pl-11">
            Once results are submitted, a 15-minute dispute window opens. If a player believes their kill count or placement was recorded inaccurately, they can submit screenshot or video evidence directly to the Dispute Resolution Desk.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-display font-black text-sm flex items-center justify-center">
              05
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase">
              Deterministic Reward Engine & Payout
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed pl-11">
            After the dispute window closes, the tournament is finalized. The deterministic reward engine executes, distributing guaranteed podium payouts and top-fragger bonuses. Podium winners are strictly excluded from performance bonuses by default. Payouts are queued for immediate disbursement.
          </p>
        </div>
      </div>

      {/* Demo Night Battle Rule Matrix */}
      <div className="p-6 rounded-2xl bg-surface-100 border border-surface-border space-y-6">
        <h2 className="font-display text-xl font-black text-white uppercase">
          Standard Scoring Matrix (Free Fire)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
          <div className="p-3 rounded-lg bg-surface-200 border border-surface-border">
            <span className="text-amber-400 block font-bold text-sm">#1: 12 Pts</span>
            <span className="text-gray-500 text-[10px]">Booyah!</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-200 border border-surface-border">
            <span className="text-gray-300 block font-bold text-sm">#2: 9 Pts</span>
            <span className="text-gray-500 text-[10px]">Runner-Up</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-200 border border-surface-border">
            <span className="text-gray-300 block font-bold text-sm">#3: 8 Pts</span>
            <span className="text-gray-500 text-[10px]">3rd Place</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-200 border border-surface-border">
            <span className="text-gray-300 block font-bold text-sm">#4: 7 Pts</span>
            <span className="text-gray-500 text-[10px]">4th Place</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-200 border border-surface-border">
            <span className="text-cyan-400 block font-bold text-sm">Kill: 1 Pt</span>
            <span className="text-gray-500 text-[10px]">Per Confirmed Kill</span>
          </div>
        </div>
      </div>
    </div>
  );
}
