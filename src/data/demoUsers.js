/**
 * DEMO USERS & ROLE ACCOUNTS
 * --------------------------------------------------------------------------
 * Clearly marked sample accounts for previewing the Customer, Staff, and
 * Admin portals in Demo Mode.
 *
 * SECURITY WARNING:
 * - No real passwords are stored or checked here.
 * - Remove or replace this file with real database/auth provider lookups
 *   (e.g., Supabase Auth, Firebase Auth, or custom JWT backend) before launch.
 */

import { STAFF_ROLE_PRESETS } from '../utils/permissions.js';

export const initialDemoUsers = [
  {
    id: 'usr-customer-demo',
    fullName: 'Demo Customer Account',
    email: 'customer.demo@example.com',
    phone: '+234 800 000 0001 (Demo)',
    role: 'customer',
    status: 'Active',
    department: '',
    staffRoleTitle: '',
    permissions: [],
    addresses: [
      {
        id: 'addr-1',
        label: 'Primary Residence (Demo Placeholder)',
        street: 'Demo Street Address Placeholder',
        city: 'Lagos (Demo)',
        state: 'Lagos',
        notes: 'Sample delivery location for frontend preview only.',
      },
    ],
    isDemo: true,
  },
  {
    id: 'usr-staff-demo',
    fullName: 'Demo Staff Member (Coordinator)',
    email: 'staff.demo@example.com',
    phone: '+234 800 000 0002 (Demo)',
    role: 'staff',
    status: 'Active',
    department: 'Projects & Quotations (Demo)',
    staffRoleTitle: 'Project Coordinator',
    permissions: [
      ...STAFF_ROLE_PRESETS['Project Coordinator'],
      'createProducts',
      'editProducts',
      'manageArticles',
      'manageQuotes',
    ],
    isDemo: true,
  },
  {
    id: 'usr-staff-editor',
    fullName: 'Demo Content Staff',
    email: 'editor.demo@example.com',
    phone: '+234 800 000 0003 (Demo)',
    role: 'staff',
    status: 'Active',
    department: 'Editorial & Portfolio (Demo)',
    staffRoleTitle: 'Content Editor',
    permissions: [...STAFF_ROLE_PRESETS['Content Editor']],
    isDemo: true,
  },
  {
    id: 'usr-admin-demo',
    fullName: 'Demo Administrator',
    email: 'admin.demo@example.com',
    phone: '+234 800 000 0000 (Demo)',
    role: 'admin',
    status: 'Active',
    department: 'Operations & Management (Demo)',
    staffRoleTitle: 'Administrator',
    permissions: [...STAFF_ROLE_PRESETS['Administrator']],
    isDemo: true,
  },
];

export default initialDemoUsers;
