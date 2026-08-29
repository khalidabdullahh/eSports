-- ============================================================
-- ESPORTS TOURNAMENT PLATFORM — PRODUCTION POSTGRES SCHEMA
-- Multi-game extensible, server-authoritative, audit-logged
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
CREATE TYPE app_role AS ENUM (
  'PLAYER',
  'SUPPORT',
  'STREAM_MANAGER',
  'FINANCE_ADMIN',
  'RESULT_MANAGER',
  'REFEREE',
  'TOURNAMENT_ADMIN',
  'SUPER_ADMIN',
  'OWNER'
);

CREATE TYPE tournament_format AS ENUM (
  'SOLO',
  'DUO',
  'SQUAD',
  'LONE_WOLF',
  'CUSTOM'
);

CREATE TYPE tournament_status AS ENUM (
  'DRAFT',
  'PUBLISHED',
  'REGISTRATION_OPEN',
  'REGISTRATION_CLOSED',
  'CHECK_IN',
  'LIVE',
  'RESULT_SUBMITTED',
  'VERIFICATION',
  'DISPUTE_WINDOW',
  'FINALIZED',
  'PAYOUT_PROCESSING',
  'COMPLETED',
  'CANCELLED',
  'REFUNDING',
  'REFUNDED'
);

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

CREATE TYPE payment_status AS ENUM (
  'SUBMITTED',
  'VERIFIED',
  'REJECTED',
  'REFUNDED'
);

CREATE TYPE ledger_entry_type AS ENUM (
  'ENTRY_FEE',
  'PRIZE_LIABILITY',
  'PERFORMANCE_REWARD',
  'REFUND',
  'PAYOUT',
  'PLATFORM_FEE',
  'ADJUSTMENT'
);

CREATE TYPE ledger_direction AS ENUM (
  'CREDIT',
  'DEBIT'
);

CREATE TYPE match_status AS ENUM (
  'SCHEDULED',
  'WARMUP',
  'LIVE',
  'PAUSED',
  'ENDED',
  'CANCELLED'
);

CREATE TYPE match_event_type AS ENUM (
  'PLAYER_KILL',
  'PLAYER_ELIMINATED',
  'TEAM_ELIMINATED',
  'PLACEMENT_CONFIRMED',
  'SCORE_ADJUSTMENT',
  'MATCH_STATUS_CHANGE'
);

CREATE TYPE dispute_status AS ENUM (
  'OPEN',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'CLOSED'
);

CREATE TYPE ban_type AS ENUM (
  'WARNING',
  'DISQUALIFICATION',
  'TOURNAMENT_BAN',
  'TEMPORARY_BAN',
  'PERMANENT_BAN'
);

-- ------------------------------------------------------------
-- PROFILES (Users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  free_fire_uid VARCHAR(32) UNIQUE,
  in_game_name VARCHAR(50),
  role app_role DEFAULT 'PLAYER' NOT NULL,
  country VARCHAR(50) DEFAULT 'BD',
  phone_number VARCHAR(20),
  is_banned BOOLEAN DEFAULT FALSE NOT NULL,
  ban_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- GAMES & GAME MODES (Multi-game extensible)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS games (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  publisher VARCHAR(100) NOT NULL,
  icon_url TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS game_modes (
  id VARCHAR(50) PRIMARY KEY,
  game_id VARCHAR(50) REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  format tournament_format NOT NULL,
  default_roster_size INT DEFAULT 1 NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- TOURNAMENTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  game_id VARCHAR(50) REFERENCES games(id) NOT NULL,
  mode VARCHAR(50) NOT NULL,
  format tournament_format NOT NULL,
  status tournament_status DEFAULT 'DRAFT' NOT NULL,
  entry_fee_cents INT DEFAULT 0 NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  max_participants INT NOT NULL,
  min_participants INT DEFAULT 2 NOT NULL,
  registration_start TIMESTAMPTZ NOT NULL,
  registration_end TIMESTAMPTZ NOT NULL,
  checkin_start TIMESTAMPTZ NOT NULL,
  checkin_end TIMESTAMPTZ NOT NULL,
  match_start TIMESTAMPTZ NOT NULL,
  room_release_time TIMESTAMPTZ NOT NULL,
  dispute_window_minutes INT DEFAULT 15 NOT NULL,
  main_prize_pool_cents INT DEFAULT 0 NOT NULL,
  performance_reward_pool_cents INT DEFAULT 0 NOT NULL,
  prize_distribution_rules JSONB DEFAULT '[]'::jsonb NOT NULL,
  performance_reward_rules JSONB DEFAULT '[]'::jsonb NOT NULL,
  scoring_rules JSONB DEFAULT '{"kill_points": 1, "placement_points": {}}'::jsonb NOT NULL,
  roster_size INT DEFAULT 1 NOT NULL,
  substitute_limit INT DEFAULT 0 NOT NULL,
  stream_url TEXT,
  stream_provider VARCHAR(50),
  cancellation_policy TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT valid_participants CHECK (max_participants >= min_participants),
  CONSTRAINT positive_entry_fee CHECK (entry_fee_cents >= 0)
);

-- ------------------------------------------------------------
-- TOURNAMENT STAFF ASSIGNMENT
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tournament_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(tournament_id, user_id, role)
);

-- ------------------------------------------------------------
-- TEAMS & ROSTERS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  tag VARCHAR(10) NOT NULL,
  logo_url TEXT,
  captain_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'MEMBER' NOT NULL, -- CAPTAIN, MEMBER, SUBSTITUTE
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(team_id, user_id)
);

