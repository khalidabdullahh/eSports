"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ArenexLogo } from "@/components/brand/arenex-logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (authError) {
        setError(authError.message || "Invalid email or password. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        router.push(redirectPath);
        router.refresh();
      }
    } catch {
      setError("An unexpected authentication error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsOAuthLoading(true);
    setError(null);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
        },
      });

      if (oauthError) {
        setError(oauthError.message || "Failed to initialize Google OAuth login.");
        setIsOAuthLoading(false);
      }
    } catch {
      setError("Google authentication service is currently unreachable.");
      setIsOAuthLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center mb-1">
            <ArenexLogo variant="stacked" size="lg" linkToHome />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand-crimson font-bold block mb-1">
              COMPETITIVE ACCESS GATEWAY
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Warrior Sign In
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-sans">
              Enter your credentials to access tournaments, room credentials, and verified earnings.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-100 border border-surface-border space-y-5 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-500 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isOAuthLoading || isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-display font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 hover:text-slate-950 dark:hover:text-white flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>{isOAuthLoading ? "Connecting Google..." : "Continue with Google"}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-surface-border w-full" />
            <span className="bg-surface-100 px-3 text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-widest absolute">
              or warrior email
            </span>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="warrior@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold">
                  Password
                </label>
                <Link
                  href="/support"
                  className="text-[10px] font-mono text-brand-crimson hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isOAuthLoading}
              className="w-full py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-crimson/25 active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Arena"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-600 dark:text-gray-400 font-medium">
            New competitor?{" "}
            <Link href="/signup" className="text-brand-crimson hover:underline font-bold">
              Create Free Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-xs font-mono text-slate-500">
          Loading Arena Gateway...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
