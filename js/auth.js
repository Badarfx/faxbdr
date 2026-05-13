// ===== AUTHENTICATION (Supabase) =====
let isLoginMode = true;
let currentUser = null;
let userData = null;

function showAuth(mode) {
  document.getElementById('landingPage').classList.remove('active');
  document.getElementById('authPage').classList.add('active');
  if (mode === 'register') {
    isLoginMode = false;
    document.getElementById('authTitle').textContent = 'Daftar Akun Baru';
    document.getElementById('authBtn').textContent = 'Daftar';
    document.getElementById('authSwitchText').textContent = 'Sudah punya akun?';
    document.getElementById('authSwitchLink').textContent = 'Masuk';
    document.getElementById('registerFields').style.display = 'block';
    document.getElementById('regReferral').style.display = 'block';
  } else {
    isLoginMode = true;
    document.getElementById('authTitle').textContent = 'Masuk';
    document.getElementById('authBtn').textContent = 'Masuk';
    document.getElementById('authSwitchText').textContent = 'Belum punya akun?';
    document.getElementById('authSwitchLink').textContent = 'Daftar';
    document.getElementById('registerFields').style.display = 'none';
    document.getElementById('regReferral').style.display = 'none';
  }
  document.getElementById('authError').textContent = '';
}

function hideAuth() {
  document.getElementById('authPage').classList.remove('active');
  document.getElementById('landingPage').classList.add('active');
}

function toggleAuthMode() {
  if (isLoginMode) showAuth('register');
  else showAuth('login');
}

async function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const errorEl = document.getElementById('authError');
  errorEl.textContent = '';

  const btn = document.getElementById('authBtn');
  btn.disabled = true;
  btn.textContent = 'Memproses...';

  try {
    if (isLoginMode) {
      // LOGIN with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
    } else {
      // REGISTER
      const name = document.getElementById('regName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const referralCode = document.getElementById('regReferral').value.trim();
      if (!name) throw new Error('Nama lengkap wajib diisi');
      if (!phone) throw new Error('Nomor WhatsApp wajib diisi');

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone } }
      });
      if (error) throw error;

      if (data.user) {
        // Generate referral code
        const userRefCode = generateRefCode();

        // Create user profile in the users table
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          email: email,
          name: name,
          phone: phone,
          referral_code: userRefCode,
          referred_by: referralCode || '',
          coins: 0,
          affiliate_balance: 0
        });
        if (insertError) throw insertError;

        // Process referral if any
        if (referralCode) {
          await processReferral(data.user.id, referralCode);
        }
      }
    }
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = isLoginMode ? 'Masuk' : 'Daftar';
  }
}

// Listen auth state changes (Supabase)
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    currentUser = session.user;
    await loadUserData();
    showApp();
  } else {
    currentUser = null;
    userData = null;
    document.getElementById('appMain').classList.remove('active');
    document.getElementById('landingPage').classList.add('active');
    document.getElementById('authPage').classList.remove('active');
  }
});

async function loadUserData() {
  if (!currentUser) return;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', currentUser.id)
    .single();
  if (data) {
    userData = data;
  }
}

function showApp() {
  document.getElementById('landingPage').classList.remove('active');
  document.getElementById('authPage').classList.remove('active');
  document.getElementById('appMain').classList.add('active');
  initApp();
}

async function logout() {
  if (confirm('Yakin ingin keluar?')) {
    await supabase.auth.signOut();
  }
}

function generateRefCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
