import Link from "next/link";
import { Radio, Shield, User, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { RoleSwitcher } from "./ui/role-switcher";
import { ThemeToggle } from "./ui/theme-toggle";
import { ArenexLogo } from "./brand/arenex-logo";
import { dataStore } from "@/lib/store";

export function Navbar() {
  const currentUser = dataStore.getCurrentUser();
  const profiles = dataStore.getProfiles();

  const isStaff =
    currentUser.role === "SUPER_ADMIN" ||
    currentUser.role === "OWNER" ||
    currentUser.role === "TOURNAMENT_ADMIN" ||
    currentUser.role === "REFEREE" ||
    currentUser.role === "FINANCE_ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-200/95 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <ArenexLogo variant="full" size="md" linkToHome showTagline />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/tournaments"
              className="px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-surface-elevated transition-colors"
            >
              Tournaments
            </Link>
            <Link
              href="/live"
              className="px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-surface-elevated transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-brand-crimson animate-pulse" />
              Live Arena
              <Badge variant="live" pulse className="px-1.5 py-0 text-[10px]">
                LIVE
              </Badge>
            </Link>
            <Link
              href="/rankings"
              className="px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-surface-elevated transition-colors"
            >
              Rankings
            </Link>
            <Link
              href="/teams"
              className="px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-surface-elevated transition-colors"
            >
              Teams
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-md text-gray-400 hover:text-gray-200 transition-colors"
            >
              About
            </Link>
            <Link
              href="/brand"
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-brand-crimson bg-brand-crimson/10 border border-brand-crimson/30 hover:bg-brand-crimson/20 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Brand
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle (Dark / Light) */}
          <ThemeToggle />

          {/* Quick Role Switcher for Pairing & Review */}
          <RoleSwitcher currentUserId={currentUser.id} profiles={profiles} />

          {isStaff && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-brand-crimson/10 text-brand-crimsonLight border border-brand-crimson/30 hover:bg-brand-crimson/20 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              Ops Console
            </Link>
          )}

          {/* User Profile Pill */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-surface-elevated hover:bg-surface-50 border border-surface-border transition-all"
          >
            {currentUser.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.display_name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-brand-crimson/50"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-surface-border flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-gray-300" />
              </div>
            )}
            <span className="text-xs font-medium text-gray-200 hidden sm:inline max-w-[100px] truncate">
              {currentUser.display_name}
            </span>
            <ChevronRight className="w-3 h-3 text-gray-500" />
          </Link>
        </div>
      </div>
    </header>
  );
}
