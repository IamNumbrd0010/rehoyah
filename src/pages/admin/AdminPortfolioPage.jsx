/**
 * ADMIN PORTFOLIO & BEFORE/AFTER MANAGEMENT (/admin/portfolio)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ImageUploadPlaceholder from '../../components/common/ImageUploadPlaceholder.jsx';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as projectService from '../../services/projectService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminPortfolioPage() {
  const { showToast } = useApp();
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [beforeFiles, setBeforeFiles] = useState([]);
  const [afterFiles, setAfterFiles] = useState([]);
  const [form, setForm] = useState({
    title: '',
    category: 'Residential',
    location: '',
    featured: false,
    published: true,
    description: '',
  });

  const loadPortfolio = () => projectService.getProjects().then(setItems);
  useEffect(() => {
    loadPortfolio();
  }, []);

  const openEdit = (item) => {
    setEditing(item);
    setBeforeFiles([]);
    setAfterFiles([]);
    setForm({
      title: item.title,
      category: item.category,
      location: item.location,
      featured: Boolean(item.featured),
      published: item.published !== false,
      description: item.description,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing) return;
    await projectService.updateProject(editing.id, {
      ...form,
      beforeImage: beforeFiles[0]?.url || editing.beforeImage,
      afterImage: afterFiles[0]?.url || editing.afterImage,
    });
    setModalOpen(false);
    loadPortfolio();
    showToast('Portfolio entry updated in demo storage.', 'success');
  };

  const togglePublish = async (item) => {
    await projectService.updateProject(item.id, { published: !item.published });
    loadPortfolio();
    showToast(`Portfolio entry ${item.published ? 'unpublished' : 'published'} (Demo).`, 'info');
  };

  const columns = [
    { key: 'title', label: 'Portfolio Entry', render: (row) => <span className="font-semibold text-[#0B2545]">{row.title}</span> },
    { key: 'category', label: 'Category' },
    { key: 'beforeAfter', label: 'Before/After Pair', render: (row) => (row.beforeImage && row.afterImage ? 'Attached (Demo)' : 'None') },
    { key: 'published', label: 'Status', render: (row) => <StatusBadge status={row.published ? 'Published' : 'Draft'} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>Edit &amp; Media</Button>
          <Button variant="ghost" size="sm" onClick={() => togglePublish(row)}>
            {row.published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Portfolio & Before/After Slots"
      navItems={ADMIN_NAV_ITEMS}
    >
      <DataTable columns={columns} rows={items} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit Portfolio & Before/After Media" maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="rehoyah-label">Title</label>
            <input type="text" className="rehoyah-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Category</label>
              <input type="text" className="rehoyah-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="rehoyah-label">Location Placeholder</label>
              <input type="text" className="rehoyah-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="rehoyah-label">Description</label>
            <textarea rows={3} className="rehoyah-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploadPlaceholder label="Before Image (Demo Preview)" multiple={false} files={beforeFiles} onChange={setBeforeFiles} />
            <ImageUploadPlaceholder label="After Image (Demo Preview)" multiple={false} files={afterFiles} onChange={setAfterFiles} />
          </div>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#0B2545]" /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#0B2545]" /> Published</label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Portfolio Entry</Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
