/**
 * ADMIN CONTROL CENTER NAVIGATION CONFIGURATION
 */

import {
  Activity,
  BarChart3,
  Briefcase,
  CalendarClock,
  FileText,
  FolderKanban,
  Images,
  LayoutDashboard,
  Layers,
  MessageSquareQuote,
  Newspaper,
  Package,
  Settings,
  ShoppingCart,
  UserCheck,
  Users,
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  { label: 'Overview', to: '/admin', end: true, icon: LayoutDashboard },
  { label: 'Staff & Permissions', to: '/admin/staff', icon: UserCheck },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: Layers },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Quotes & Enquiries', to: '/admin/quotes', icon: FileText },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Services', to: '/admin/services', icon: Briefcase },
  { label: 'Portfolio', to: '/admin/portfolio', icon: Images },
  { label: 'Articles', to: '/admin/articles', icon: Newspaper },
  { label: 'Reviews', to: '/admin/reviews', icon: MessageSquareQuote },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Appointments', to: '/admin/appointments', icon: CalendarClock },
  { label: 'Reports (Demo)', to: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
  { label: 'Activity Logs', to: '/admin/activity', icon: Activity },
];
