/**
 * CUSTOMER PORTAL NAVIGATION CONFIGURATION
 */

import { FileText, FolderKanban, Heart, LayoutDashboard, Package, User } from 'lucide-react';

export const CUSTOMER_NAV_ITEMS = [
  { label: 'Overview', to: '/account', end: true, icon: LayoutDashboard },
  { label: 'Orders', to: '/account/orders', icon: Package },
  { label: 'Wishlist', to: '/account/wishlist', icon: Heart },
  { label: 'Quote Requests', to: '/account/quotes', icon: FileText },
  { label: 'Projects', to: '/account/projects', icon: FolderKanban },
  { label: 'Profile & Addresses', to: '/account/profile', icon: User },
];
