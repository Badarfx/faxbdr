// ===== AFFILIATE MULTI-LEVEL 10 (Supabase) =====

// Process referral: add user to upline's network
async function processReferral(newUserId, referralCode) {
  try {
    // Cari referrer berdasarkan referral_code
    const { data: referrer, error: refErr } = await supabase
      .from('users')
      .select('id, referred_by')
      .eq('referral_code', referralCode)
      .single();

    if (!referrer) return;

    // Build level chain (up to 10 levels)
    const levelChain = [];
    let currentRefCode = referralCode;
    let level = 1;

    while (currentRefCode && level <= 10) {
      const { data: uplineUser } = await supabase
        .from('users')
        .select('id, referral_code, referred_by')
        .eq('referral_code', currentRefCode)
        .single();

      if (!uplineUser) break;

      levelChain.push({ userId: uplineUser.id, level });

      // Simpan referral di tabel referrals
      await supabase.from('referrals').insert({
        referrer_id: uplineUser.id,
        referred_id: newUserId,
        level: level
      });

      // Increment total_affiliates via RPC
      await supabase.rpc('increment_total_affiliates', { user_id: uplineUser.id });

      // Move to next upline
      if (uplineUser.referred_by) {
        currentRefCode = uplineUser.referred_by;
        level++;
      } else {
        break;
      }
    }
  } catch (err) {
    console.error('Referral processing error:', err);
  }
}

// Process commission when a referral buys a package
async function processAffiliateCommission(buyerId, packagePrice) {
  try {
    // Cari buyer untuk dapat referred_by
    const { data: buyer } = await supabase
      .from('users')
      .select('referred_by')
      .eq('id', buyerId)
      .single();

    if (!buyer || !buyer.referred_by) return;

    let currentRefCode = buyer.referred_by;
    let level = 1;

    while (currentRefCode && level <= 10) {
      const { data: upline } = await supabase
        .from('users')
        .select('id, referred_by')
        .eq('referral_code', currentRefCode)
        .single();

      if (!upline) break;

      // Commission percent based on level
      let commissionPercent;
      if (level === 1) commissionPercent = 10;
      else if (level === 2) commissionPercent = 5;
      else commissionPercent = 2.5;

      const commission = Math.round(packagePrice * commissionPercent / 100);

      if (commission > 0) {
        // Add commission via RPC
        await supabase.rpc('increment_affiliate_balance', {
          user_id: upline.id,
          amount: commission
        });

        // Record transaction
        await supabase.from('affiliate_transactions').insert({
          user_id: upline.id,
          type: 'commission',
          amount: commission,
          from_user: buyerId,
          level: level,
          package_price: packagePrice
        });
      }

      // Next upline
      if (upline.referred_by) {
        currentRefCode = upline.referred_by;
        level++;
      } else {
        break;
      }
    }
  } catch (err) {
    console.error('Commission processing error:', err);
  }
}

// Get affiliate network for a user
async function getAffiliateNetwork(userId) {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('level', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(50);

    if (!data) return {};

    const network = {};
    for (const ref of data) {
      const lvl = ref.level || 1;
      if (!network[lvl]) network[lvl] = [];
      // Ambil nama pengguna yang dirujuk
      const { data: referredUser } = await supabase
        .from('users')
        .select('name, email, created_at')
        .eq('id', ref.referred_id)
        .single();
      network[lvl].push({
        ...ref,
        referredName: referredUser?.name || ref.referred_id.slice(0, 8),
        joinedAt: ref.created_at
      });
    }
    return network;
  } catch (err) {
    console.error('Get network error:', err);
    return {};
  }
}

// Render affiliate network tree
async function renderAffiliateNetwork() {
  if (!currentUser) return;
  const network = await getAffiliateNetwork(currentUser.id);
  const container = document.getElementById('affNetwork');

  let html = '<div class="aff-tree">';
  for (let level = 1; level <= 10; level++) {
    const members = network[level] || [];
    html += `<div class="aff-node">`;
    html += `<strong>Level ${level}</strong> (${members.length} anggota)`;
    if (members.length > 0) {
      for (const m of members) {
        const dateStr = m.joinedAt
          ? new Date(m.joinedAt).toLocaleDateString()
          : '-';
        html += `<div class="aff-node-item">👤 ${m.referredName} | Bergabung: ${dateStr}</div>`;
      }
    } else {
      html += `<div class="aff-node-item" style="color:var(--text-light);">Belum ada anggota</div>`;
    }
    html += '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
}
