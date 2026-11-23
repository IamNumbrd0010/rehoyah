/**
 * STAFF PROFILE & NOTIFICATION PREFERENCES (/staff/profile)
 */

import { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { STAFF_NAV_ITEMS } from './staffNav.js';

export default function StaffProfilePage() {
  const { currentUser, showToast } = useApp();
  const [prefs, setPrefs] = useState({ taskAlerts: true, quoteAlerts: true, projectAlerts: true });

  return (
    <DashboardShell
      portal="staff"
      portalTitle="Staff Workspace"
      pageTitle="Staff Profile & Preferences"
      navItems={STAFF_NAV_ITEMS}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rehoyah-card p-6 space-y-3">
          <h2 className="text-base font-semibold text-[#0B2545]">Staff Details (Demo)</h2>
          <p className="text-sm"><strong>Name:</strong> {currentUser?.fullName}</p>
          <p className="text-sm"><strong>Email:</strong> {currentUser?.email}</p>
          <p className="text-sm"><strong>Role:</strong> {currentUser?.staffRoleTitle || currentUser?.role}</p>
          <p className="text-sm"><strong>Department:</strong> {currentUser?.department || 'Operations (Demo)'}</p>
          <div className="pt-3 border-t border-[#EAECEF]">
            <p className="text-xs font-semibold text-[#0B2545] mb-2">Active Demo Permissions</p>
            <p className="text-xs text-[#6B7280]">
              {(currentUser?.permissions || []).join(' · ') || 'Broad Admin Permissions'}
            </p>
          </div>
        </div>

        <div className="rehoyah-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#0B2545]">Notification Preferences (UI Placeholder)</h2>
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={prefs.taskAlerts}
              onChange={(e) => setPrefs({ ...prefs, taskAlerts: e.target.checked })}
              className="accent-[#0B2545]"
            />
            <span>Notify when new tasks are assigned</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={prefs.quoteAlerts}
              onChange={(e) => setPrefs({ ...prefs, quoteAlerts: e.target.checked })}
              className="accent-[#0B2545]"
            />
            <span>Notify on new enquiry assignments</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={prefs.projectAlerts}
              onChange={(e) => setPrefs({ ...prefs, projectAlerts: e.target.checked })}
              className="accent-[#0B2545]"
            />
            <span>Notify on project milestone updates</span>
          </label>
          <Button variant="primary" size="sm" onClick={() => showToast('Demo preferences updated.', 'success')}>
            Save Preferences (Demo)
          </Button>
          <p className="text-xs text-[#6B7280] pt-2 border-t border-[#EAECEF]">
            Password changes will connect to your authentication provider in production.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
