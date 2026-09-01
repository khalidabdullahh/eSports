"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Zap, Lock, Award, Sparkles } from "lucide-react";
import { ArenexLogo } from "./brand/arenex-logo";

export function Footer() {
  const pathname = usePathname();

  // Super Admin operational consoles should not render the public marketing footer
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-surface-300 border-t border-surface-border mt-20 pb-20 md:pb-12 text-sm text-gray-400">
      {/* Fair Play & Trust Bar */}
      <div className="border-b border-surface-border/60 bg-surface-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                Competitive Integrity
              </p>
              <p className="text-xs text-gray-400">Anti-cheat & hardware UID enforcement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                Deterministic Rewards
              </p>
              <p className="text-xs text-gray-400">Capped prize pools & top-fragger bonuses</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                Referee Telemetry
              </p>
              <p className="text-xs text-gray-400">Server-authoritative live match logging</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-surface-50 text-gray-300 border border-surface-borderLight">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                Protected Vault
              </p>
              <p className="text-xs text-gray-400">Encrypted room keys for checked-in players</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <ArenexLogo variant="full" size="md" showTagline />
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              AreNex (Arena + Next) is a next-generation competitive esports platform. A digital arena where players compete, prove their skill, build their reputation, and rise toward greatness.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/brand"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-crimsonLight hover:text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Brand Identity Guide
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/about"
                className="text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Our Mission & Story
              </Link>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider font-display mb-3">
              Competitive Arena
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tournaments" className="hover:text-brand-crimsonLight transition-colors">
                  All Tournaments
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-brand-crimsonLight transition-colors">
                  Live Match Broadcast
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-brand-crimsonLight transition-colors">
                  Leaderboards & Power Ranks
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-brand-crimsonLight transition-colors">
                  Clans & Rosters
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brand-crimsonLight transition-colors">
                  Scoring Matrix & Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider font-display mb-3">
              Battle Formats
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tournaments?format=SOLO" className="hover:text-brand-crimsonLight transition-colors">
                  Solo Battle Royale (50P)
                </Link>
              </li>
              <li>
                <Link href="/tournaments?format=SQUAD" className="hover:text-brand-crimsonLight transition-colors">
                  Squad Clash (4v4)
                </Link>
              </li>
              <li>
                <Link href="/tournaments?format=LONE_WOLF" className="hover:text-brand-crimsonLight transition-colors">
                  Lone Wolf Duel (1v1)
                </Link>
              </li>
              <li>
                <Link href="/disputes" className="hover:text-brand-crimsonLight transition-colors">
                  Dispute Resolution Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider font-display mb-3">
              Integrity & Trust
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/rules" className="hover:text-brand-crimsonLight transition-colors">
                  Competitive Rulebook
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-crimsonLight transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-crimsonLight transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-brand-crimsonLight transition-colors">
                  Support & Tickets
                </Link>
              </li>
              <li>
                <Link href="/developer" className="text-brand-gold hover:text-white font-semibold transition-colors">
                  Developer & Architect Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-border/60 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p>© 2026 ARENEX. All rights reserved.</p>
            <span className="hidden sm:inline text-gray-600">•</span>
            <p className="text-gray-400">
              Architected & Developed by{" "}
              <Link
                href="/developer"
                className="text-white hover:text-brand-crimsonLight font-semibold transition-colors underline decoration-brand-crimson/50 underline-offset-2"
              >
                Khalid Abdullah
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-2.5 py-0.5 rounded bg-surface-200 border border-surface-border text-[10px] font-mono text-brand-crimson font-bold uppercase tracking-wider">
              ARENEX v2.1
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
              Arena Systems Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
