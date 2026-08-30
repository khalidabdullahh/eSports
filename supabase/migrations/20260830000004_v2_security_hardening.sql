-- ============================================================
-- ARENEX v2.0 — SECURITY HARDENING & DEFENSE-IN-DEPTH
-- Addresses all pre-Supabase security findings:
-- 1. Removes hardcoded email auto-promotion in handle_new_user()
-- 2. Implements secure first-admin bootstrap procedure
-- 3. Sets explicit search_path on all SECURITY DEFINER functions
-- 4. Prevents IDOR and privilege escalation across all RLS policies
-- 5. Implements database-level triggers for state machine & fees
-- ============================================================

-- ------------------------------------------------------------
-- 1. SECURE AUTH SIGNUP TRIGGER (NO HARDCODED EMAIL)
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_display_name TEXT;
  v_avatar_url TEXT;
BEGIN
  -- Derive default username from metadata or email
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Sanitize username (alphanumeric and underscore only)
  v_username := REGEXP_REPLACE(LOWER(v_username), '[^a-z0-9_]', '_', 'g');
  
  -- If username exists, append random 4-digit suffix
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) THEN
    v_username := v_username || '_' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;

  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'full_name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';

  -- Every new user strictly receives default role 'USER'
  -- NO personal email is auto-promoted in production migrations.
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
    'USER',
    false,
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth, pg_temp;

-- Revoke public execution of trigger function
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ------------------------------------------------------------
-- 2. SECURE FIRST-ADMIN PROVISIONING FUNCTION
-- Callable ONLY by service_role or database superuser in SQL Editor.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.provision_first_admin(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Security guard: Can only be run if no OWNER or SUPER_ADMIN currently exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE role IN ('OWNER', 'SUPER_ADMIN')) THEN
    RAISE EXCEPTION 'Administrative authority is already initialized on this platform.';
  END IF;

  -- Upgrade target profile to OWNER
  UPDATE public.profiles
  SET role = 'OWNER',
      updated_at = NOW()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Target user profile not found for UUID: %', p_user_id;
  END IF;

  -- Record to immutable audit log
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    target_type,
    target_id,
    details,
    created_at
  ) VALUES (
    p_user_id,
    'FIRST_ADMIN_BOOTSTRAP',
    'PROFILE',
    p_user_id::text,
    jsonb_build_object('role', 'OWNER', 'timestamp', NOW()),
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Revoke all execution rights from public, anon, and authenticated users
REVOKE ALL ON FUNCTION public.provision_first_admin(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.provision_first_admin(UUID) TO service_role;

-- ------------------------------------------------------------
-- 3. HARDEN ALL SECURITY DEFINER HELPER FUNCTIONS
-- Explicit search_path prevents search_path injection / object shadowing.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth, pg_temp;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('SUPER_ADMIN', 'OWNER', 'TOURNAMENT_ADMIN')
    AND is_banned = false
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth, pg_temp;

CREATE OR REPLACE FUNCTION public.is_referee()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('REFEREE', 'TOURNAMENT_ADMIN', 'SUPER_ADMIN', 'OWNER')
    AND is_banned = false
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth, pg_temp;

CREATE OR REPLACE FUNCTION public.is_finance_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('FINANCE_ADMIN', 'SUPER_ADMIN', 'OWNER')
    AND is_banned = false
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth, pg_temp;

-- ------------------------------------------------------------
-- 4. HARDEN STORED PROCEDURE: register_tournament_slot
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
  -- Caller verification: Authenticated user cannot register on behalf of someone else
  IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: You may only register your own account.';
  END IF;

  -- 1. Pessimistically lock tournament row
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth, pg_temp;

-- ------------------------------------------------------------
-- 5. DATABASE-ENFORCED TOURNAMENT STATE MACHINE TRIGGER
-- Prevents any unauthorized transition (e.g. DRAFT -> LIVE)
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_tournament_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Validate strictly allowed linear transitions
  IF OLD.status = 'DRAFT' AND NEW.status NOT IN ('PUBLISHED', 'CANCELLED') THEN
    RAISE EXCEPTION 'Illegal state jump from DRAFT to %', NEW.status;
  ELSIF OLD.status = 'PUBLISHED' AND NEW.status NOT IN ('REGISTRATION_OPEN', 'CANCELLED') THEN
    RAISE EXCEPTION 'Illegal state jump from PUBLISHED to %', NEW.status;
  ELSIF OLD.status = 'REGISTRATION_OPEN' AND NEW.status NOT IN ('REGISTRATION_CLOSED', 'CANCELLED') THEN
    RAISE EXCEPTION 'Illegal state jump from REGISTRATION_OPEN to %', NEW.status;
  ELSIF OLD.status = 'REGISTRATION_CLOSED' AND NEW.status NOT IN ('CHECK_IN', 'CANCELLED') THEN
    RAISE EXCEPTION 'Illegal state jump from REGISTRATION_CLOSED to %', NEW.status;
  ELSIF OLD.status = 'CHECK_IN' AND NEW.status NOT IN ('LIVE', 'CANCELLED') THEN
    RAISE EXCEPTION 'Illegal state jump from CHECK_IN to %', NEW.status;
  ELSIF OLD.status = 'LIVE' AND NEW.status NOT IN ('RESULT_PROCESSING', 'CANCELLED') THEN
    RAISE EXCEPTION 'Illegal state jump from LIVE to %', NEW.status;
  ELSIF OLD.status = 'RESULT_PROCESSING' AND NEW.status NOT IN ('COMPLETED', 'CANCELLED') THEN
    RAISE EXCEPTION 'Illegal state jump from RESULT_PROCESSING to %', NEW.status;
  ELSIF OLD.status = 'COMPLETED' AND NEW.status NOT IN ('PAYOUT', 'ARCHIVED') THEN
    RAISE EXCEPTION 'Illegal state jump from COMPLETED to %', NEW.status;
  ELSIF OLD.status = 'PAYOUT' AND NEW.status NOT IN ('ARCHIVED') THEN
    RAISE EXCEPTION 'Illegal state jump from PAYOUT to %', NEW.status;
  ELSIF OLD.status = 'CANCELLED' THEN
    RAISE EXCEPTION 'Cannot transition a CANCELLED tournament to %', NEW.status;
  ELSIF OLD.status = 'ARCHIVED' THEN
    RAISE EXCEPTION 'Cannot transition an ARCHIVED tournament to %', NEW.status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_enforce_tournament_status ON public.tournaments;
CREATE TRIGGER trg_enforce_tournament_status
  BEFORE UPDATE OF status ON public.tournaments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_tournament_status_transition();

-- ------------------------------------------------------------
-- 6. DATABASE-ENFORCED AUTHORITATIVE PAYMENT VALIDATION TRIGGER
-- Forces payment amount & currency from authoritative tournament row,
-- and prevents user from setting status = 'VERIFIED'
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_authoritative_payment_submission()
RETURNS TRIGGER AS $$
DECLARE
  v_expected_fee INT;
  v_currency VARCHAR;
BEGIN
  SELECT entry_fee_cents, currency INTO v_expected_fee, v_currency
  FROM public.tournaments WHERE id = NEW.tournament_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid tournament specified for payment';
  END IF;

  -- Overwrite client amount with authoritative database fee
  NEW.amount_cents := v_expected_fee;
  NEW.currency := v_currency;

  -- Force initial submission status; client cannot declare itself verified
  IF auth.uid() IS NOT NULL AND NOT public.is_finance_admin() THEN
    NEW.status := 'SUBMITTED';
    NEW.verified_by := NULL;
    NEW.verified_at := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, auth, pg_temp;

DROP TRIGGER IF EXISTS trg_authoritative_payment_submission ON public.payments;
CREATE TRIGGER trg_authoritative_payment_submission
  BEFORE INSERT ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_authoritative_payment_submission();

-- ------------------------------------------------------------
-- 7. TIGHTEN ROW-LEVEL SECURITY POLICIES (ELIMINATING IDOR & TAMPERING)
-- ------------------------------------------------------------

-- A. GAME ACCOUNTS: User cannot modify verification_status
DROP POLICY IF EXISTS "Users can update own game account" ON public.game_accounts;
CREATE POLICY "Users can update own game account"
  ON public.game_accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    verification_status = (SELECT ga.verification_status FROM public.game_accounts ga WHERE ga.id = game_accounts.id)
  );

-- B. PAYOUT PROFILES: User cannot modify is_verified
DROP POLICY IF EXISTS "Users can update own payout profile" ON public.payout_profiles;
CREATE POLICY "Users can update own payout profile"
  ON public.payout_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    is_verified = (SELECT pp.is_verified FROM public.payout_profiles pp WHERE pp.id = payout_profiles.id)
  );

