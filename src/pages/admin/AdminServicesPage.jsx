/**
 * ADMIN SERVICES MANAGEMENT (/admin/services)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminServicesPage() {
  const { showToast } = useApp();
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: 'Finishing & Wall Treatments',
    shortDescription: '',
    description: '',
    displayOrder: '1',
    featured: false,
    active: true,
  });

  const loadServices = () => contentService.getServices().then(setServices);
  useEffect(() => {
    loadServices();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      name: '',
      category: 'Finishing & Wall Treatments',
      shortDescription: '',
      description: '',
      displayOrder: String(services.length + 1),
      featured: false,
      active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (srv) => {
    setEditing(srv);
    setForm({
      name: srv.name,
      category: srv.category,
      shortDescription: srv.shortDescription,
      description: srv.description,
      displayOrder: String(srv.displayOrder || 1),
      featured: Boolean(srv.featured),
      active: srv.active !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await contentService.saveService({
      id: editing?.id,
      ...form,
      displayOrder: Number(form.displayOrder) || 1,
    });
    setModalOpen(false);
    loadServices();
    showToast('Service updated in demo storage.', 'success');
  };

  const columns = [
    { key: 'displayOrder', label: 'Order', render: (row) => <span className="tabular-nums">{row.displayOrder}</span> },
    { key: 'name', label: 'Service', render: (row) => <span className="font-semibold text-[#0B2545]">{row.name}</span> },
    { key: 'category', label: 'Category' },
    { key: 'featured', label: 'Featured', render: (row) => (row.featured ? 'Featured' : 'Standard') },
    { key: 'active', label: 'Visibility', render: (row) => <StatusBadge status={row.active ? 'Active' : 'Inactive'} /> },
    { key: 'actions', label: 'Actions', render: (row) => <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>Edit</Button> },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Services Management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={openNew}>Add Service</Button>
        </div>
        <DataTable columns={columns} rows={services} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="rehoyah-label">Service Name *</label>
            <input type="text" className="rehoyah-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Category</label>
              <select className="rehoyah-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="Finishing & Wall Treatments">Finishing &amp; Wall Treatments</option>
                <option value="Furniture & Custom Production">Furniture &amp; Custom Production</option>
                <option value="Renovation & Consultation">Renovation &amp; Consultation</option>
              </select>
            </div>
            <div>
              <label className="rehoyah-label">Display Order</label>
              <input type="number" className="rehoyah-input" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="rehoyah-label">Short Summary</label>
            <input type="text" className="rehoyah-input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
          </div>
          <div>
            <label className="rehoyah-label">Detailed Description</label>
            <textarea rows={3} className="rehoyah-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#0B2545]" /> Featured on Home</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-[#0B2545]" /> Active</label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Service</Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
