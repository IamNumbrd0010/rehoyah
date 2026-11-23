/**
 * ADMIN ARTICLES / BLOG MANAGEMENT (/admin/articles)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminArticlesPage() {
  const { showToast } = useApp();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Interior Design',
    excerpt: '',
    body: '',
    status: 'published',
    featured: false,
  });

  const loadArticles = () => contentService.getArticles({ search }).then(setArticles);
  useEffect(() => {
    loadArticles();
  }, [search]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', category: 'Interior Design', excerpt: '', body: '', status: 'draft', featured: false });
    setModalOpen(true);
  };

  const openEdit = (art) => {
    setEditing(art);
    setForm({
      title: art.title,
      category: art.category,
      excerpt: art.excerpt,
      body: (art.body || []).join('\n\n'),
      status: art.status,
      featured: Boolean(art.featured),
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await contentService.saveArticle({
      id: editing?.id,
      ...form,
      body: form.body.split('\n\n').filter(Boolean),
    });
    setModalOpen(false);
    loadArticles();
    showToast('Article saved in demo storage.', 'success');
  };

  const columns = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-semibold text-[#0B2545]">{row.title}</span> },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>Edit / Publish</Button>,
    },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Inspiration Articles"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search articles..." label="Search articles" className="w-72" />
          <Button variant="primary" size="sm" onClick={openNew}>Create Article</Button>
        </div>
        <DataTable columns={columns} rows={articles} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Article' : 'New Article'} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="rehoyah-label">Headline *</label>
            <input type="text" className="rehoyah-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Category</label>
              <input type="text" className="rehoyah-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="rehoyah-label">Status</label>
              <select className="rehoyah-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="rehoyah-label">Excerpt</label>
            <textarea rows={2} className="rehoyah-textarea" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label className="rehoyah-label">Content Paragraphs (Plain Text Placeholder)</label>
            <textarea rows={5} className="rehoyah-textarea" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#0B2545]" />
            <span>Featured guide</span>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Article</Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
