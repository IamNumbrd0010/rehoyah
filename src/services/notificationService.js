/**
 * NOTIFICATION SERVICE (DEMO PLACEHOLDER)
 * --------------------------------------------------------------------------
 * Manages sample in-app notifications for Customer, Staff, and Admin headers.
 *
 * TODO (BACKEND INTEGRATION):
 * - Replace getNotifications() with GET /api/notifications
 * - Replace markNotificationRead() with PATCH /api/notifications/:id/read
 * - Implement sendNotification() on your backend using email (Resend/SES/SMTP),
 *   SMS/WhatsApp providers, and database notification records.
 */

import { initialNotifications } from '../data/demoData.js';
import { readDemoStore, writeDemoStore } from './demoStore.js';

const NOTIFS_KEY = 'notifications';

export async function getNotifications(role) {
  const list = readDemoStore(NOTIFS_KEY, initialNotifications);
  if (!role) return list;
  return list.filter((n) => n.recipientRole === role);
}

export async function markNotificationRead(id) {
  const list = readDemoStore(NOTIFS_KEY, initialNotifications);
  const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
  writeDemoStore(NOTIFS_KEY, updated);
  return { ok: true, isDemo: true };
}

export async function sendNotification({ recipientRole, title, message }) {
  // DEMO PLACEHOLDER ONLY — does NOT send real email or SMS
  const list = readDemoStore(NOTIFS_KEY, initialNotifications);
  const item = {
    id: `NOTIF-${Date.now()}`,
    recipientRole: recipientRole || 'admin',
    title,
    message,
    createdAt: 'Demo Session',
    read: false,
  };
  writeDemoStore(NOTIFS_KEY, [item, ...list]);
  return { ok: true, data: item, isDemo: true };
}
