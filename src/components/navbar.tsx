import Link from "next/link";
import { Trophy, Radio, Shield, User, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { RoleSwitcher } from "./ui/role-switcher";
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
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-surface-300 rounded-[7px] flex items-center justify-center">
                <Trophy className="w-4.5 h-4.5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-black tracking-wider text-white uppercase group-hover:text-cyan-400 transition-colors">
                NEXUS<span className="text-cyan-400">OPS</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-mono -mt-1">
                Esports Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
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
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              Live Match
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
              href="/how-it-works"
              className="px-3 py-1.5 rounded-md text-gray-400 hover:text-gray-200 transition-colors"
            >
              How It Works
            </Link>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher for Pairing & Review */}
          <RoleSwitcher currentUserId={currentUser.id} profiles={profiles} />

          {isStaff && (
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
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
                className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-500/50"
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
