/**
 * DASHBOARD SHELL WRAPPER
 * --------------------------------------------------------------------------
 * Shared layout container for Customer (/account), Staff (/staff), and
 * Admin (/admin) portals. Enforces portal & permission previews cleanly.
 */

import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { canAccessPortal, hasPermission } from '../../utils/permissions.js';
import DashboardSidebar from './DashboardSidebar.jsx';
import DashboardTopbar from './DashboardTopbar.jsx';
import PermissionNotice from './PermissionNotice.jsx';

export default function DashboardShell({
  portal, // 'customer' | 'staff' | 'admin'
  portalTitle,
  portalSubtitle,
  pageTitle,
  navItems = [],
  requiredPermission = null,
  children,
}) {
  const { currentUser, authReady } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-sm text-[#4B5563]">
        Loading demo workspace...
      </div>
    );
  }

  // Filter nav items by permission for staff workspace preview
  const visibleNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(currentUser, item.permission);
  });

  const portalAllowed = canAccessPortal(currentUser, portal);
  const permissionAllowed = !requiredPermission || hasPermission(currentUser, requiredPermission);

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-[#111827]">
      <DashboardSidebar
        portalTitle={portalTitle}
        portalSubtitle={portalSubtitle}
        navItems={portalAllowed ? visibleNavItems : []}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardTopbar title={pageTitle} onOpenMobile={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1320px] w-full mx-auto">
          {!portalAllowed ? (
            <PermissionNotice
              title={`${portalTitle} Access Restricted`}
              message={`Please sign in as a ${portal} demo account (or use the Demo Role Switcher) to preview this portal.`}
              requiredRole={portal}
            />
          ) : !permissionAllowed ? (
            <PermissionNotice
              title="Module Permission Required"
              message={`Your current staff demo role lacks the "${requiredPermission}" permission. An administrator can adjust permissions in Admin > Staff & Permissions.`}
              requiredRole="admin"
            />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
