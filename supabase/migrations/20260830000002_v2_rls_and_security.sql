-- ============================================================
-- ARENEX v2.0 — ROW-LEVEL SECURITY & ACCESS POLICIES
-- Zero-trust object protection and RBAC enforcement
-- ============================================================

-- ------------------------------------------------------------
-- 1. ENABLE RLS ON ALL RELATIONAL TABLES
-- ------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 2. SECURITY DEFINER HELPER FUNCTIONS (RBAC)
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('SUPER_ADMIN', 'OWNER', 'TOURNAMENT_ADMIN')
    AND is_banned = false
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_referee()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('REFEREE', 'TOURNAMENT_ADMIN', 'SUPER_ADMIN', 'OWNER')
    AND is_banned = false
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_finance_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('FINANCE_ADMIN', 'SUPER_ADMIN', 'OWNER')
    AND is_banned = false
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------
-- 3. PROFILES POLICIES
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent users from escalating their own role or unbanning themselves
    role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND
    is_banned = (SELECT is_banned FROM public.profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 4. GAMES & GAME ACCOUNTS POLICIES
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Games are readable by everyone" ON public.games;
CREATE POLICY "Games are readable by everyone"
  ON public.games FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage games" ON public.games;
CREATE POLICY "Admins can manage games"
  ON public.games FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Game accounts are readable by everyone" ON public.game_accounts;
CREATE POLICY "Game accounts are readable by everyone"
  ON public.game_accounts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own game account" ON public.game_accounts;
CREATE POLICY "Users can insert own game account"
  ON public.game_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own game account" ON public.game_accounts;
CREATE POLICY "Users can update own game account"
  ON public.game_accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own game account" ON public.game_accounts;
CREATE POLICY "Users can delete own game account"
  ON public.game_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 5. PAYOUT PROFILES (STRICTLY PRIVATE)
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Users can read own payout profile" ON public.payout_profiles;
CREATE POLICY "Users can read own payout profile"
  ON public.payout_profiles FOR SELECT
  USING (auth.uid() = user_id OR public.is_finance_admin());

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
-- 6. TOURNAMENTS & RULES
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Published tournaments are readable by everyone" ON public.tournaments;
CREATE POLICY "Published tournaments are readable by everyone"
  ON public.tournaments FOR SELECT
  USING (status != 'DRAFT' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage tournaments" ON public.tournaments;
CREATE POLICY "Admins can manage tournaments"
  ON public.tournaments FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Tournament rules are readable by everyone" ON public.tournament_rules;
CREATE POLICY "Tournament rules are readable by everyone"
  ON public.tournament_rules FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage tournament rules" ON public.tournament_rules;
CREATE POLICY "Admins can manage tournament rules"
  ON public.tournament_rules FOR ALL
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 7. REGISTRATIONS & PAYMENTS
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Users can read own registration or public approved count" ON public.tournament_registrations;
CREATE POLICY "Users can read own registration or public approved count"
  ON public.tournament_registrations FOR SELECT
  USING (
    auth.uid() = user_id OR 
    status IN ('APPROVED', 'CHECKED_IN') OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Users can insert own registration" ON public.tournament_registrations;
CREATE POLICY "Users can insert own registration"
  ON public.tournament_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage registrations" ON public.tournament_registrations;
CREATE POLICY "Admins can manage registrations"
  ON public.tournament_registrations FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can read own payments" ON public.payments;
CREATE POLICY "Users can read own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR public.is_finance_admin());

DROP POLICY IF EXISTS "Users can submit own payment" ON public.payments;
CREATE POLICY "Users can submit own payment"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Finance admins can update payment status" ON public.payments;
CREATE POLICY "Finance admins can update payment status"
  ON public.payments FOR UPDATE
  USING (public.is_finance_admin());

-- ------------------------------------------------------------
-- 8. FINANCIAL LEDGER (FINANCE ADMIN & SYSTEM ONLY)
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Finance admins can view financial ledger" ON public.financial_ledger;
CREATE POLICY "Finance admins can view financial ledger"
  ON public.financial_ledger FOR SELECT
  USING (public.is_finance_admin());

DROP POLICY IF EXISTS "Finance admins can insert financial ledger" ON public.financial_ledger;
CREATE POLICY "Finance admins can insert financial ledger"
  ON public.financial_ledger FOR INSERT
  WITH CHECK (public.is_finance_admin());

-- ------------------------------------------------------------
-- 9. ROOM CREDENTIALS (CRYPTOGRAPHIC TIME GATE)
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Checked-in players can view room keys when released" ON public.room_credentials;
CREATE POLICY "Checked-in players can view room keys when released"
  ON public.room_credentials FOR SELECT
  USING (
    public.is_admin() OR (
      NOW() >= release_at AND EXISTS (
        SELECT 1 FROM public.tournament_registrations
        WHERE tournament_id = room_credentials.tournament_id
        AND user_id = auth.uid()
        AND status = 'CHECKED_IN'
      )
    )
  );

DROP POLICY IF EXISTS "Admins can manage room credentials" ON public.room_credentials;
CREATE POLICY "Admins can manage room credentials"
  ON public.room_credentials FOR ALL
  USING (public.is_admin());

-- ------------------------------------------------------------
-- 10. MATCHES, PARTICIPANTS, EVENTS & RESULTS
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Matches are readable by everyone" ON public.matches;
CREATE POLICY "Matches are readable by everyone"
  ON public.matches FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Referees and admins can manage matches" ON public.matches;
CREATE POLICY "Referees and admins can manage matches"
  ON public.matches FOR ALL
  USING (public.is_referee());

DROP POLICY IF EXISTS "Match participants are readable by everyone" ON public.match_participants;
CREATE POLICY "Match participants are readable by everyone"
  ON public.match_participants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Referees and admins can manage match participants" ON public.match_participants;
CREATE POLICY "Referees and admins can manage match participants"
  ON public.match_participants FOR ALL
  USING (public.is_referee());

DROP POLICY IF EXISTS "Match events are readable by everyone" ON public.match_events;
CREATE POLICY "Match events are readable by everyone"
  ON public.match_events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Referees and admins can insert match events" ON public.match_events;
CREATE POLICY "Referees and admins can insert match events"
  ON public.match_events FOR INSERT
  WITH CHECK (public.is_referee());

DROP POLICY IF EXISTS "Match results are readable by everyone" ON public.match_results;
CREATE POLICY "Match results are readable by everyone"
  ON public.match_results FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Referees and admins can manage match results" ON public.match_results;
CREATE POLICY "Referees and admins can manage match results"
  ON public.match_results FOR ALL
  USING (public.is_referee());

-- ------------------------------------------------------------
-- 11. REWARDS & PAYOUTS
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Rewards are readable by recipient or admin" ON public.rewards;
CREATE POLICY "Rewards are readable by recipient or admin"
  ON public.rewards FOR SELECT
  USING (auth.uid() = recipient_user_id OR public.is_finance_admin());

DROP POLICY IF EXISTS "Finance admins can manage rewards" ON public.rewards;
CREATE POLICY "Finance admins can manage rewards"
  ON public.rewards FOR ALL
  USING (public.is_finance_admin());

DROP POLICY IF EXISTS "Payouts are readable by user or finance admin" ON public.payouts;
CREATE POLICY "Payouts are readable by user or finance admin"
  ON public.payouts FOR SELECT
  USING (auth.uid() = user_id OR public.is_finance_admin());

DROP POLICY IF EXISTS "Finance admins can manage payouts" ON public.payouts;
CREATE POLICY "Finance admins can manage payouts"
  ON public.payouts FOR ALL
  USING (public.is_finance_admin());

-- ------------------------------------------------------------
-- 12. DISPUTES, NOTIFICATIONS & AUDIT LOGS
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Users can read own disputes or admin" ON public.disputes;
CREATE POLICY "Users can read own disputes or admin"
  ON public.disputes FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can submit own disputes" ON public.disputes;
CREATE POLICY "Users can submit own disputes"
  ON public.disputes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can resolve disputes" ON public.disputes;
CREATE POLICY "Admins can resolve disputes"
  ON public.disputes FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark own notifications read" ON public.notifications;
CREATE POLICY "Users can mark own notifications read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Audit logs are strictly readable by admins" ON public.audit_logs;
CREATE POLICY "Audit logs are strictly readable by admins"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins and system can insert audit logs" ON public.audit_logs;
CREATE POLICY "Admins and system can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (public.is_admin());
