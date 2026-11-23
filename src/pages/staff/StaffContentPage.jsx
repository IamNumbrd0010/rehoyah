/**
 * STAFF CONTENT DRAFTS PAGE (/staff/content)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import { STAFF_NAV_ITEMS } from './staffNav.js';

export default function StaffContentPage() {
  const { showToast } = useApp();
  const [articles, setArticles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'Interior Design', excerpt: '', body: '' });

  const loadArticles = () => {
    contentService.getArticles().then(setArticles);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', category: 'Interior Design', excerpt: '', body: '' });
    setModalOpen(true);
  };

  const openEdit = (art) => {
    setEditing(art);
    setForm({
      title: art.title,
      category: art.category,
      excerpt: art.excerpt,
      body: (art.body || []).join('\n\n'),
    });
    setModalOpen(true);
  };

  const handleSave = async (status) => {
    if (!form.title.trim()) return;
    await contentService.saveArticle({
      id: editing?.id,
      title: form.title,
      category: form.category,
      excerpt: form.excerpt,
      body: form.body.split('\n\n').filter(Boolean),
      status,
    });
    setModalOpen(false);
    loadArticles();
    showToast(`Article saved (${status}).`, 'success');
  };

  const columns = [
    { key: 'title', label: 'Article Title', render: (row) => <span className="font-semibold text-[#0B2545]">{row.title}</span> },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'edit',
      label: 'Actions',
      render: (row) => (
        <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>
          Edit Draft
        </Button>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="staff"
      portalTitle="Staff Workspace"
      pageTitle="Content & Article Drafts"
      navItems={STAFF_NAV_ITEMS}
      requiredPermission="manageArticles"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#6B7280]">
            Prepare draft articles and submit for Administrator publishing approval.
          </p>
          <Button variant="primary" size="sm" onClick={openNew}>New Article Draft</Button>
        </div>

        <DataTable columns={columns} rows={articles} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Article Draft' : 'New Article Draft'}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="rehoyah-label">Headline *</label>
            <input
              type="text"
              className="rehoyah-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="rehoyah-label">Category</label>
            <input
              type="text"
              className="rehoyah-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div>
            <label className="rehoyah-label">Excerpt</label>
            <textarea
              rows={2}
              className="rehoyah-textarea"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>
          <div>
            <label className="rehoyah-label">Body Copy (Plain Text Paragraphs)</label>
            <textarea
              rows={5}
              className="rehoyah-textarea"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleSave('draft')}>Save Draft</Button>
            <Button variant="primary" size="sm" onClick={() => handleSave('pending')}>Submit for Review</Button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}
