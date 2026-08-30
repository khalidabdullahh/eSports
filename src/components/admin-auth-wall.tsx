"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, Mail, KeyRound, AlertCircle, Home } from "lucide-react";
import { switchUserRoleAction } from "@/app/actions/tournament-actions";
import Link from "next/link";

export function AdminAuthWall() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (
      (cleanEmail === "khalid@admin.com" || cleanEmail === "khalid") &&
      cleanPass === "admin@123"
    ) {
      await switchUserRoleAction("user-admin-1");
      setIsPending(false);
      router.refresh();
    } else {
      setError("Invalid administrative credentials. Access restricted to authorized personnel.");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-surface-100 border border-surface-border p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-crimson/10 blur-3xl pointer-events-none -z-10" />

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson flex items-center justify-center mx-auto shadow-lg shadow-brand-crimson/10">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand-crimson font-bold block mb-1">
              RESTRICTED SECURITY ZONE
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Admin Operations Portal
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-sans">
              Enter authorized administrator credentials to unlock referee consoles, financial ledgers, and live match control.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
              Admin Email / Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="khalid@admin.com"
                required
                autoFocus
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-700 dark:text-gray-400 font-bold mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
              />
              <KeyRound className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-crimson/25 active:scale-[0.98]"
          >
            <span>{isPending ? "Verifying Credentials..." : "Unlock Operations Desk"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs font-mono">
          <Link
            href="/"
            className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Visitor Site</span>
          </Link>
          <span className="text-[10px] text-slate-500 dark:text-gray-500">
            Auth: khalid@admin.com
          </span>
        </div>
      </div>
    </div>
  );
}
