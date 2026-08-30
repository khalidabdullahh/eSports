-- ============================================================
-- ARENEX v2.0 — PRODUCTION DATABASE ARCHITECTURE
-- Production PostgreSQL Relational Schema for Supabase
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE app_role AS ENUM (
    'USER',
    'PLAYER',
    'MODERATOR',
    'REFEREE',
    'FINANCE_ADMIN',
    'TOURNAMENT_ADMIN',
    'SUPER_ADMIN',
    'OWNER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE tournament_format AS ENUM (
    'SOLO',
    'DUO',
    'SQUAD',
    'LONE_WOLF',
    'CUSTOM'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE tournament_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'REGISTRATION_OPEN',
    'REGISTRATION_CLOSED',
    'CHECK_IN',
    'LIVE',
    'RESULT_PROCESSING',
    'COMPLETED',
    'PAYOUT',
    'ARCHIVED',
    'CANCELLED',
    'POSTPONED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE registration_status AS ENUM (
    'PENDING_PAYMENT',
    'PAYMENT_SUBMITTED',
    'PAYMENT_VERIFIED',
    'APPROVED',
    'CHECKED_IN',
    'DISQUALIFIED',
    'CANCELLED',
    'REFUNDED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'SUBMITTED',
    'VERIFIED',
    'REJECTED',
    'REFUNDED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ledger_entry_type AS ENUM (
    'ENTRY_FEE',
    'PRIZE_LIABILITY',
    'PERFORMANCE_REWARD',
    'REFUND',
    'PAYOUT',
    'PLATFORM_FEE',
    'ADJUSTMENT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ledger_direction AS ENUM (
    'CREDIT',
    'DEBIT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE match_status AS ENUM (
    'SCHEDULED',
    'CHECK_IN',
    'LIVE',
    'COMPLETED',
    'CANCELLED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE match_event_type AS ENUM (
    'PLAYER_KILL',
    'PLAYER_ELIMINATED',
    'TEAM_ELIMINATED',
    'PLACEMENT_CONFIRMED',
    'SCORE_ADJUSTMENT',
    'MATCH_STATUS_CHANGE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE dispute_status AS ENUM (
    'OPEN',
    'UNDER_REVIEW',
    'RESOLVED',
    'REJECTED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payout_method_type AS ENUM (
    'bkash',
    'nagad',
    'rocket'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------
-- 2. CORE IDENTITY: PROFILES (1:1 with auth.users)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(40) UNIQUE NOT NULL,
  display_name VARCHAR(80) NOT NULL,
  avatar_url TEXT,
  phone_number VARCHAR(20),
  country VARCHAR(4) DEFAULT 'BD',
  role app_role DEFAULT 'USER' NOT NULL,
  profile_completion_status BOOLEAN DEFAULT false NOT NULL,
  is_banned BOOLEAN DEFAULT false NOT NULL,
  ban_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- 3. MULTI-GAME EXTENSIBILITY: GAMES & GAME ACCOUNTS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  publisher VARCHAR(100),
  logo_url TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.game_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE RESTRICT,
  game_uid VARCHAR(60) NOT NULL,
  in_game_name VARCHAR(80) NOT NULL,
  platform VARCHAR(40) DEFAULT 'MOBILE' NOT NULL,
  verification_status VARCHAR(30) DEFAULT 'UNVERIFIED' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_user_game_account UNIQUE(user_id, game_id, game_uid)
);

-- ------------------------------------------------------------
-- 4. BANGLADESH-FOCUSED PAYOUT METHODS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payout_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payout_method payout_method_type DEFAULT 'bkash' NOT NULL,
  payout_number VARCHAR(20) NOT NULL,
  account_holder_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_user_payout_number UNIQUE(user_id, payout_method, payout_number)
);

-- ------------------------------------------------------------
-- 5. TOURNAMENTS & RULES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) UNIQUE NOT NULL,
  title VARCHAR(180) NOT NULL,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE RESTRICT,
  format tournament_format DEFAULT 'SOLO' NOT NULL,
  mode VARCHAR(80) NOT NULL, -- e.g. "Battle Royale Solo (Bermuda)"
  description TEXT,
  banner_url TEXT,
  entry_fee_cents INT DEFAULT 0 NOT NULL CHECK (entry_fee_cents >= 0),
  main_prize_pool_cents INT DEFAULT 0 NOT NULL CHECK (main_prize_pool_cents >= 0),
  performance_reward_pool_cents INT DEFAULT 0 NOT NULL CHECK (performance_reward_pool_cents >= 0),
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  max_participants INT NOT NULL CHECK (max_participants > 0),
  current_participants_count INT DEFAULT 0 NOT NULL CHECK (current_participants_count >= 0),
  registration_open_at TIMESTAMPTZ NOT NULL,
  registration_close_at TIMESTAMPTZ NOT NULL,
  scheduled_start_at TIMESTAMPTZ NOT NULL,
  status tournament_status DEFAULT 'DRAFT' NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT chk_registration_window CHECK (registration_close_at > registration_open_at),
  CONSTRAINT chk_tournament_start CHECK (scheduled_start_at >= registration_close_at)
);

