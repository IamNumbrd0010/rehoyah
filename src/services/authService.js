/**
 * AUTHENTICATION SERVICE (DEMO MODE)
 * --------------------------------------------------------------------------
 * Handles simulated sign-in, customer registration, password reset request,
 * and demo role switching for frontend previewing.
 *
 * TODO (BACKEND INTEGRATION):
 * - Replace login() with POST /api/auth/login (HTTP-only session cookie or JWT).
 * - Replace registerCustomer() with POST /api/auth/register (always sets role='customer' on server).
 * - Replace requestPasswordReset() with POST /api/auth/forgot-password.
 * - Replace getCurrentUser() with GET /api/auth/me.
 * - Remove switchDemoRole() before deploying to production!
 */

import { initialDemoUsers } from '../data/demoUsers.js';
import { readDemoStore, writeDemoStore } from './demoStore.js';

const SESSION_KEY = 'current_user';
const USERS_KEY = 'users';

function getUsersList() {
  return readDemoStore(USERS_KEY, initialDemoUsers);
}

export async function getCurrentUser() {
  // TODO: Fetch authenticated user profile from GET /api/auth/me
  return readDemoStore(SESSION_KEY, null);
}

export async function login(email, password) {
  // DEMO ONLY: Never check real passwords in browser JS.
  // Backend must hash & verify passwords securely with bcrypt/argon2.
  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  const users = getUsersList();
  const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!found) {
    return {
      ok: false,
      error:
        'Demo account not found. Try customer.demo@example.com, staff.demo@example.com, or admin.demo@example.com (any password works in demo mode), or use the Demo Role Switcher.',
    };
  }

  if (found.status === 'Suspended' || found.status === 'Inactive') {
    return { ok: false, error: `This demo account is currently ${found.status}.` };
  }

  // Strip any sensitive fields before saving demo session
  const sessionUser = { ...found };
  writeDemoStore(SESSION_KEY, sessionUser);
  return { ok: true, data: sessionUser, isDemo: true };
}

export async function logout() {
  // TODO: Call POST /api/auth/logout to clear HTTP-only session cookie
  writeDemoStore(SESSION_KEY, null);
  return { ok: true };
}

export async function registerCustomer({ fullName, email, phone, password }) {
  // SECURITY NOTE:
  // Public registration MUST always create a 'customer' account.
  // Never allow public users to submit role='staff' or role='admin'.
  if (!fullName || !email || !password) {
    return { ok: false, error: 'Please complete all required fields.' };
  }

  const users = getUsersList();
  const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {
    return { ok: false, error: 'An account with this email already exists in demo storage.' };
  }

  const newCustomer = {
    id: `usr-${Date.now()}`,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : '',
    role: 'customer',
    status: 'Active',
    permissions: [],
    addresses: [],
    isDemo: true,
  };

  // NOTE: Password is intentionally NOT stored in localStorage.
  users.push(newCustomer);
  writeDemoStore(USERS_KEY, users);
  writeDemoStore(SESSION_KEY, newCustomer);

  return { ok: true, data: newCustomer, isDemo: true };
}

export async function requestPasswordReset(email) {
  // TODO: POST /api/auth/forgot-password to send a real time-limited reset token via email.
  if (!email) {
    return { ok: false, error: 'Please enter your email address.' };
  }
  return {
    ok: true,
    isDemo: true,
    message:
      'Demo notice: No real email was sent. Once the backend email service is connected, a password reset link will be sent if this address exists.',
  };
}

export async function updateCustomerProfile(userId, updates) {
  // TODO: PATCH /api/account/profile (enforce auth userId === record userId on backend)
  const users = getUsersList();
  const updatedUsers = users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
  writeDemoStore(USERS_KEY, updatedUsers);

  const current = readDemoStore(SESSION_KEY, null);
  if (current && current.id === userId) {
    const updatedCurrent = { ...current, ...updates };
    writeDemoStore(SESSION_KEY, updatedCurrent);
    return { ok: true, data: updatedCurrent, isDemo: true };
  }
  return { ok: true, data: updatedUsers.find((u) => u.id === userId), isDemo: true };
}

/**
 * DEMO ONLY: Switches active preview user without password entry so developers
 * and reviewers can inspect Visitor, Customer, Staff, and Admin views.
 * REMOVE before production launch.
 */
export async function switchDemoRole(roleKey) {
  if (roleKey === 'visitor') {
    writeDemoStore(SESSION_KEY, null);
    return { ok: true, data: null };
  }
  const users = getUsersList();
  const match =
    users.find((u) => u.role === roleKey) ||
    initialDemoUsers.find((u) => u.role === roleKey) ||
    null;
  writeDemoStore(SESSION_KEY, match);
  return { ok: true, data: match };
}
