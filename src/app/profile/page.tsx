import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { dataStore } from "@/lib/store";
import { ProfileEditorClient } from "./profile-editor-client";
import { Shield, ArrowLeft, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const isProduction = process.env.NODE_ENV === "production";
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")
  );

  let initialProfile = {
    id: "guest",
    email: "warrior@arenex.gg",
    username: "warrior",
    displayName: "Warrior",
    phoneNumber: "",
    country: "BD",
    avatarUrl: "",
    role: "USER",
    completionStatus: false,
  };

  let initialGameAccount: {
    gameSlug: string;
    gameUid: string;
    inGameName: string;
    platform: string;
    verificationStatus: string;
  } | undefined = undefined;

  let initialPayout: {
    payoutMethod: "bkash" | "nagad" | "rocket";
    payoutNumber: string;
    accountHolderName: string;
    isVerified: boolean;
  } | undefined = undefined;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      redirect("/login?redirect=/profile");
    }

    // Parallel fetch from Supabase
    const [profileRes, gameAccRes, payoutRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, username, display_name, phone_number, country, avatar_url, role, profile_completion_status")
        .eq("id", authUser.id)
        .maybeSingle(),
      supabase
        .from("game_accounts")
        .select("game_uid, in_game_name, platform, verification_status, games(slug)")
        .eq("user_id", authUser.id)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("payout_profiles")
        .select("payout_method, payout_number, account_holder_name, is_verified")
        .eq("user_id", authUser.id)
        .limit(1)
        .maybeSingle(),
    ]);

    const profileData = profileRes.data;
    const gameData = gameAccRes.data;
    const payoutData = payoutRes.data;

    initialProfile = {
      id: authUser.id,
      email: authUser.email || "",
      username: profileData?.username || authUser.email?.split("@")[0] || "warrior",
      displayName: profileData?.display_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || "Warrior",
      phoneNumber: profileData?.phone_number || "",
      country: profileData?.country || "BD",
      avatarUrl: profileData?.avatar_url || authUser.user_metadata?.avatar_url || "",
      role: profileData?.role || "USER",
      completionStatus: profileData?.profile_completion_status || false,
    };

    if (gameData) {
      initialGameAccount = {
        gameSlug: (gameData.games as any)?.slug || "free-fire",
        gameUid: gameData.game_uid || "",
        inGameName: gameData.in_game_name || "",
        platform: gameData.platform || "MOBILE",
        verificationStatus: gameData.verification_status || "UNVERIFIED",
      };
    }

    if (payoutData) {
      initialPayout = {
        payoutMethod: (payoutData.payout_method as any) || "bkash",
        payoutNumber: payoutData.payout_number || "",
        accountHolderName: payoutData.account_holder_name || "",
        isVerified: payoutData.is_verified || false,
      };
    }
  } else if (!isProduction) {
    const currentUser = dataStore.getCurrentUser();
    initialProfile = {
      id: currentUser.id,
      email: `${currentUser.username}@arenex.gg`,
      username: currentUser.username,
      displayName: currentUser.display_name,
      phoneNumber: "01712345678",
      country: currentUser.country || "BD",
      avatarUrl: currentUser.avatar_url || "",
      role: currentUser.role,
      completionStatus: true,
    };
    initialGameAccount = {
      gameSlug: "free-fire",
      gameUid: currentUser.free_fire_uid || "1098234871",
      inGameName: currentUser.in_game_name || "ALPHA〆KILLER",
      platform: "MOBILE",
      verificationStatus: "VERIFIED",
    };
    initialPayout = {
      payoutMethod: "bkash",
      payoutNumber: "01712345678",
      accountHolderName: currentUser.display_name,
      isVerified: true,
    };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-crimson font-bold mb-1">
            <Shield className="w-4 h-4" />
            <span>WARRIOR REGISTRY & VERIFICATION DESK</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Competitor Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-sans">
            Manage your competitor persona, official Free Fire / PUBG Mobile game UID, and private bKash disbursement details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-50 border border-surface-border text-xs font-mono font-bold text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      <ProfileEditorClient
        initialProfile={initialProfile}
        initialGameAccount={initialGameAccount}
        initialPayout={initialPayout}
      />
    </div>
  );
}