CREATE TABLE IF NOT EXISTS public.tournament_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID UNIQUE NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  kill_points INT DEFAULT 1 NOT NULL,
  placement_points JSONB NOT NULL, -- {"1": 12, "2": 9, "3": 8, ...}
  prize_distribution JSONB NOT NULL, -- [{"place": 1, "amount_cents": 70000}, ...]
  performance_rules JSONB DEFAULT '[]'::jsonb NOT NULL,
  custom_rules TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- 6. REGISTRATIONS & PAYMENTS (Concurrency-Protected)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_account_id UUID REFERENCES public.game_accounts(id) ON DELETE RESTRICT,
  slot_number INT NOT NULL CHECK (slot_number > 0),
  status registration_status DEFAULT 'PENDING_PAYMENT' NOT NULL,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_tournament_user UNIQUE(tournament_id, user_id),
  CONSTRAINT uq_tournament_slot UNIQUE(tournament_id, slot_number)
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES public.tournament_registrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents INT NOT NULL CHECK (amount_cents >= 0),
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  payment_method VARCHAR(30) DEFAULT 'bkash' NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  sender_phone VARCHAR(20),
  evidence_url TEXT,
  status payment_status DEFAULT 'SUBMITTED' NOT NULL,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- 7. DOUBLE-ENTRY FINANCIAL LEDGER (Immutable)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.financial_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  type ledger_entry_type NOT NULL,
  direction ledger_direction NOT NULL,
  amount_cents INT NOT NULL CHECK (amount_cents > 0),
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  account_reference VARCHAR(100),
  description TEXT NOT NULL,
  recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- 8. CRYPTOGRAPHIC ROOM CREDENTIALS GATE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.room_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID UNIQUE NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  room_name VARCHAR(100) NOT NULL,
  room_password VARCHAR(100) NOT NULL,
  release_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- 9. MATCHES, PARTICIPANTS & REAL-TIME TELEMETRY
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round INT DEFAULT 1 NOT NULL,
  status match_status DEFAULT 'SCHEDULED' NOT NULL,
  scheduled_start_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES public.tournament_registrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kills INT DEFAULT 0 NOT NULL CHECK (kills >= 0),
  placement INT CHECK (placement > 0),
  placement_points INT DEFAULT 0 NOT NULL,
  kill_points INT DEFAULT 0 NOT NULL,
  total_score INT DEFAULT 0 NOT NULL,
  is_alive BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_match_participant UNIQUE(match_id, registration_id)
);

CREATE TABLE IF NOT EXISTS public.match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  event_type match_event_type NOT NULL,
  actor_participant_id UUID REFERENCES public.match_participants(id) ON DELETE SET NULL,
  target_participant_id UUID REFERENCES public.match_participants(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.match_participants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  final_placement INT NOT NULL CHECK (final_placement > 0),
  final_kills INT NOT NULL CHECK (final_kills >= 0),
  placement_points INT NOT NULL,
  kill_points INT NOT NULL,
  total_score INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_match_result UNIQUE(match_id, user_id)
);

