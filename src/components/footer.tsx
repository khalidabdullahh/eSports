"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Zap, Lock, Award, Sparkles } from "lucide-react";
import { ArenexLogo } from "./brand/arenex-logo";

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function Footer() {
  const pathname = usePathname();

  // Super Admin operational consoles should not render the public marketing footer
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-surface-300 border-t border-surface-border mt-12 sm:mt-20 pb-24 md:pb-12 text-sm text-gray-400">
      {/* ============================================================
          1. FAIR PLAY & TRUST BAR (DESKTOP + TABLET)
      ============================================================ */}
      <div className="border-b border-surface-border/60 bg-surface-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wider font-display">
                Competitive Integrity
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Anti-cheat & UID verification</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wider font-display">
                Deterministic Rewards
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Guaranteed prize distributions</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wider font-display">
                Referee Telemetry
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Server-authoritative scoring</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-surface-50 text-gray-300 border border-surface-borderLight shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wider font-display">
                Protected Vault
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Encrypted player room keys</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. MOBILE COMPACT FOOTER (TAKES MINIMAL SPACE, SUPER CLEAN)
      ============================================================ */}
      <div className="md:hidden px-4 py-6 space-y-4 text-center">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center justify-center gap-1">
          <ArenexLogo variant="full" size="sm" showTagline={false} />
          <p className="text-[11px] text-gray-400 font-sans">
            Where Players Compete. Legends Rise.
          </p>
        </div>

        {/* Social Media Community Hub */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook Community"
            className="p-2.5 rounded-xl bg-surface-200 hover:bg-[#1877F2]/20 border border-surface-border hover:border-[#1877F2]/40 text-gray-300 hover:text-[#1877F2] transition-all shadow-sm group"
          >
            <FacebookIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="https://whatsapp.com/channel/0029Vb9GN1zLY6dGJJNXM42f"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Official Channel"
            className="p-2.5 rounded-xl bg-surface-200 hover:bg-[#25D366]/20 border border-surface-border hover:border-[#25D366]/40 text-gray-300 hover:text-[#25D366] transition-all shadow-sm group flex items-center gap-1.5 px-3.5"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-mono font-bold text-gray-200 group-hover:text-[#25D366]">WhatsApp Channel</span>
          </a>

          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord Server"
            className="p-2.5 rounded-xl bg-surface-200 hover:bg-[#5865F2]/20 border border-surface-border hover:border-[#5865F2]/40 text-gray-300 hover:text-[#5865F2] transition-all shadow-sm group"
          >
            <DiscordIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </a>
        </div>

        {/* Compact Horizontal Inline Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-xs text-gray-300 pt-2 border-t border-surface-border/50">
          <Link href="/tournaments" className="hover:text-brand-crimsonLight transition-colors">
            Tournaments
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/live" className="hover:text-brand-crimsonLight transition-colors">
            Live Stream
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/rankings" className="hover:text-brand-crimsonLight transition-colors">
            Rankings
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/rules" className="hover:text-brand-crimsonLight transition-colors">
            Rules
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/terms" className="hover:text-brand-crimsonLight transition-colors">
            Terms
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/privacy" className="hover:text-brand-crimsonLight transition-colors">
            Privacy
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/support" className="hover:text-brand-crimsonLight transition-colors">
            Support
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/about" className="hover:text-brand-crimsonLight transition-colors">
            About
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/developer" className="text-brand-gold hover:text-white font-semibold transition-colors">
            Developer
          </Link>
        </div>

        {/* Mobile Copyright & Version */}
        <div className="pt-2 text-[11px] text-gray-400 space-y-1">
          <p>© 2026 ARENEX. All rights reserved.</p>
          <div className="flex items-center justify-center gap-2">
            <span className="px-2 py-0.5 rounded bg-surface-200 border border-surface-border text-[9px] font-mono text-brand-crimson font-bold uppercase">
              v2.1
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          3. DESKTOP RICH MULTI-COLUMN FOOTER
      ============================================================ */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-5 gap-8">
          {/* Col 1: Brand Info & Socials */}
          <div className="col-span-2 space-y-4">
            <ArenexLogo variant="full" size="md" showTagline />
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              AreNex (Arena + Next) is a next-generation competitive esports platform. A digital arena where players compete, prove their skill, build their reputation, and rise toward greatness.
            </p>

            {/* Social Media Community Row */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Community"
                className="p-2 rounded-lg bg-surface-200 hover:bg-[#1877F2]/20 border border-surface-border hover:border-[#1877F2]/40 text-gray-400 hover:text-[#1877F2] transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href="https://whatsapp.com/channel/0029Vb9GN1zLY6dGJJNXM42f"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Official Channel"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-200 hover:bg-[#25D366]/20 border border-surface-border hover:border-[#25D366]/40 text-gray-300 hover:text-[#25D366] transition-colors text-xs font-mono font-bold"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Channel</span>
              </a>

              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord Server"
                className="p-2 rounded-lg bg-surface-200 hover:bg-[#5865F2]/20 border border-surface-border hover:border-[#5865F2]/40 text-gray-400 hover:text-[#5865F2] transition-colors"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
            </div>

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

          {/* Col 2: Competitive Arena */}
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

          {/* Col 3: Battle Formats */}
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

          {/* Col 4: Integrity & Trust */}
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

        {/* Desktop Bottom Bar */}
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

