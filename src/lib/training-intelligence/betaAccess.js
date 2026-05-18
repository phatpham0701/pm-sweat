const PROMO_KEY = 'pmsweat_ti_promo';
const BASE_BETA_DAYS = 30;
const EXTENSION_DAYS = 30;
const VALID_CODE = 'PMSWEAT';

function readPromo() {
  try { return JSON.parse(localStorage.getItem(PROMO_KEY)); }
  catch { return null; }
}

function writePromo(data) {
  try { localStorage.setItem(PROMO_KEY, JSON.stringify(data)); }
  catch {}
}

/**
 * Compute the effective beta expiry date for a profile.
 * Promo code extends from the date it was applied, not from original expiry.
 *
 * @param {import('./types').UserProfile} profile
 * @returns {{ isExpired: boolean, daysRemaining: number, expiryDate: Date, hasExtension: boolean }}
 */
export function getBetaStatus(profile) {
  if (!profile?.createdAt) {
    return { isExpired: false, daysRemaining: BASE_BETA_DAYS, expiryDate: new Date(), hasExtension: false };
  }

  const baseStart = new Date(profile.createdAt);
  let expiryDate = new Date(baseStart.getTime() + BASE_BETA_DAYS * 86400000);
  let hasExtension = false;

  const promo = readPromo();
  if (promo?.expiryDate) {
    const promoExpiry = new Date(promo.expiryDate);
    if (promoExpiry > expiryDate) {
      expiryDate = promoExpiry;
      hasExtension = true;
    }
  }

  const now = Date.now();
  const msRemaining = expiryDate.getTime() - now;
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / 86400000));
  const isExpired = msRemaining <= 0;

  return { isExpired, daysRemaining, expiryDate, hasExtension };
}

/**
 * Attempt to apply a promo code.
 * Returns { success: boolean, error?: string, daysAdded?: number }
 *
 * @param {string} code
 * @returns {{ success: boolean, error?: string, daysAdded?: number }}
 */
export function applyPromoCode(code) {
  if (!code || code.trim().toUpperCase() !== VALID_CODE) {
    return { success: false, error: 'Mã không hợp lệ. Vui lòng kiểm tra lại.' };
  }

  const existing = readPromo();
  const baseDate = existing?.expiryDate ? new Date(existing.expiryDate) : new Date();
  // Extend from max(now, existing expiry)
  const extendFrom = Math.max(Date.now(), baseDate.getTime());
  const newExpiry = new Date(extendFrom + EXTENSION_DAYS * 86400000);

  writePromo({
    code: VALID_CODE,
    appliedAt: new Date().toISOString(),
    expiryDate: newExpiry.toISOString(),
  });

  return { success: true, daysAdded: EXTENSION_DAYS };
}

/**
 * Clear stored promo (for testing / admin reset).
 */
export function clearPromo() {
  localStorage.removeItem(PROMO_KEY);
}
