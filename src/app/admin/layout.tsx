import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { dataStore } from "@/lib/store";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProduction = process.env.NODE_ENV === "production";
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let isAuthorized = false;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      redirect("/login?redirect=/admin");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_banned")
      .eq("id", authUser.id)
      .single();

    if (
      profile &&
      !profile.is_banned &&
      (profile.role === "OWNER" ||
        profile.role === "SUPER_ADMIN" ||
        profile.role === "TOURNAMENT_ADMIN" ||
        profile.role === "REFEREE" ||
        profile.role === "FINANCE_ADMIN")
    ) {
      isAuthorized = true;
    }
  } else if (!isProduction) {
    // Development prototype fallback
    const currentUser = dataStore.getCurrentUser();
    isAuthorized =
      currentUser.role === "OWNER" ||
      currentUser.role === "SUPER_ADMIN" ||
      currentUser.role === "TOURNAMENT_ADMIN" ||
      currentUser.role === "REFEREE" ||
      currentUser.role === "FINANCE_ADMIN";
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-surface-100 border border-surface-border text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-brand-crimson/10 text-brand-crimson flex items-center justify-center mx-auto border border-brand-crimson/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-brand-crimson tracking-widest uppercase">
              Security Violation 403
            </span>
            <h1 className="font-display text-2xl font-black text-slate-900 dark:text-white uppercase">
              Access Restricted
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 font-sans leading-relaxed">
              This operational zone is strictly reserved for verified tournament administrators and platform arbiters. Your identity has been recorded.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-800 dark:text-gray-200 font-display font-semibold text-xs uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
