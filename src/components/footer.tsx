import Link from "next/link";
import { Trophy, ShieldCheck, Zap, Lock, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-surface-300 border-t border-surface-border mt-20 pb-20 md:pb-12 text-sm text-gray-400">
      {/* Fair Play & Trust Bar */}
      <div className="border-b border-surface-border/60 bg-surface-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">
                Anti-Cheat & Bans
              </p>
              <p className="text-xs text-gray-400">Hardware & Free Fire UID bans</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">
                Transparent Rewards
              </p>
              <p className="text-xs text-gray-400">Deterministic scoring & pool caps</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">
                Instant Verification
              </p>
              <p className="text-xs text-gray-400">Official referee match logging</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">
                Protected Rooms
              </p>
              <p className="text-xs text-gray-400">Authorized check-in credentials</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <span className="font-display text-lg font-black tracking-wider text-white uppercase">
                NEXUS<span className="text-cyan-400">OPS</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Premium dark esports analytics platform with real-time tournament operations. Built for competitive Free Fire mobile warriors, featuring automated financial ledger tracking, protected room releases, and referee-authoritative telemetry.
            </p>
            <p className="text-[11px] text-gray-500 font-mono">
              NexusOps Platform • Dhaka, Bangladesh
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Platform
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tournaments" className="hover:text-cyan-400 transition-colors">
                  All Tournaments
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-cyan-400 transition-colors">
                  Live Match Broadcast
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-cyan-400 transition-colors">
                  Leaderboards & Stats
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-cyan-400 transition-colors">
                  Clans & Rosters
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Tournaments
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tournaments?format=SOLO" className="hover:text-cyan-400 transition-colors">
                  Solo Battle Royale
                </Link>
              </li>
              <li>
                <Link href="/tournaments?format=SQUAD" className="hover:text-cyan-400 transition-colors">
                  Squad Clash
                </Link>
              </li>
              <li>
                <Link href="/tournaments?format=LONE_WOLF" className="hover:text-cyan-400 transition-colors">
                  Lone Wolf Duels
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-cyan-400 transition-colors">
                  Scoring Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Compliance & Legal
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/rules" className="hover:text-cyan-400 transition-colors">
                  Fair Play Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disputes" className="hover:text-cyan-400 transition-colors">
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-border/60 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 NexusOps. Not officially affiliated with Garena Free Fire.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
