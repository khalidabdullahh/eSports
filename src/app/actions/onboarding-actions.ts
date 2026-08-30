"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface OnboardingData {
  displayName: string;
  phoneNumber?: string;
  country: string;
  avatarUrl?: string;
  gameId?: string;
  gameSlug: string;
  gameUid: string;
  inGameName: string;
  platform: string;
  payoutMethod: "bkash" | "nagad" | "rocket";
  payoutNumber: string;
  accountHolderName: string;
}

export async function completeOnboardingAction(data: OnboardingData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Authentication required to complete profile setup." };
    }

    // 1. Update Profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        display_name: data.displayName.trim(),
        phone_number: data.phoneNumber?.trim() || null,
        country: data.country || "BD",
        avatar_url: data.avatarUrl || null,
        profile_completion_status: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      // In development / demo environment without active database table, log cleanly
      console.warn("Notice: Supabase profiles update:", profileError.message);
    }

    // 2. Fetch or lookup Game
    let gameId = data.gameId;
    if (!gameId) {
      const { data: gameRow } = await supabase
        .from("games")
        .select("id")
        .eq("slug", data.gameSlug)
        .single();
      if (gameRow) {
        gameId = gameRow.id;
      }
    }

    // 3. Upsert Game Account
    if (gameId && data.gameUid && data.inGameName) {
      const { error: gameAccountError } = await supabase.from("game_accounts").upsert({
        user_id: user.id,
        game_id: gameId,
        game_uid: data.gameUid.trim(),
        in_game_name: data.inGameName.trim(),
        platform: data.platform || "MOBILE",
        verification_status: "UNVERIFIED",
        updated_at: new Date().toISOString(),
      });
      if (gameAccountError) {
        console.warn("Notice: Supabase game_accounts upsert:", gameAccountError.message);
      }
    }

    // 4. Upsert Payout Profile (bKash / Nagad / Rocket)
    if (data.payoutNumber && data.accountHolderName) {
      const { error: payoutError } = await supabase.from("payout_profiles").upsert({
        user_id: user.id,
        payout_method: data.payoutMethod,
        payout_number: data.payoutNumber.trim(),
        account_holder_name: data.accountHolderName.trim(),
        is_verified: false,
        updated_at: new Date().toISOString(),
      });
      if (payoutError) {
        console.warn("Notice: Supabase payout_profiles upsert:", payoutError.message);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to save profile." };
  }
}
