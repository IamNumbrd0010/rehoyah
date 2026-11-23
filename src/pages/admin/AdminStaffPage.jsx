/**
 * ADMIN STAFF & PERMISSIONS PAGE (/admin/staff)
 * --------------------------------------------------------------------------
 * Allows inviting demo staff, assigning role presets, toggling individual
 * permission keys, assigning tasks, and activating/suspending staff accounts.
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Modal from '../../components/common/Modal.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as staffService from '../../services/staffService.js';
import { PERMISSION_KEYS, PERMISSION_LABELS, STAFF_ROLE_PRESETS } from '../../utils/permissions.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminStaffPage() {
  const { showToast } = useApp();
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [permTarget, setPermTarget] = useState(null);
  const [taskTarget, setTaskTarget] = useState(null);
  const [confirmSuspend, setConfirmSuspend] = useState(null);

  const [inviteForm, setInviteForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'Projects & Quotations',
    staffRoleTitle: 'General Staff',
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '2026-04-05',
  });

  const loadStaff = () => staffService.getStaff().then(setStaff);

  useEffect(() => {
    loadStaff();
  }, []);

  const filtered = staff.filter((s) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.staffRoleTitle || '').toLowerCase().includes(q)
    );
  });

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.fullName.trim() || !inviteForm.email.trim()) return;
    await staffService.createStaffInvite(inviteForm);
    setInviteOpen(false);
    setInviteForm({
      fullName: '',
      email: '',
      phone: '',
      department: 'Projects & Quotations',
      staffRoleTitle: 'General Staff',
    });
    loadStaff();
    showToast('Demo staff invite added (no email sent).', 'success');
  };

  const handleTogglePermission = (key) => {
    if (!permTarget) return;
    const current = permTarget.permissions || [];
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    setPermTarget({ ...permTarget, permissions: next });
  };

  const handleSavePermissions = async () => {
    await staffService.updatePermissions(permTarget.id, permTarget.permissions || []);
    setPermTarget(null);
    loadStaff();
    showToast('Demo staff permissions updated (enforce on backend in production).', 'success');
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !taskTarget) return;
    await staffService.assignTask({
      ...taskForm,
      assignedToId: taskTarget.id,
      assignedToName: taskTarget.fullName,
    });
    setTaskTarget(null);
    setTaskForm({ title: '', description: '', priority: 'Medium', dueDate: '2026-04-05' });
    showToast(`Task assigned to ${taskTarget.fullName} (Demo).`, 'success');
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    await staffService.updateStaff(user.id, { status: nextStatus });
    loadStaff();
    showToast(`${user.fullName} status changed to ${nextStatus}.`, 'info');
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Staff Member',
      render: (row) => (
        <div>
          <p className="font-semibold text-[#0B2545]">{row.fullName}</p>
          <p className="text-xs text-[#6B7280]">{row.email}</p>
        </div>
      ),
    },
    { key: 'staffRoleTitle', label: 'Role', render: (row) => row.staffRoleTitle || row.role },
    { key: 'department', label: 'Department', render: (row) => row.department || '—' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => setPermTarget(row)}>
            Permissions
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setTaskTarget(row)}>
            Assign Task
          </Button>
          <Button
            variant={row.status === 'Active' ? 'ghost' : 'primary'}
            size="sm"
            onClick={() => setConfirmSuspend(row)}
          >
            {row.status === 'Active' ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Staff & Permissions"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search staff by name, email, or role..."
            label="Search staff"
            className="w-full sm:w-80"
          />
          <Button variant="primary" size="sm" onClick={() => setInviteOpen(true)}>
            Invite Staff (Demo)
          </Button>
        </div>

        <DataTable columns={columns} rows={filtered} />
      </div>

      {/* Invite Staff Modal */}
      <Modal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Staff Member (Demo)">
        <form onSubmit={handleInvite} className="space-y-4">
          <p className="text-xs text-[#6B7280]">
            Real staff invitations must send a secure backend invite token and verify email before account activation.
          </p>
          <div>
            <label className="rehoyah-label">Full Name *</label>
            <input
              type="text"
              className="rehoyah-input"
              value={inviteForm.fullName}
              onChange={(e) => setInviteForm({ ...inviteForm, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="rehoyah-label">Work Email *</label>
            <input
              type="email"
              className="rehoyah-input"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Staff Role Preset</label>
              <select
                className="rehoyah-select"
                value={inviteForm.staffRoleTitle}
                onChange={(e) => setInviteForm({ ...inviteForm, staffRoleTitle: e.target.value })}
              >
                {Object.keys(STAFF_ROLE_PRESETS).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="rehoyah-label">Department</label>
              <input
                type="text"
                className="rehoyah-input"
                value={inviteForm.department}
                onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Create Demo Staff</Button>
          </div>
        </form>
      </Modal>

      {/* Permission Editor Modal */}
      <Modal
        isOpen={Boolean(permTarget)}
        onClose={() => setPermTarget(null)}
        title={`Edit Permissions: ${permTarget?.fullName || ''}`}
        maxWidth="max-w-2xl"
      >
        {permTarget && (
          <div className="space-y-4">
            <p className="text-xs text-[#6B7280]">
              Frontend preview permissions. Enforce identical checks in your server middleware and database rules.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto p-1">
              {PERMISSION_KEYS.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2.5 rounded border border-[#EAECEF] text-xs cursor-pointer hover:bg-[#F8F9FA]"
                >
                  <input
                    type="checkbox"
                    checked={(permTarget.permissions || []).includes(key)}
                    onChange={() => handleTogglePermission(key)}
                    className="accent-[#0B2545]"
                  />
                  <span>{PERMISSION_LABELS[key] || key}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPermTarget(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSavePermissions}>Save Permissions</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Task Modal */}
      <Modal
        isOpen={Boolean(taskTarget)}
        onClose={() => setTaskTarget(null)}
        title={`Assign Task to ${taskTarget?.fullName || ''}`}
      >
        <form onSubmit={handleAssignTask} className="space-y-4">
          <div>
            <label className="rehoyah-label">Task Title *</label>
            <input
              type="text"
              className="rehoyah-input"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Priority</label>
              <select
                className="rehoyah-select"
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="rehoyah-label">Due Date</label>
              <input
                type="date"
                className="rehoyah-input"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="rehoyah-label">Instructions</label>
            <textarea
              rows={3}
              className="rehoyah-textarea"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setTaskTarget(null)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Assign Task</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(confirmSuspend)}
        onClose={() => setConfirmSuspend(null)}
        onConfirm={() => handleToggleStatus(confirmSuspend)}
        title={confirmSuspend?.status === 'Active' ? 'Suspend Staff Account?' : 'Activate Staff Account?'}
        message={`Confirm changing status for ${confirmSuspend?.fullName || ''}.`}
        confirmLabel="Confirm"
        confirmVariant={confirmSuspend?.status === 'Active' ? 'danger' : 'primary'}
      />
    </DashboardShell>
  );
}
