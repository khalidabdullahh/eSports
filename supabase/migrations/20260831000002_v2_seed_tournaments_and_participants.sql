-- ============================================================
-- ARENEX v2.0 — SEED TOURNAMENTS, RULES & STORAGE BUCKET
-- Idempotent Migration: Safe to execute multiple times
-- ============================================================

-- 1. Ensure public 'avatars' storage bucket exists
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

-- 2. Storage RLS Policies for avatars
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

-- 3. Seed Standard Production Tournaments
-- Tournament 1: Dhaka Night Battle — Free Fire Solo Cup (Paid Cup)
INSERT INTO public.tournaments (
  id,
  slug,
  title,
  game_id,
  format,
  mode,
  description,
  entry_fee_cents,
  main_prize_pool_cents,
  performance_reward_pool_cents,
  currency,
  max_participants,
  current_participants_count,
  registration_open_at,
  registration_close_at,
  scheduled_start_at,
  status,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'dhaka-night-battle-solo',
  'Dhaka Night Battle — Solo Cup',
  '00000000-0000-0000-0000-000000000001',
  'SOLO',
  'Battle Royale — Bermuda',
  'High-stakes solo competitive cup with instant bKash disbursements. 48 warriors compete for the podium crown and top fragger performance bonus.',
  5000,   -- ৳50.00 entry ticket
  150000, -- ৳1,500.00 main prize pool
  50000,  -- ৳500.00 top-fragger bounty pool
  'BDT',
  48,
  0,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '3 days 2 hours',
  'REGISTRATION_OPEN',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  status = 'REGISTRATION_OPEN',
  entry_fee_cents = 5000,
  main_prize_pool_cents = 150000;

-- Rules for Tournament 1
INSERT INTO public.tournament_rules (
  tournament_id,
  kill_points,
  placement_points,
  prize_distribution,
  performance_rules,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  1,
  '{"1": 12, "2": 9, "3": 8, "4": 7, "5": 6, "6": 5, "7": 4, "8": 3, "9": 2, "10": 1}'::jsonb,
  '[{"place": 1, "amount_cents": 80000, "label": "1st Place (Champion)"}, {"place": 2, "amount_cents": 45000, "label": "2nd Place (Runner-up)"}, {"place": 3, "amount_cents": 25000, "label": "3rd Place"}]'::jsonb,
  '[{"type": "TOP_FRAGGER", "amount_cents": 50000, "description": "Highest kill record in finals"}]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (tournament_id) DO NOTHING;

-- Room Credential for Tournament 1
INSERT INTO public.room_credentials (
  tournament_id,
  room_name,
  room_password,
  release_at,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'ARENEX-ROOM-771',
  'NIGHT#BATTLE99',
  NOW() + INTERVAL '3 days 1 hour',
  NOW(),
  NOW()
) ON CONFLICT (tournament_id) DO NOTHING;

-- Tournament 2: Free Fire Open Rookie Series (Free Entry Cup)
INSERT INTO public.tournaments (
  id,
  slug,
  title,
  game_id,
  format,
  mode,
  description,
  entry_fee_cents,
  main_prize_pool_cents,
  performance_reward_pool_cents,
  currency,
  max_participants,
  current_participants_count,
  registration_open_at,
  registration_close_at,
  scheduled_start_at,
  status,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'ff-rookie-series-free',
  'ARENEX Free Fire Rookie Championship',
  '00000000-0000-0000-0000-000000000001',
  'SOLO',
  'Battle Royale — Purgatory',
  'Free entry grassroots qualifier cup designed to discover rising Bangladeshi talents with official referee telemetry.',
  0,      -- Free entry
  50000,  -- ৳500.00 prize pool
  10000,  -- ৳100.00 performance bounty
  'BDT',
  48,
  0,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '5 days 1 hour',
  'REGISTRATION_OPEN',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  status = 'REGISTRATION_OPEN',
  entry_fee_cents = 0,
  main_prize_pool_cents = 50000;

-- Rules for Tournament 2
INSERT INTO public.tournament_rules (
  tournament_id,
  kill_points,
  placement_points,
  prize_distribution,
  performance_rules,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000002',
  1,
  '{"1": 12, "2": 9, "3": 8, "4": 7, "5": 6, "6": 5, "7": 4, "8": 3, "9": 2, "10": 1}'::jsonb,
  '[{"place": 1, "amount_cents": 35000, "label": "1st Place (Champion)"}, {"place": 2, "amount_cents": 15000, "label": "2nd Place"}]'::jsonb,
  '[{"type": "TOP_FRAGGER", "amount_cents": 10000, "description": "Top fragger award"}]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (tournament_id) DO NOTHING;

-- Room Credential for Tournament 2
INSERT INTO public.room_credentials (
  tournament_id,
  room_name,
  room_password,
  release_at,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'ARENEX-ROOKIE-002',
  'ROOKIE@FF2026',
  NOW() + INTERVAL '5 days',
  NOW(),
  NOW()
) ON CONFLICT (tournament_id) DO NOTHING;
