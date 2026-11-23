/**
 * STAFF, TASKS, CUSTOMERS & ACTIVITY LOG SERVICE (DEMO MODE)
 * --------------------------------------------------------------------------
 * Manages staff list, permission presets, task assignments, customer directory,
 * and admin activity audit logs.
 *
 * SECURITY WARNING:
 * - Modifying permissions here updates demo state only.
 * - Real staff invitations, role assignments, and permission enforcement MUST
 *   run inside protected backend APIs and database security policies.
 */

import { initialActivityLogs, initialTasks } from '../data/demoData.js';
import { initialDemoUsers } from '../data/demoUsers.js';
import { STAFF_ROLE_PRESETS } from '../utils/permissions.js';
import { readDemoStore, writeDemoStore } from './demoStore.js';

const USERS_KEY = 'users';
const TASKS_KEY = 'tasks';
const LOGS_KEY = 'activity_logs';

export async function getStaff() {
  const users = readDemoStore(USERS_KEY, initialDemoUsers);
  return users.filter((u) => u.role === 'staff' || u.role === 'admin');
}

export async function getCustomers() {
  const users = readDemoStore(USERS_KEY, initialDemoUsers);
  return users.filter((u) => u.role === 'customer');
}

export async function createStaffInvite({ fullName, email, phone, department, staffRoleTitle }) {
  // TODO: POST /api/admin/staff/invite -> sends secure one-time invite email on backend
  const users = readDemoStore(USERS_KEY, initialDemoUsers);
  const presetPermissions = STAFF_ROLE_PRESETS[staffRoleTitle] || STAFF_ROLE_PRESETS['General Staff'];

  const newStaff = {
    id: `usr-staff-${Date.now()}`,
    fullName,
    email,
    phone: phone || '',
    role: staffRoleTitle === 'Administrator' ? 'admin' : 'staff',
    status: 'Active',
    department: department || 'General Operations (Demo)',
    staffRoleTitle: staffRoleTitle || 'General Staff',
    permissions: [...presetPermissions],
    isDemo: true,
  };

  writeDemoStore(USERS_KEY, [...users, newStaff]);
  await logActivity('Demo Administrator', 'Invited Staff Member (Demo)', 'Staff', fullName);
  return { ok: true, data: newStaff, isDemo: true };
}

export async function updateStaff(id, updates) {
  const users = readDemoStore(USERS_KEY, initialDemoUsers);
  const updated = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
  writeDemoStore(USERS_KEY, updated);
  return { ok: true, data: updated.find((u) => u.id === id), isDemo: true };
}

export async function updatePermissions(id, permissions) {
  // TODO: PATCH /api/admin/staff/:id/permissions (strictly admin-only on backend)
  const users = readDemoStore(USERS_KEY, initialDemoUsers);
  const updated = users.map((u) => (u.id === id ? { ...u, permissions } : u));
  writeDemoStore(USERS_KEY, updated);
  await logActivity('Demo Administrator', 'Updated Permissions (Demo)', 'Staff', id);
  return { ok: true, data: updated.find((u) => u.id === id), isDemo: true };
}

export async function getTasks(filters = {}) {
  let list = readDemoStore(TASKS_KEY, initialTasks);
  if (filters.assignedToId) {
    list = list.filter((t) => t.assignedToId === filters.assignedToId);
  }
  if (filters.status && filters.status !== 'all') {
    list = list.filter((t) => t.status === filters.status);
  }
  return list;
}

export async function assignTask(data) {
  const list = readDemoStore(TASKS_KEY, initialTasks);
  const newTask = {
    id: `TSK-DEMO-${Math.floor(10 + Math.random() * 89)}`,
    title: data.title,
    description: data.description || '',
    priority: data.priority || 'Medium',
    dueDate: data.dueDate || '2026-04-01',
    status: 'Pending',
    assignedToId: data.assignedToId,
    assignedToName: data.assignedToName || 'Demo Staff',
    assignedBy: data.assignedBy || 'Demo Administrator',
    relatedType: data.relatedType || 'General',
    relatedId: data.relatedId || '',
    isDemo: true,
  };
  writeDemoStore(TASKS_KEY, [newTask, ...list]);
  await logActivity(newTask.assignedBy, 'Assigned Task', 'Task', newTask.title);
  return { ok: true, data: newTask, isDemo: true };
}

export async function updateTaskStatus(id, status) {
  const list = readDemoStore(TASKS_KEY, initialTasks);
  const updated = list.map((t) => (t.id === id ? { ...t, status } : t));
  writeDemoStore(TASKS_KEY, updated);
  return { ok: true, data: updated.find((t) => t.id === id), isDemo: true };
}

export async function getActivityLogs() {
  return readDemoStore(LOGS_KEY, initialActivityLogs);
}

export async function logActivity(actor, action, targetType, targetName, detail = '') {
  const logs = readDemoStore(LOGS_KEY, initialActivityLogs);
  const entry = {
    id: `ACT-${Date.now()}`,
    actor,
    action,
    targetType,
    targetName,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Demo)',
    detail: detail || 'Demo session action',
  };
  writeDemoStore(LOGS_KEY, [entry, ...logs].slice(0, 50));
  return entry;
}
