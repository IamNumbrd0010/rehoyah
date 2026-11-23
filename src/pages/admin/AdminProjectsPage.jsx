/**
 * ADMIN PROJECTS MANAGEMENT (/admin/projects)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as projectService from '../../services/projectService.js';
import * as staffService from '../../services/staffService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminProjectsPage() {
  const { showToast } = useApp();
  const [projects, setProjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Residential',
    location: '',
    projectType: '',
    status: 'Planned',
    progress: '0',
    assignedStaffId: '',
    description: '',
  });

  const loadData = () => {
    Promise.all([projectService.getProjects(), staffService.getStaff()]).then(([p, s]) => {
      setProjects(p);
      setStaff(s);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      title: '',
      category: 'Residential',
      location: '',
      projectType: 'Interior Finishing',
      status: 'Planned',
      progress: '0',
      assignedStaffId: staff[0]?.id || '',
      description: '',
    });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title,
      category: p.category,
      location: p.location,
      projectType: p.projectType,
      status: p.status,
      progress: String(p.progress || 0),
      assignedStaffId: p.assignedStaffId || '',
      description: p.description || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) await projectService.updateProject(editing.id, { ...form, progress: Number(form.progress) });
    else await projectService.createProject({ ...form, progress: Number(form.progress) });
    setModalOpen(false);
    loadData();
    showToast('Demo project saved.', 'success');
  };

  const columns = [
    { key: 'title', label: 'Project Title', render: (row) => <span className="font-semibold text-[#0B2545]">{row.title}</span> },
    { key: 'category', label: 'Category' },
    { key: 'location', label: 'Location' },
    { key: 'progress', label: 'Progress', align: 'right', render: (row) => <span className="tabular-nums">{row.progress}%</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>Edit</Button>,
    },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Projects Management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={openNew}>Create Project (Demo)</Button>
        </div>
        <DataTable columns={columns} rows={projects} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Create Project'} maxWidth="max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="rehoyah-label">Project Title *</label>
            <input type="text" className="rehoyah-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Category</label>
              <select className="rehoyah-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['Residential', 'Commercial', 'Office', 'School', 'Church', 'Hotel', 'Restaurant'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="rehoyah-label">Location Placeholder</label>
              <input type="text" className="rehoyah-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="rehoyah-label">Status</label>
              <select className="rehoyah-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {['Planned', 'In Progress', 'On Hold', 'Completed'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="rehoyah-label">Progress (%)</label>
              <input type="number" min={0} max={100} className="rehoyah-input tabular-nums" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
            </div>
            <div>
              <label className="rehoyah-label">Assigned Staff</label>
              <select className="rehoyah-select" value={form.assignedStaffId} onChange={(e) => setForm({ ...form, assignedStaffId: e.target.value })}>
                <option value="">Unassigned</option>
                {staff.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="rehoyah-label">Scope / Description</label>
            <textarea rows={3} className="rehoyah-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Project</Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
