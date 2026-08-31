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
      return { success: false, error: "Authentication session expired. Please log in again." };
    }

    // Attempt 1: Call atomic stored procedure if available in PostgreSQL
    const { data: rpcResult, error: rpcError } = await supabase.rpc("complete_user_onboarding", {
      p_display_name: data.displayName.trim(),
      p_phone_number: data.phoneNumber?.trim() || null,
      p_country: data.country || "BD",
      p_avatar_url: data.avatarUrl || null,
      p_game_slug: data.gameSlug,
      p_game_uid: data.gameUid.trim(),
      p_in_game_name: data.inGameName.trim(),
      p_platform: data.platform || "MOBILE",
      p_payout_method: data.payoutMethod,
      p_payout_number: data.payoutNumber.trim(),
      p_account_holder_name: data.accountHolderName.trim() || data.displayName.trim(),
    });

    if (!rpcError && rpcResult?.success) {
      revalidatePath("/dashboard");
      revalidatePath("/profile");
      revalidatePath("/");
      return { success: true };
    }

    // If RPC failed due to function not existing or schema variance, proceed with resilient direct table mutations
    if (rpcError) {
      console.info("Info: Falling back to direct Supabase table mutations:", rpcError.message);
    }

    // 1. Ensure Profile exists or perform resilient upsert
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileCheckError) {
      console.error("Critical: Failed to query existing profile:", profileCheckError);
      return {
        success: false,
        error: `Database connection error checking profile: ${profileCheckError.message}`,
      };
    }

    if (!existingProfile) {
      // Derive clean username from display name or email
      let baseUsername = (data.displayName || user.email?.split("@")[0] || "warrior")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .slice(0, 30);
      if (baseUsername.length < 3) baseUsername = `warrior_${Math.floor(1000 + Math.random() * 9000)}`;

      const { error: profileInsertError } = await supabase.from("profiles").insert({
        id: user.id,
        username: `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`,
        display_name: data.displayName.trim(),
        phone_number: data.phoneNumber?.trim() || null,
        country: data.country || "BD",
        avatar_url: data.avatarUrl || null,
        profile_completion_status: true,
        role: "USER",
        updated_at: new Date().toISOString(),
      });

      if (profileInsertError) {
        console.error("Critical: Failed to insert user profile:", profileInsertError);
        return {
          success: false,
          error: `Could not create competitor profile in database: ${profileInsertError.message}`,
        };
      }
    } else {
      // Update existing profile row
      const { error: profileUpdateError } = await supabase
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

      if (profileUpdateError) {
        console.error("Critical: Failed to update user profile:", profileUpdateError);
        return {
          success: false,
          error: `Could not update profile in database: ${profileUpdateError.message}`,
        };
      }
    }

    // 2. Resolve Game ID
    let gameId = data.gameId;
    if (!gameId) {
      const { data: gameRow, error: gameQueryError } = await supabase
        .from("games")
        .select("id")
        .eq("slug", data.gameSlug)
        .maybeSingle();

      if (gameRow?.id) {
        gameId = gameRow.id;
      } else {
        // Fallback to known standard Free Fire UUID if query returned empty
        gameId = "00000000-0000-0000-0000-000000000001";
      }
    }

    // 3. Upsert Game Account
    if (gameId && data.gameUid && data.inGameName) {
      const { error: gameAccountError } = await supabase.from("game_accounts").upsert(
        {
          user_id: user.id,
          game_id: gameId,
          game_uid: data.gameUid.trim(),
          in_game_name: data.inGameName.trim(),
          platform: data.platform || "MOBILE",
          verification_status: "UNVERIFIED",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,game_id" }
      );

      if (gameAccountError) {
        console.error("Critical: Failed to upsert game_accounts:", gameAccountError);
        return {
          success: false,
          error: `Could not persist game account: ${gameAccountError.message}`,
        };
      }
    }

    // 4. Upsert Payout Profile (bKash / Nagad / Rocket)
    if (data.payoutNumber && data.accountHolderName) {
      const { error: payoutError } = await supabase.from("payout_profiles").upsert(
        {
          user_id: user.id,
          payout_method: data.payoutMethod,
          payout_number: data.payoutNumber.trim(),
          account_holder_name: data.accountHolderName.trim() || data.displayName.trim(),
          is_verified: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,payout_method" }
      );

      if (payoutError) {
        console.error("Critical: Failed to upsert payout_profiles:", payoutError);
        return {
          success: false,
          error: `Could not persist payout account: ${payoutError.message}`,
        };
      }
    }

    // 5. Post-Onboarding Persistence Verification
    // Assert that the profile is actually committed and marked complete in Supabase
    const { data: verifiedProfile, error: verifyError } = await supabase
      .from("profiles")
      .select("id, profile_completion_status, display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (verifyError || !verifiedProfile || !verifiedProfile.profile_completion_status) {
      console.error("Critical: Post-onboarding profile verification failed:", verifyError, verifiedProfile);
      return {
        success: false,
        error: "Verification failed: Your profile could not be confirmed in the Supabase database. Please try again.",
      };
    }

    // Verify game account if submitted
    if (gameId && data.gameUid && data.inGameName) {
      const { data: verifiedGameAccount, error: verifyGameError } = await supabase
        .from("game_accounts")
        .select("id, game_uid")
        .eq("user_id", user.id)
        .eq("game_id", gameId)
        .maybeSingle();

      if (verifyGameError || !verifiedGameAccount) {
        console.error("Critical: Post-onboarding game account verification failed:", verifyGameError);
        return {
          success: false,
          error: "Verification failed: Your game account was not confirmed in Supabase.",
        };
      }
    }

    // Verify payout profile if submitted
    if (data.payoutNumber && data.accountHolderName) {
      const { data: verifiedPayout, error: verifyPayoutError } = await supabase
        .from("payout_profiles")
        .select("id, payout_number")
        .eq("user_id", user.id)
        .eq("payout_method", data.payoutMethod)
        .maybeSingle();

      if (verifyPayoutError || !verifiedPayout) {
        console.error("Critical: Post-onboarding payout profile verification failed:", verifyPayoutError);
        return {
          success: false,
          error: "Verification failed: Your payout profile was not confirmed in Supabase.",
        };
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected onboarding error:", err);
    return {
      success: false,
      error: (err as Error).message || "An unexpected database error occurred while saving your profile.",
    };
  }
}
