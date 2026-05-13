-- ============================================
-- 🏆 BAINVES – SUPABASE SETUP SQL
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

-- 1. TABEL USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  coins INTEGER DEFAULT 0,
  affiliate_balance INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE DEFAULT '',
  referred_by TEXT DEFAULT '',
  paket TEXT DEFAULT 'none',
  paket_expiry TIMESTAMPTZ,
  total_affiliates INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE REDEMPTIONS (tukar hadiah)
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  hadiah_id INTEGER,
  hadiah_name TEXT,
  koin INTEGER,
  status TEXT DEFAULT 'diproses',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE AFFILIATE TRANSACTIONS
CREATE TABLE IF NOT EXISTS affiliate_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'commission',
  amount INTEGER,
  from_user UUID,
  level INTEGER,
  package_price INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE REFERRALS (jaringan affiliate)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE WITHDRAWALS
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER,
  bank TEXT,
  account TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FUNCTION & RPC: Increment coins secara atomic
CREATE OR REPLACE FUNCTION increment_coins(user_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE users SET coins = coins + amount WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- 7. FUNCTION & RPC: Increment affiliate_balance
CREATE OR REPLACE FUNCTION increment_affiliate_balance(user_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE users SET affiliate_balance = affiliate_balance + amount WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- 8. FUNCTION & RPC: Increment total_affiliates
CREATE OR REPLACE FUNCTION increment_total_affiliates(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET total_affiliates = total_affiliates + 1 WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- 9. FUNCTION & RPC: Increment total_clicks
CREATE OR REPLACE FUNCTION increment_total_clicks(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET total_clicks = total_clicks + 1 WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- ========== ROW LEVEL SECURITY (RLS) ==========
-- Aktifkan RLS di semua tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Policy: users hanya bisa baca/tulis data mereka sendiri
CREATE POLICY "users_own_data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "redemptions_own" ON redemptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "affiliate_transactions_own" ON affiliate_transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "referrals_own" ON referrals
  FOR ALL USING (auth.uid() = referrer_id);

CREATE POLICY "withdrawals_own" ON withdrawals
  FOR ALL USING (auth.uid() = user_id);

-- Izinkan insert untuk registrasi (belum login)
CREATE POLICY "users_insert_public" ON users
  FOR INSERT WITH CHECK (true);

-- Izinkan SELECT untuk cek referral code
CREATE POLICY "users_select_referral" ON users
  FOR SELECT USING (true);
