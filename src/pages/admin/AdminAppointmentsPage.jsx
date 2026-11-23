/**
 * ADMIN APPOINTMENTS PAGE (/admin/appointments)
 */

import { useEffect, useState } from 'react';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import * as staffService from '../../services/staffService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminAppointmentsPage() {
  const { showToast } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);

  const loadData = () => {
    Promise.all([contentService.getAppointments(), staffService.getStaff()]).then(([a, s]) => {
      setAppointments(a);
      setStaff(s);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (id, updates) => {
    await contentService.updateAppointment(id, updates);
    loadData();
    showToast('Demo appointment updated.', 'info');
  };

  const columns = [
    { key: 'id', label: 'Ref', render: (row) => <span className="tabular-nums font-semibold">{row.id}</span> },
    { key: 'customerName', label: 'Client (Demo)' },
    { key: 'consultationType', label: 'Consultation' },
    { key: 'preferredDate', label: 'Date / Slot', render: (row) => <span className="tabular-nums text-xs">{row.preferredDate} · {row.preferredSlot}</span> },
    { key: 'mode', label: 'Mode' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Manage',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <select
            aria-label={`Assign staff for ${row.id}`}
            className="rehoyah-select py-1 text-xs w-36"
            value={row.assignedStaffId || ''}
            onChange={(e) => handleUpdate(row.id, { assignedStaffId: e.target.value })}
          >
            <option value="">Unassigned</option>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
          <select
            aria-label={`Update status for ${row.id}`}
            className="rehoyah-select py-1 text-xs w-36"
            value={row.status}
            onChange={(e) => handleUpdate(row.id, { status: e.target.value })}
          >
            <option value="Requested (Demo)">Requested (Demo)</option>
            <option value="Confirmed (Demo)">Confirmed (Demo)</option>
            <option value="Rescheduled (Demo)">Rescheduled (Demo)</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Consultation Appointments"
      navItems={ADMIN_NAV_ITEMS}
    >
      <DataTable columns={columns} rows={appointments} />
    </DashboardShell>
  );
}
