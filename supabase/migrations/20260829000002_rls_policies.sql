-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper functions to extract role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS app_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('SUPER_ADMIN', 'OWNER', 'TOURNAMENT_ADMIN')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_finance_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('SUPER_ADMIN', 'OWNER', 'FINANCE_ADMIN')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Public profiles are readable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- TOURNAMENTS
CREATE POLICY "Published tournaments are readable by everyone"
  ON tournaments FOR SELECT
  USING (status != 'DRAFT' OR is_admin());

CREATE POLICY "Admins can manage tournaments"
  ON tournaments FOR ALL
  USING (is_admin());

-- REGISTRATIONS
CREATE POLICY "Users can read their own registrations or public approved count"
  ON tournament_registrations FOR SELECT
  USING (auth.uid() = user_id OR status IN ('APPROVED', 'CHECKED_IN') OR is_admin());

CREATE POLICY "Users can create own registration"
  ON tournament_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ROOM CREDENTIALS (Strict Protection)
CREATE POLICY "Checked-in participants can view room after unlock time"
  ON room_credentials FOR SELECT
  USING (
    is_admin() OR (
      NOW() >= release_at AND EXISTS (
        SELECT 1 FROM tournament_registrations
        WHERE tournament_id = room_credentials.tournament_id
        AND user_id = auth.uid()
        AND status IN ('CHECKED_IN', 'APPROVED')
      )
    )
  );

-- MATCHES & REALTIME EVENTS
CREATE POLICY "Matches are readable by everyone"
  ON matches FOR SELECT USING (true);

CREATE POLICY "Match participants are readable by everyone"
  ON match_participants FOR SELECT USING (true);

CREATE POLICY "Match events are readable by everyone"
  ON match_events FOR SELECT USING (true);

CREATE POLICY "Referees and admins can insert match events"
  ON match_events FOR INSERT
  WITH CHECK (
    is_admin() OR EXISTS (
      SELECT 1 FROM tournament_staff
      WHERE tournament_id = match_events.tournament_id
      AND user_id = auth.uid()
      AND role IN ('REFEREE', 'TOURNAMENT_ADMIN')
    )
  );

-- FINANCIAL LEDGER
CREATE POLICY "Finance admins can view ledger"
  ON financial_ledger FOR SELECT
  USING (is_finance_admin());

CREATE POLICY "Finance admins can insert ledger"
  ON financial_ledger FOR INSERT
  WITH CHECK (is_finance_admin());

-- NOTIFICATIONS
CREATE POLICY "Users can read their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update read status on their notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