-- ------------------------------------------------------------
-- REGISTRATIONS & SLOTS (Atomic Allocation)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  team_id UUID REFERENCES teams(id),
  slot_number INT NOT NULL,
  status registration_status DEFAULT 'PENDING_PAYMENT' NOT NULL,
  checked_in_at TIMESTAMPTZ,
  disqualified_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(tournament_id, slot_number),
  UNIQUE(tournament_id, user_id),
  UNIQUE(tournament_id, team_id)
);

CREATE TABLE IF NOT EXISTS tournament_rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES tournament_registrations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  role VARCHAR(20) DEFAULT 'STARTER' NOT NULL,
  in_game_name VARCHAR(50) NOT NULL,
  free_fire_uid VARCHAR(32) NOT NULL,
  is_locked BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- PAYMENTS & FINANCIAL LEDGER
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) NOT NULL,
  registration_id UUID REFERENCES tournament_registrations(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  amount_cents INT NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- bkash, nagad, rocket, manual
  transaction_id VARCHAR(100) NOT NULL,
  sender_phone VARCHAR(30),
  evidence_url TEXT,
  status payment_status DEFAULT 'SUBMITTED' NOT NULL,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(tournament_id, transaction_id)
);

CREATE TABLE IF NOT EXISTS financial_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id),
  user_id UUID REFERENCES profiles(id),
  team_id UUID REFERENCES teams(id),
  type ledger_entry_type NOT NULL,
  direction ledger_direction NOT NULL,
  amount_cents INT NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  reference_type VARCHAR(50) NOT NULL, -- registration, payment, reward, payout, refund
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- ROOM CREDENTIALS (Protected)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS room_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) UNIQUE NOT NULL,
  room_id VARCHAR(100) NOT NULL,
  room_password VARCHAR(100) NOT NULL,
  release_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS room_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  ip_address VARCHAR(50),
  accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- MATCHES & REALTIME OPERATIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  match_number INT DEFAULT 1 NOT NULL,
  title VARCHAR(100) NOT NULL,
  status match_status DEFAULT 'SCHEDULED' NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES tournament_registrations(id) NOT NULL,
  user_id UUID REFERENCES profiles(id),
  team_id UUID REFERENCES teams(id),
  participant_name VARCHAR(100) NOT NULL,
  is_alive BOOLEAN DEFAULT TRUE NOT NULL,
  kills INT DEFAULT 0 NOT NULL,
  placement INT,
  placement_points INT DEFAULT 0 NOT NULL,
  kill_points INT DEFAULT 0 NOT NULL,
  total_score INT DEFAULT 0 NOT NULL,
  eliminated_at TIMESTAMPTZ,
  eliminated_by_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(match_id, registration_id)
);

CREATE TABLE IF NOT EXISTS match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) NOT NULL,
  event_type match_event_type NOT NULL,
  actor_participant_id UUID REFERENCES match_participants(id),
  target_participant_id UUID REFERENCES match_participants(id),
  quantity INT DEFAULT 1 NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  sequence_number BIGINT NOT NULL,
  correction_of_event_id UUID REFERENCES match_events(id),
  voided_at TIMESTAMPTZ,
  voided_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- RESULTS, DISPUTES & REWARDS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES match_participants(id) NOT NULL,
  final_placement INT NOT NULL,
  final_kills INT NOT NULL,
  final_points INT NOT NULL,
  evidence_url TEXT,
  submitted_by UUID REFERENCES profiles(id) NOT NULL,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  finalized_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(match_id, participant_id)
);

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) NOT NULL,
  match_id UUID REFERENCES matches(id) NOT NULL,
  reporter_id UUID REFERENCES profiles(id) NOT NULL,
  target_participant_id UUID REFERENCES match_participants(id),
  reason VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  evidence_url TEXT NOT NULL,
  status dispute_status DEFAULT 'OPEN' NOT NULL,
  reviewed_by UUID REFERENCES profiles(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) NOT NULL,
  recipient_user_id UUID REFERENCES profiles(id),
  recipient_team_id UUID REFERENCES teams(id),
  reward_type VARCHAR(50) NOT NULL, -- MAIN_PRIZE, PERFORMANCE_BONUS
  placement INT,
  amount_cents INT NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  reason TEXT NOT NULL,
  calculation_snapshot JSONB NOT NULL,
  is_payout_processed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID REFERENCES rewards(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  amount_cents INT NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  payout_method VARCHAR(50) NOT NULL, -- bkash, nagad, bank
  account_number VARCHAR(50) NOT NULL,
  transaction_reference VARCHAR(100),
  status VARCHAR(30) DEFAULT 'PENDING' NOT NULL,
  processed_by UUID REFERENCES profiles(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- REPORTS, BANS & AUDIT LOGS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id),
  reporter_id UUID REFERENCES profiles(id) NOT NULL,
  target_user_id UUID REFERENCES profiles(id) NOT NULL,
  target_uid VARCHAR(32),
  violation_type VARCHAR(50) NOT NULL, -- CHEATING, TEAMING, EMULATOR, TOXICITY
  description TEXT NOT NULL,
  evidence_url TEXT,
  status VARCHAR(30) DEFAULT 'PENDING' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  free_fire_uid VARCHAR(32),
  ban_type ban_type NOT NULL,
  reason TEXT NOT NULL,
  issued_by UUID REFERENCES profiles(id) NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES profiles(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  before_state JSONB,
  after_state JSONB,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'GENERAL' NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_game_id ON tournaments(game_id);
CREATE INDEX IF NOT EXISTS idx_registrations_tournament ON tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON tournament_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_match_events_match_seq ON match_events(match_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_ledger_tournament ON financial_ledger(tournament_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
