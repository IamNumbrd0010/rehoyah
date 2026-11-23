/**
 * CENTRALIZED PERMISSION MODEL (FRONTEND DEMO PREVIEW)
 * --------------------------------------------------------------------------
 * This file defines role defaults, permission keys, and helper checks used by
 * the Customer, Staff, and Admin UI shells.
 *
 * CRITICAL SECURITY REMINDER:
 * Hiding UI buttons or routes in React is ONLY a frontend convenience preview.
 * Real authorization MUST be enforced on the backend API and database security
 * rules (e.g. row-level security / server middleware) on every read and write.
 * Never trust a client-side role or permission flag for real data protection.
 */

export const PERMISSION_KEYS = [
  'manageProducts',
  'createProducts',
  'editProducts',
  'publishProducts',
  'manageOrders',
  'updateOrderStatus',
  'manageQuotes',
  'assignQuotes',
  'manageProjects',
  'updateProjects',
  'manageServices',
  'managePortfolio',
  'manageArticles',
  'publishArticles',
  'manageReviews',
  'manageCustomers',
  'manageAppointments',
  'manageStaff',
  'manageSettings',
  'viewReports',
  'viewActivityLogs',
];

export const PERMISSION_LABELS = {
  manageProducts: 'Manage All Products',
  createProducts: 'Create Product Drafts',
  editProducts: 'Edit Permitted Products',
  publishProducts: 'Approve & Publish Products',
  manageOrders: 'Manage Orders',
  updateOrderStatus: 'Update Order Status',
  manageQuotes: 'Manage Quotations & Enquiries',
  assignQuotes: 'Assign Quote Enquiries',
  manageProjects: 'Manage Projects',
  updateProjects: 'Post Project Progress Updates',
  manageServices: 'Manage Services',
  managePortfolio: 'Manage Portfolio & Before/After',
  manageArticles: 'Create & Edit Articles',
  publishArticles: 'Publish Articles',
  manageReviews: 'Moderate Reviews',
  manageCustomers: 'View & Manage Customers',
  manageAppointments: 'Manage Appointments',
  manageStaff: 'Manage Staff & Permissions',
  manageSettings: 'Edit Site Settings',
  viewReports: 'View Demo Reports',
  viewActivityLogs: 'View Activity Logs',
};

export const STAFF_ROLE_PRESETS = {
  Administrator: [...PERMISSION_KEYS],
  'Content Editor': [
    'manageArticles',
    'publishArticles',
    'managePortfolio',
    'manageServices',
    'manageReviews',
  ],
  'Store/Product Manager': [
    'manageProducts',
    'createProducts',
    'editProducts',
    'publishProducts',
    'manageOrders',
    'updateOrderStatus',
  ],
  'Sales/Quotation Staff': [
    'manageQuotes',
    'assignQuotes',
    'manageAppointments',
    'manageCustomers',
    'updateOrderStatus',
  ],
  'Project Coordinator': [
    'manageProjects',
    'updateProjects',
    'managePortfolio',
    'manageAppointments',
  ],
  'General Staff': [
    'createProducts',
    'editProducts',
    'updateProjects',
    'manageArticles',
  ],
};

/**
 * Checks whether a demo user holds a given permission key.
 * In demo mode:
 * - 'admin' role has broad access unless explicitly restricted
 * - 'staff' role checks user.permissions array
 * - 'customer' / 'visitor' roles return false for staff/admin permissions
 */
export function hasPermission(user, permissionKey) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'staff') {
    return Array.isArray(user.permissions) && user.permissions.includes(permissionKey);
  }
  return false;
}

/**
 * Checks whether a user holds at least one permission from a list.
 */
export function hasAnyPermission(user, permissionKeys = []) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return permissionKeys.some((key) => hasPermission(user, key));
}

/**
 * Checks whether the current user can enter a specific dashboard portal.
 */
export function canAccessPortal(user, portal) {
  if (!user) return false;
  if (portal === 'customer') {
    return user.role === 'customer' || user.role === 'admin';
  }
  if (portal === 'staff') {
    return user.role === 'staff' || user.role === 'admin';
  }
  if (portal === 'admin') {
    return user.role === 'admin';
  }
  return false;
}
