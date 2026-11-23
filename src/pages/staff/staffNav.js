/**
 * STAFF WORKSPACE NAVIGATION CONFIGURATION
 * --------------------------------------------------------------------------
 * Each permission-gated item passes a permission key checked by DashboardShell
 * via `hasPermission()`. Remember: real security must enforce permissions on
 * the backend API as well.
 */

import {
  CheckSquare,
  FileEdit,
  FolderKanban,
  LayoutDashboard,
  MessageSquareText,
  Package,
  UserCog,
} from 'lucide-react';

export const STAFF_NAV_ITEMS = [
  { label: 'Overview', to: '/staff', end: true, icon: LayoutDashboard },
  { label: 'My Tasks', to: '/staff/tasks', icon: CheckSquare },
  { label: 'Enquiries & Quotes', to: '/staff/enquiries', icon: MessageSquareText, permission: 'manageQuotes' },
  { label: 'Product Drafts', to: '/staff/products', icon: Package, permission: 'createProducts' },
  { label: 'Projects', to: '/staff/projects', icon: FolderKanban, permission: 'updateProjects' },
  { label: 'Content Drafts', to: '/staff/content', icon: FileEdit, permission: 'manageArticles' },
  { label: 'Profile & Preferences', to: '/staff/profile', icon: UserCog },
];
