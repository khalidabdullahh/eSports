-- ============================================================
-- ARENEX v2.0 — ONBOARDING PERSISTENCE, RLS FIXES & SUPER ADMIN
-- Idempotent Migration: Safe to execute multiple times
-- ============================================================

-- 1. Ensure required app_role enum values exist
DO $$ BEGIN
  ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'OWNER';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------
-- 2. ENSURE SEED GAMES EXIST
-- ------------------------------------------------------------
INSERT INTO public.games (id, slug, name, publisher, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'free-fire', 'Free Fire Battle Royale', 'Garena', true),
  ('00000000-0000-0000-0000-000000000002', 'pubg-mobile', 'PUBG Mobile', 'Krafton', true),
  ('00000000-0000-0000-0000-000000000003', 'mlbb', 'Mobile Legends: Bang Bang', 'Moonton', true)
ON CONFLICT (slug) DO UPDATE 
SET is_active = true;

-- ------------------------------------------------------------
-- 3. ENSURE RLS INSERT POLICIES EXIST ON PROFILES
-- ------------------------------------------------------------
-- CRITICAL FIX: Authenticated users must be permitted to INSERT their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Ensure authenticated users can read their own or public profiles
DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Ensure authenticated users can update their own profile (protecting role/banned)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND
    is_banned = (SELECT is_banned FROM public.profiles WHERE id = auth.uid())
  );

-- ------------------------------------------------------------
-- 4. ENSURE RLS POLICIES ON GAME_ACCOUNTS
-- ------------------------------------------------------------
ALTER TABLE public.game_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all game accounts" ON public.game_accounts;
CREATE POLICY "Users can view all game accounts"
  ON public.game_accounts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own game accounts" ON public.game_accounts;
CREATE POLICY "Users can insert own game accounts"
  ON public.game_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own game accounts" ON public.game_accounts;
CREATE POLICY "Users can update own game accounts"
  ON public.game_accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 5. ENSURE RLS POLICIES ON PAYOUT_PROFILES
-- ------------------------------------------------------------
ALTER TABLE public.payout_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own payout profile" ON public.payout_profiles;
CREATE POLICY "Users can read own payout profile"
  ON public.payout_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payout profile" ON public.payout_profiles;
CREATE POLICY "Users can insert own payout profile"
  ON public.payout_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own payout profile" ON public.payout_profiles;
CREATE POLICY "Users can update own payout profile"
  ON public.payout_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. ATOMIC ONBOARDING STORED PROCEDURE
