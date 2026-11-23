/**
 * DEMO LOCAL STORAGE HELPER
 * --------------------------------------------------------------------------
 * Used ONLY when appConfig.DEMO_MODE === true so interactive actions (cart,
 * wishlist, new quote drafts, admin edits, staff updates) survive page
 * refreshes during frontend testing.
 *
 * IMPORTANT:
 * - Never store passwords or sensitive personal secrets in localStorage.
 * - This entire module becomes obsolete once real backend APIs & database
 *   queries are connected in `src/services/*.js`.
 */

const STORAGE_PREFIX = 'rehoyah_demo_v1_';

export function readDemoStore(key, fallbackValue) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return structuredClone(fallbackValue);
    return JSON.parse(raw);
  } catch {
    return structuredClone(fallbackValue);
  }
}

export function writeDemoStore(key, value) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in demo mode
  }
  return value;
}

export function resetAllDemoStores() {
  try {
    Object.keys(window.localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_PREFIX)) {
        window.localStorage.removeItem(k);
      }
    });
  } catch {
    // Ignore errors
  }
}
