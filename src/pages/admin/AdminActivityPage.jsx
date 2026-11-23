/**
 * ADMIN ACTIVITY LOGS PAGE (/admin/activity)
 */

import { useEffect, useState } from 'react';
import SearchInput from '../../components/common/SearchInput.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import * as staffService from '../../services/staffService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    staffService.getActivityLogs().then(setLogs);
  }, []);

  const filtered = logs.filter((l) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      l.actor.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.targetName.toLowerCase().includes(q)
    );
  });

  const columns = [
    { key: 'actor', label: 'Actor (Demo)' },
    { key: 'action', label: 'Action', render: (row) => <span className="font-semibold text-[#0B2545]">{row.action}</span> },
    { key: 'targetType', label: 'Target Type' },
    { key: 'targetName', label: 'Target' },
    { key: 'detail', label: 'Detail' },
    { key: 'timestamp', label: 'Timestamp' },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Activity Logs (Demo)"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Filter activity logs..." label="Filter logs" className="max-w-sm" />
        <DataTable columns={columns} rows={filtered} />
      </div>
    </DashboardShell>
  );
}