-- ------------------------------------------------------------
-- Runs with SECURITY DEFINER so all constraints and permissions are enforced reliably
CREATE OR REPLACE FUNCTION public.complete_user_onboarding(
  p_display_name TEXT,
  p_phone_number TEXT,
  p_country TEXT,
  p_avatar_url TEXT,
  p_game_slug TEXT,
  p_game_uid TEXT,
  p_in_game_name TEXT,
  p_platform TEXT,
  p_payout_method TEXT,
  p_payout_number TEXT,
  p_account_holder_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_username TEXT;
  v_game_id UUID;
  v_profile RECORD;
  v_game_account RECORD;
  v_payout_profile RECORD;
BEGIN
  -- Authenticate caller
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to complete onboarding.';
  END IF;

  -- Get user email from auth.users
  SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;

  -- 1. Ensure Profile exists or upsert it
  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;

  IF v_profile.id IS NULL THEN
    -- Generate base username from email or display name
    v_username := REGEXP_REPLACE(LOWER(COALESCE(p_display_name, SPLIT_PART(v_user_email, '@', 1), 'warrior')), '[^a-z0-9_]', '_', 'g');
    IF LENGTH(v_username) < 3 THEN
      v_username := 'warrior_' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    END IF;
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) THEN
      v_username := v_username || '_' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    END IF;

    INSERT INTO public.profiles (
      id,
      username,
      display_name,
      phone_number,
      country,
      avatar_url,
      profile_completion_status,
      role,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_username,
      TRIM(p_display_name),
      NULLIF(TRIM(p_phone_number), ''),
      COALESCE(NULLIF(TRIM(p_country), ''), 'BD'),
      NULLIF(TRIM(p_avatar_url), ''),
      true,
      'USER',
      NOW(),
      NOW()
    )
    RETURNING * INTO v_profile;
  ELSE
    -- Profile already exists -> update details
    UPDATE public.profiles
    SET
      display_name = TRIM(p_display_name),
      phone_number = NULLIF(TRIM(p_phone_number), ''),
      country = COALESCE(NULLIF(TRIM(p_country), ''), 'BD'),
      avatar_url = COALESCE(NULLIF(TRIM(p_avatar_url), ''), v_profile.avatar_url),
      profile_completion_status = true,
      updated_at = NOW()
    WHERE id = v_user_id
    RETURNING * INTO v_profile;
  END IF;

  -- 2. Resolve Game ID
  SELECT id INTO v_game_id FROM public.games WHERE slug = p_game_slug LIMIT 1;
  IF v_game_id IS NULL THEN
    -- Fallback to default Free Fire game UUID
    v_game_id := '00000000-0000-0000-0000-000000000001'::UUID;
  END IF;

  -- 3. Upsert Game Account
  IF p_game_uid IS NOT NULL AND TRIM(p_game_uid) <> '' AND p_in_game_name IS NOT NULL AND TRIM(p_in_game_name) <> '' THEN
    SELECT * INTO v_game_account FROM public.game_accounts
    WHERE user_id = v_user_id AND game_id = v_game_id
    LIMIT 1;

    IF v_game_account.id IS NULL THEN
      INSERT INTO public.game_accounts (
        user_id,
        game_id,
        game_uid,
        in_game_name,
        platform,
        verification_status,
        created_at,
        updated_at
      ) VALUES (
        v_user_id,
        v_game_id,
        TRIM(p_game_uid),
        TRIM(p_in_game_name),
        COALESCE(NULLIF(TRIM(p_platform), ''), 'MOBILE'),
        'UNVERIFIED',
        NOW(),
        NOW()
      )
      RETURNING * INTO v_game_account;
    ELSE
      UPDATE public.game_accounts
      SET
        game_uid = TRIM(p_game_uid),
        in_game_name = TRIM(p_in_game_name),
        platform = COALESCE(NULLIF(TRIM(p_platform), ''), 'MOBILE'),
        updated_at = NOW()
      WHERE id = v_game_account.id
      RETURNING * INTO v_game_account;
    END IF;
  END IF;

  -- 4. Upsert Payout Profile
  IF p_payout_number IS NOT NULL AND TRIM(p_payout_number) <> '' THEN
    -- Check if record exists for user and payout_method
    SELECT * INTO v_payout_profile FROM public.payout_profiles 
    WHERE user_id = v_user_id AND payout_method::TEXT = LOWER(TRIM(p_payout_method))
    LIMIT 1;

    IF v_payout_profile.id IS NULL THEN
      INSERT INTO public.payout_profiles (
        user_id,
        payout_method,
        payout_number,
        account_holder_name,
        is_verified,
        created_at,
        updated_at
      ) VALUES (
        v_user_id,
        LOWER(TRIM(p_payout_method))::payout_method_type,
        TRIM(p_payout_number),
        COALESCE(NULLIF(TRIM(p_account_holder_name), ''), TRIM(p_display_name)),
        false,
        NOW(),
        NOW()
      )
      RETURNING * INTO v_payout_profile;
    ELSE
      UPDATE public.payout_profiles
      SET
        payout_number = TRIM(p_payout_number),
        account_holder_name = COALESCE(NULLIF(TRIM(p_account_holder_name), ''), TRIM(p_display_name)),
        updated_at = NOW()
      WHERE id = v_payout_profile.id
      RETURNING * INTO v_payout_profile;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'profile', row_to_json(v_profile),
    'game_account', row_to_json(v_game_account),
    'payout_profile', row_to_json(v_payout_profile)
  );
END;
$$;

-- Grant execution permission on stored procedure to authenticated users
GRANT EXECUTE ON FUNCTION public.complete_user_onboarding TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_user_onboarding TO service_role;

-- ------------------------------------------------------------
-- 7. SUPER ADMIN PROMOTION QUERY (MANUAL EXECUTION IN SQL EDITOR)
-- ------------------------------------------------------------
-- To promote your Google OAuth account to SUPER_ADMIN, replace '<YOUR_GOOGLE_EMAIL>' 
-- with your actual email address and run in the Supabase SQL editor:
--
-- UPDATE public.profiles
-- SET role = 'SUPER_ADMIN', updated_at = NOW()
-- WHERE id = (SELECT id FROM auth.users WHERE LOWER(email) = LOWER('<YOUR_GOOGLE_EMAIL>'))
-- RETURNING id, username, display_name, role;
