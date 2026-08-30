import Link from "next/link";
import { Radio, Shield, User, ChevronRight, Sparkles, LogIn } from "lucide-react";
import { Badge } from "./ui/badge";
import { AdminAccessButton } from "./admin-access-button";
import { ThemeToggle } from "./ui/theme-toggle";
import { ArenexLogo } from "./brand/arenex-logo";
import { dataStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let displayName = "Dashboard";
  let avatarUrl: string | undefined = undefined;
  let userRole = "USER";

  if (authUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, role")
      .eq("id", authUser.id)
      .single();

    if (profile) {
      displayName = profile.display_name || "Warrior";
      avatarUrl = profile.avatar_url;
      userRole = profile.role;
    }
  } else {
    const currentUser = dataStore.getCurrentUser();
    displayName = currentUser.role === "SUPER_ADMIN" ? "Khalid Abdullah" : "Dashboard";
    avatarUrl = currentUser.avatar_url;
    userRole = currentUser.role;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-200/95 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand: Clean Logo Only */}
        <div className="flex items-center gap-6">
          <ArenexLogo variant="full" size="md" linkToHome />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/tournaments"
              className="px-3 py-1.5 rounded-md text-slate-800 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated font-medium transition-colors"
            >
              Tournaments
            </Link>
            <Link
              href="/live"
              className="px-3 py-1.5 rounded-md text-slate-800 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated font-medium transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-brand-crimson animate-pulse" />
              Live Arena
              <Badge variant="live" pulse className="px-1.5 py-0 text-[10px]">
                LIVE
              </Badge>
            </Link>
            <Link
              href="/rankings"
              className="px-3 py-1.5 rounded-md text-slate-800 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated font-medium transition-colors"
            >
              Rankings
            </Link>
            <Link
              href="/teams"
              className="px-3 py-1.5 rounded-md text-slate-800 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated font-medium transition-colors"
            >
              Teams
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-md text-slate-700 dark:text-gray-400 hover:text-slate-950 dark:hover:text-gray-200 font-medium transition-colors"
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

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle (Dark / Light) */}
          <ThemeToggle />

          {/* Dedicated Admin Portal Access */}
          <AdminAccessButton currentRole={userRole} />

          {/* User Profile Pill or Sign In Button */}
          {authUser ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-surface-elevated hover:bg-surface-50 border border-surface-border transition-all shadow-sm"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-brand-crimson/50"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-surface-border flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-gray-300" />
                </div>
              )}
              <span className="text-xs font-semibold text-slate-800 dark:text-gray-200 hidden sm:inline max-w-[110px] truncate">
                {displayName}
              </span>
              <ChevronRight className="w-3 h-3 text-gray-500" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-800 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white transition-all font-display uppercase tracking-wider shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-brand-crimson" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white transition-all font-display uppercase tracking-wider shadow-sm"
              >
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
