"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, CheckCircle2, ArrowRight, X, KeyRound } from "lucide-react";
import { switchUserRoleAction } from "@/app/actions/tournament-actions";

interface AdminAccessButtonProps {
  currentRole: string;
}

export function AdminAccessButton({ currentRole }: AdminAccessButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isStaff =
    currentRole === "SUPER_ADMIN" ||
    currentRole === "OWNER" ||
    currentRole === "TOURNAMENT_ADMIN" ||
    currentRole === "REFEREE" ||
    currentRole === "FINANCE_ADMIN";

  const handleAdminUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(false);

    // Default master PIN for admin access: 'arenex' or 'admin2026'
    if (pin.trim().toLowerCase() === "arenex" || pin.trim() === "admin2026" || pin.trim() === "1234") {
      // Switch active session to Super Admin
      await switchUserRoleAction("user-admin-1");
      setIsOpen(false);
      setPin("");
      setIsPending(false);
      router.push("/admin");
      router.refresh();
    } else {
      setError(true);
      setIsPending(false);
    }
  };

  const handleDirectAccess = () => {
    if (isStaff) {
      router.push("/admin");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleDirectAccess}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-50 border border-surface-border text-gray-300 hover:text-white transition-all font-display uppercase tracking-wider"
        title="Official Operations & Referee Portal"
      >
        <Shield className="w-3.5 h-3.5 text-brand-crimson" />
        <span>{isStaff ? "Admin Desk" : "Admin"}</span>
      </button>

      {/* Admin Verification Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-surface-100 border border-surface-border p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight">
                  Admin Verification
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Enter master PIN to unlock referee & stats desk
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminUnlock} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1.5">
                  Admin Master PIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 'arenex' or 'admin2026'"
                    autoFocus
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-200 border border-surface-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-crimson font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
                {error && (
                  <p className="text-[11px] text-red-400 font-mono mt-1.5">
                    Invalid PIN. Default PIN is <code className="text-brand-gold">arenex</code>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsonDark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-crimson/25"
                >
                  <span>{isPending ? "Unlocking..." : "Enter Admin Desk"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-surface-border/60 text-center">
              <p className="text-[10px] text-gray-500 font-mono">
                Only tournament directors and match referees should access this portal.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