-- ------------------------------------------------------------
-- 10. DETERMINISTIC REWARDS & PAYOUTS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  recipient_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_type VARCHAR(40) NOT NULL, -- 'MAIN_PRIZE' or 'PERFORMANCE_BONUS'
  placement INT,
  amount_cents INT NOT NULL CHECK (amount_cents > 0),
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  reason VARCHAR(200) NOT NULL,
  calculation_snapshot JSONB NOT NULL,
  status VARCHAR(30) DEFAULT 'UNCLAIMED' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID UNIQUE NOT NULL REFERENCES public.rewards(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents INT NOT NULL CHECK (amount_cents > 0),
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  payout_method VARCHAR(30) DEFAULT 'bkash' NOT NULL,
  account_number VARCHAR(30) NOT NULL,
  transaction_reference VARCHAR(100),
  status VARCHAR(30) DEFAULT 'PROCESSING' NOT NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- 11. DISPUTES, NOTIFICATIONS & AUDIT LOGS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category VARCHAR(60) NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}' NOT NULL,
  status dispute_status DEFAULT 'OPEN' NOT NULL,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(40) NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(80) NOT NULL,
  target_type VARCHAR(60) NOT NULL,
  target_id VARCHAR(80) NOT NULL,
  details JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- 12. PERFORMANCE INDEXES
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_scheduled ON public.tournaments(scheduled_start_at);
CREATE INDEX IF NOT EXISTS idx_registrations_tournament ON public.tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON public.tournament_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_tournament ON public.payments(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON public.matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_match_events_match ON public.match_events(match_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_rewards_user ON public.rewards(recipient_user_id);

-- ------------------------------------------------------------
-- 13. TRIGGERS: AUTOMATIC PROFILE ON AUTH SIGNUP
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_display_name TEXT;
  v_avatar_url TEXT;
  v_role app_role := 'USER';
BEGIN
  -- Derive default username and display name from user metadata or email
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Sanitize username (alphanumeric and underscore only)
  v_username := REGEXP_REPLACE(LOWER(v_username), '[^a-z0-9_]', '_', 'g');
  
  -- If username already exists, append random 4-digit suffix
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) THEN
    v_username := v_username || '_' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;

  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'full_name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';

  -- Automatically grant OWNER to Khalid Abdullah if signing up with designated email
  IF LOWER(NEW.email) = 'khalid@admin.com' THEN
    v_role := 'OWNER';
  END IF;

  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    role,
    profile_completion_status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_username,
    v_display_name,
    v_avatar_url,
    v_role,
    false,
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------
-- 14. STORED PROCEDURE: CONCURRENCY-SAFE TOURNAMENT REGISTRATION
-- Uses pessimistic row-level locking (SELECT ... FOR UPDATE)
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.register_tournament_slot(
  p_tournament_id UUID,
  p_user_id UUID,
  p_game_account_id UUID DEFAULT NULL
)
RETURNS TABLE (
  registration_id UUID,
  slot_number INT,
  status registration_status
) AS $$
DECLARE
  v_tournament RECORD;
  v_existing_reg UUID;
  v_next_slot INT;
  v_new_reg_id UUID;
  v_new_status registration_status;
BEGIN
  -- 1. Pessimistically lock the tournament row to prevent concurrent capacity oversubscription
  SELECT id, max_participants, current_participants_count, status, entry_fee_cents
  INTO v_tournament
  FROM public.tournaments
  WHERE id = p_tournament_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tournament not found';
  END IF;

  IF v_tournament.status != 'REGISTRATION_OPEN' THEN
    RAISE EXCEPTION 'Registration is not open for this tournament (Current status: %)', v_tournament.status;
  END IF;

  IF v_tournament.current_participants_count >= v_tournament.max_participants THEN
    RAISE EXCEPTION 'Tournament has reached maximum capacity of % participants', v_tournament.max_participants;
  END IF;

  -- 2. Check if user is already registered
  SELECT id INTO v_existing_reg
  FROM public.tournament_registrations
  WHERE tournament_id = p_tournament_id AND user_id = p_user_id;

  IF FOUND THEN
    RAISE EXCEPTION 'You are already registered for this tournament';
  END IF;

  -- 3. Calculate next available slot
  SELECT COALESCE(MAX(r.slot_number), 0) + 1 INTO v_next_slot
  FROM public.tournament_registrations r
  WHERE r.tournament_id = p_tournament_id;

  IF v_next_slot > v_tournament.max_participants THEN
    RAISE EXCEPTION 'No available slots remaining in this arena';
  END IF;

  -- 4. Set initial status based on fee (Free cup = APPROVED, Paid cup = PENDING_PAYMENT)
  IF v_tournament.entry_fee_cents = 0 THEN
    v_new_status := 'APPROVED';
  ELSE
    v_new_status := 'PENDING_PAYMENT';
  END IF;

  -- 5. Insert registration
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
    v_next_slot,
    v_new_status,
    NOW(),
    NOW()
  ) RETURNING id INTO v_new_reg_id;

  -- 6. Atomically update tournament participant count
  UPDATE public.tournaments
  SET current_participants_count = current_participants_count + 1,
      updated_at = NOW()
  WHERE id = p_tournament_id;

  RETURN QUERY SELECT v_new_reg_id, v_next_slot, v_new_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
