/**
 * ADMIN PRODUCT MANAGEMENT (/admin/products)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import ImageUploadPlaceholder from '../../components/common/ImageUploadPlaceholder.jsx';
import Modal from '../../components/common/Modal.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as productService from '../../services/productService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminProductsPage() {
  const { showToast } = useApp();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    categoryId: 'cat-paints',
    price: '',
    salePrice: '',
    stockQuantity: '10',
    variants: '',
    description: '',
    featured: false,
    status: 'published',
  });

  const loadData = () => {
    Promise.all([
      productService.getProducts({ search, status: statusFilter, category: categoryFilter }),
      productService.getCategories(),
    ]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
    });
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, categoryFilter]);

  const openNew = () => {
    setEditing(null);
    setFiles([]);
    setForm({
      name: '',
      sku: '',
      categoryId: categories[0]?.id || 'cat-paints',
      price: '',
      salePrice: '',
      stockQuantity: '10',
      variants: 'Standard',
      description: '',
      featured: false,
      status: 'published',
    });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setFiles([]);
    setForm({
      name: p.name,
      sku: p.sku || '',
      categoryId: p.categoryId,
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : '',
      stockQuantity: String(p.stockQuantity),
      variants: (p.variants || []).join(', '),
      description: p.description || '',
      featured: Boolean(p.featured),
      status: p.status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      stockQuantity: Number(form.stockQuantity) || 0,
      variants: form.variants.split(',').map((s) => s.trim()).filter(Boolean),
      image: files[0]?.url || editing?.image || '/assets/placeholders/cat-paints.svg',
    };
    if (editing) {
      await productService.updateProduct(editing.id, payload);
      showToast('Demo product updated.', 'success');
    } else {
      await productService.createProduct(payload);
      showToast('Demo product created.', 'success');
    }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await productService.deleteProduct(deleteTarget.id);
    loadData();
    showToast('Demo product deleted.', 'info');
  };

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div>
          <p className="font-semibold text-[#0B2545]">{row.name}</p>
          <p className="text-xs text-[#6B7280]">{row.sku}</p>
        </div>
      ),
    },
    { key: 'categoryName', label: 'Category' },
    { key: 'price', label: 'Price', align: 'right', render: (row) => <span className="tabular-nums font-medium">{formatCurrency(row.salePrice || row.price)}</span> },
    { key: 'stockQuantity', label: 'Stock', align: 'right', render: (row) => <span className="tabular-nums">{row.stockQuantity}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
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
      pageTitle="Product Management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="rehoyah-card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3 flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search products or SKU..."
              label="Search products"
              className="w-full sm:w-64"
            />
            <select
              className="rehoyah-select w-44"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select
              className="rehoyah-select w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <Button variant="primary" size="sm" onClick={openNew}>Add Product</Button>
        </div>

        <DataTable columns={columns} rows={products} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Demo Product' : 'Create Demo Product'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Product Name *</label>
              <input type="text" className="rehoyah-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="rehoyah-label">SKU Placeholder</label>
              <input type="text" className="rehoyah-input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="rehoyah-label">Category</label>
              <select className="rehoyah-select" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="rehoyah-label">Price (₦)</label>
              <input type="number" className="rehoyah-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="rehoyah-label">Sale Price (₦)</label>
              <input type="number" className="rehoyah-input" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="rehoyah-label">Stock Qty</label>
              <input type="number" className="rehoyah-input" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
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
            <label className="flex items-center gap-2 text-sm pt-5 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#0B2545]" />
              <span>Featured on Home</span>
            </label>
          </div>

          <div>
            <label className="rehoyah-label">Variations (comma-separated)</label>
            <input type="text" className="rehoyah-input" value={form.variants} onChange={(e) => setForm({ ...form, variants: e.target.value })} />
          </div>

          <div>
            <label className="rehoyah-label">Description</label>
            <textarea rows={3} className="rehoyah-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <ImageUploadPlaceholder label="Product Image Slot (Demo Preview)" multiple={false} files={files} onChange={setFiles} />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Product</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Demo Product?"
        message={`Remove "${deleteTarget?.name || ''}" from local demo catalogue?`}
        confirmLabel="Delete"
      />
    </DashboardShell>
  );
}
