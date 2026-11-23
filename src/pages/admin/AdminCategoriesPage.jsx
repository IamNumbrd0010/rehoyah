/**
 * ADMIN CATEGORY MANAGEMENT (/admin/categories)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as productService from '../../services/productService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminCategoriesPage() {
  const { showToast } = useApp();
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', displayOrder: '1', active: true });

  const loadCats = () => productService.getCategories().then(setCategories);
  useEffect(() => {
    loadCats();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', displayOrder: String(categories.length + 1), active: true });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      displayOrder: String(cat.displayOrder || 1),
      active: cat.active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = { ...form, displayOrder: Number(form.displayOrder) || 1 };
    if (editing) await productService.updateCategory(editing.id, payload);
    else await productService.createCategory(payload);
    setModalOpen(false);
    loadCats();
    showToast('Demo category saved.', 'success');
  };

  const columns = [
    { key: 'displayOrder', label: 'Order', render: (row) => <span className="tabular-nums">{row.displayOrder}</span> },
    { key: 'name', label: 'Category Name', render: (row) => <span className="font-semibold text-[#0B2545]">{row.name}</span> },
    { key: 'slug', label: 'Slug' },
    { key: 'active', label: 'Status', render: (row) => <StatusBadge status={row.active ? 'Active' : 'Inactive'} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Categories"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={openNew}>Add Category</Button>
        </div>
        <DataTable columns={columns} rows={categories} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="rehoyah-label">Category Name *</label>
            <input type="text" className="rehoyah-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Slug</label>
              <input type="text" className="rehoyah-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <label className="rehoyah-label">Display Order</label>
              <input type="number" className="rehoyah-input" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="rehoyah-label">Description</label>
            <textarea rows={3} className="rehoyah-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-[#0B2545]" />
            <span>Active in storefront</span>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Category</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await productService.deleteCategory(deleteTarget.id);
          loadCats();
          showToast('Demo category deleted.', 'info');
        }}
        title="Delete Category?"
        message={`Remove category "${deleteTarget?.name || ''}"?`}
        confirmLabel="Delete"
      />
    </DashboardShell>
  );
}
