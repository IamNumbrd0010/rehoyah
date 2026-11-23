/**
 * FORM VALIDATION UTILITIES
 * --------------------------------------------------------------------------
 * Reusable client-side validation helpers for contact, quote, booking,
 * checkout, newsletter, and authentication forms.
 *
 * SECURITY NOTE:
 * Client-side validation improves user experience only. Every form endpoint
 * must repeat validation and sanitization on the backend before writing to
 * your database.
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^\+?[0-9]{7,15}$/.test(cleaned);
}

export function validateRequired(value, label) {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${label} is required.`;
  }
  return '';
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return '';
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
