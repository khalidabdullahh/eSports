-- ============================================================
-- ARENEX v2.1 — PRODUCTION DATABASE ARCHITECTURE UPGRADE
-- Idempotent Migration: Safe to execute multiple times
-- Version: 2.1.0
-- Release Date: September 01, 2026
-- ============================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Ensure enum types are complete
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

DO $$ BEGIN
  ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'TOURNAMENT_ADMIN';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'REFEREE';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'FINANCE_ADMIN';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Ensure columns exist on public.tournaments
DO $$ BEGIN
  ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS stream_url TEXT;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS stream_platform VARCHAR(40) DEFAULT 'facebook';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- 4. Ensure columns exist on public.profiles
DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country VARCHAR(4) DEFAULT 'BD';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completion_status BOOLEAN DEFAULT false;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- 5. Ensure Public Storage Bucket 'avatars' Exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS Policies for avatars
DROP POLICY IF EXISTS "Public avatar images are accessible by everyone" ON storage.objects;
CREATE POLICY "Public avatar images are accessible by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- 6. Atomic User Onboarding & Profile Persistence Stored Procedure
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

  -- 1. Profile Upsert / Update
  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;

  IF v_profile.id IS NULL THEN
    -- Generate base username from display name or email
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
    -- Profile already exists -> update all fields including phone number and country
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

GRANT EXECUTE ON FUNCTION public.complete_user_onboarding TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_user_onboarding TO service_role;

-- 7. Concurrency-Safe Tournament Registration RPC with Pessimistic Locking
CREATE OR REPLACE FUNCTION public.register_tournament_slot(
  p_tournament_id UUID,
  p_user_id UUID,
  p_game_account_id UUID DEFAULT NULL
)
RETURNS TABLE (
  registration_id UUID,
  slot_number INT,
  status registration_status
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_tour RECORD;
  v_existing_reg RECORD;
  v_slot INT;
  v_status registration_status;
  v_new_reg RECORD;
BEGIN
  -- Check if user is already registered for this tournament
  SELECT id, tournament_registrations.slot_number, tournament_registrations.status 
  INTO v_existing_reg
  FROM public.tournament_registrations
  WHERE tournament_id = p_tournament_id AND user_id = p_user_id;

  IF v_existing_reg.id IS NOT NULL THEN
    RETURN QUERY SELECT v_existing_reg.id, v_existing_reg.slot_number, v_existing_reg.status;
    RETURN;
  END IF;

  -- Lock tournament row to prevent race conditions during slot allocation
  SELECT * INTO v_tour
  FROM public.tournaments
  WHERE id = p_tournament_id
  FOR UPDATE;

  IF v_tour.id IS NULL THEN
    RAISE EXCEPTION 'Tournament not found.';
  END IF;

  IF v_tour.status NOT IN ('REGISTRATION_OPEN', 'PUBLISHED', 'CHECK_IN') THEN
    RAISE EXCEPTION 'Tournament registration is not currently open.';
  END IF;

  IF v_tour.current_participants_count >= v_tour.max_participants THEN
    RAISE EXCEPTION 'Tournament is at full capacity (% of % slots filled).', 
      v_tour.current_participants_count, v_tour.max_participants;
  END IF;

  -- Allocate next slot number
  v_slot := v_tour.current_participants_count + 1;
  v_status := CASE WHEN v_tour.entry_fee_cents = 0 THEN 'APPROVED'::registration_status ELSE 'PENDING_PAYMENT'::registration_status END;

  -- Insert registration record
  INSERT INTO public.tournament_registrations (
    tournament_id,
    user_id,
    game_account_id,
    slot_number,
    status,
    created_at,
    updated_at
  ) VALUES (
    p_tournament_id,
    p_user_id,
    p_game_account_id,
    v_slot,
    v_status,
    NOW(),
    NOW()
  )
  RETURNING * INTO v_new_reg;

  -- Increment participant count
  UPDATE public.tournaments
  SET current_participants_count = v_slot,
      updated_at = NOW()
  WHERE id = p_tournament_id;

  RETURN QUERY SELECT v_new_reg.id, v_new_reg.slot_number, v_new_reg.status;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_tournament_slot TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_tournament_slot TO service_role;