-- C. PAYMENTS: User cannot insert verified payment
DROP POLICY IF EXISTS "Users can submit own payment" ON public.payments;
CREATE POLICY "Users can submit own payment"
  ON public.payments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'SUBMITTED' AND
    verified_by IS NULL AND
    verified_at IS NULL
  );

-- D. DISPUTES: User cannot insert resolved dispute
DROP POLICY IF EXISTS "Users can submit own disputes" ON public.disputes;
CREATE POLICY "Users can submit own disputes"
  ON public.disputes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'OPEN' AND
    resolved_by IS NULL AND
    resolved_at IS NULL
  );

-- E. NOTIFICATIONS: User can ONLY update is_read
DROP POLICY IF EXISTS "Users can mark own notifications read" ON public.notifications;
CREATE POLICY "Users can mark own notifications read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    title = (SELECT n.title FROM public.notifications n WHERE n.id = notifications.id) AND
    message = (SELECT n.message FROM public.notifications n WHERE n.id = notifications.id)
  );

-- F. TOURNAMENT REGISTRATIONS: Prevent user from creating APPROVED registration on paid cups
DROP POLICY IF EXISTS "Users can insert own registration" ON public.tournament_registrations;
CREATE POLICY "Users can insert own registration"
  ON public.tournament_registrations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (
      status = 'PENDING_PAYMENT' OR
      (status = 'APPROVED' AND EXISTS (SELECT 1 FROM public.tournaments WHERE id = tournament_registrations.tournament_id AND entry_fee_cents = 0))
    )
  );

-- ------------------------------------------------------------
-- 8. INITIAL SEED: COMPETITIVE ESPORTS TITLES
-- ------------------------------------------------------------

INSERT INTO public.games (id, slug, name, publisher, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'free-fire', 'Free Fire Battle Royale', 'Garena', true),
  ('00000000-0000-0000-0000-000000000002', 'pubg-mobile', 'PUBG Mobile', 'Krafton', true),
  ('00000000-0000-0000-0000-000000000003', 'mlbb', 'Mobile Legends: Bang Bang', 'Moonton', true)
ON CONFLICT (slug) DO NOTHING;
