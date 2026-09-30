import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

export const REFERRAL_STORAGE_KEY = 'referral_code';
export const REFERRAL_EXPIRY_KEY = 'referral_code_expires_at';
const REFERRAL_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function getStoredReferralCode(): string | null {
  const code = localStorage.getItem(REFERRAL_STORAGE_KEY);
  const expiresAt = Number(localStorage.getItem(REFERRAL_EXPIRY_KEY) || 0);
  if (!code || !expiresAt || Date.now() > expiresAt) return null;
  return code;
}

export function useCaptureReferral() {
  const location = useLocation();

  useEffect(() => {
    const ref = new URLSearchParams(location.search).get('ref');
    if (!ref) return;

    const expiresAt = Number(localStorage.getItem(REFERRAL_EXPIRY_KEY) || 0);
    const isExpired = !expiresAt || Date.now() > expiresAt;

    // first-touch: only write if nothing stored yet, or the stored one expired
    if (!localStorage.getItem(REFERRAL_STORAGE_KEY) || isExpired) {
      localStorage.setItem(REFERRAL_STORAGE_KEY, ref);
      localStorage.setItem(REFERRAL_EXPIRY_KEY, String(Date.now() + REFERRAL_TTL_MS));
    }
  }, [location.search]);

  return null;
}
