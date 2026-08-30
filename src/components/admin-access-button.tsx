"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, X, Mail, KeyRound, AlertCircle } from "lucide-react";
import { switchUserRoleAction } from "@/app/actions/tournament-actions";

interface AdminAccessButtonProps {
  currentRole: string;
}

export function AdminAccessButton({ currentRole }: AdminAccessButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const isStaff =
    currentRole === "SUPER_ADMIN" ||
    currentRole === "OWNER" ||
    currentRole === "TOURNAMENT_ADMIN" ||
    currentRole === "REFEREE" ||
    currentRole === "FINANCE_ADMIN";

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Required Admin Credentials specified by the user:
    // Username / Email: khalid@admin.com
    // Password: admin@123
    const isAuthorized =
      (cleanEmail === "khalid@admin.com" || cleanEmail === "khalid") &&
      cleanPass === "admin@123";

    if (isAuthorized) {
      // Authenticate session as Platform Owner / Super Admin
      await switchUserRoleAction("user-admin-1");
      setIsOpen(false);
      setEmail("");
      setPassword("");
      setIsPending(false);
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid administrative credentials. Access restricted to authorized personnel.");
      setIsPending(false);
    }
  };

  const handleDirectAccess = () => {
    if (process.env.NODE_ENV === "production" || isStaff) {
      router.push("/admin");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleDirectAccess}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-800 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white transition-all font-display uppercase tracking-wider shadow-sm"
        title="Official Operations & Referee Portal"
      >
        <Shield className="w-3.5 h-3.5 text-brand-crimson" />
        <span>{isStaff ? "Admin Desk" : "Admin"}</span>
      </button>

      {/* Admin Login Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-surface-100 border border-surface-border p-6 sm:p-7 shadow-2xl space-y-5 relative">
            <button
              onClick={() => {
                setIsOpen(false);
                setError(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Official Operations Desk
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-400 font-sans">
                  Restricted portal for Khalid Abdullah (Platform Owner)
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
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
                    autoFocus
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-2.5 top-3" />
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
                    placeholder="admin@123"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-200 border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono font-medium"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-crimson/25 active:scale-[0.98]"
                >
                  <span>{isPending ? "Authenticating..." : "Unlock Admin Operations Desk"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-surface-border/60 text-center">
              <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                Authorized Credentials: <code className="text-brand-crimson font-bold">khalid@admin.com</code> / <code className="text-brand-crimson font-bold">admin@123</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
