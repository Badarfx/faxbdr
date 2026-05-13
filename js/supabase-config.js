// ===== KONFIGURASI SUPABASE =====
// Ganti dengan URL dan Anon Key dari project Supabase Anda
// Cara dapatkan: Settings → API → Project URL + anon/public key
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

// Initialize Supabase
const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
