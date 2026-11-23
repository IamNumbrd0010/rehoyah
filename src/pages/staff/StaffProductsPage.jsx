/**
 * STAFF PRODUCTS PAGE (/staff/products)
 * --------------------------------------------------------------------------
 * Permission-dependent module (`createProducts` / `editProducts`). Staff can
 * save drafts or submit products for Admin approval (pending status).
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ImageUploadPlaceholder from '../../components/common/ImageUploadPlaceholder.jsx';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as productService from '../../services/productService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { STAFF_NAV_ITEMS } from './staffNav.js';

export default function StaffProductsPage() {
  const { showToast } = useApp();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    categoryId: 'cat-paints',
    price: '',
    stockQuantity: '10',
    variants: '',
    description: '',
  });

  const loadData = () => {
    Promise.all([productService.getProducts(), productService.getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setEditing(null);
    setPreviewFiles([]);
    setForm({
      name: '',
      sku: '',
      categoryId: categories[0]?.id || 'cat-paints',
      price: '',
      stockQuantity: '10',
      variants: 'Standard',
      description: '',
    });
    setModalOpen(true);
  };

  const openEdit = (prod) => {
    setEditing(prod);
    setPreviewFiles([]);
    setForm({
      name: prod.name,
      sku: prod.sku || '',
      categoryId: prod.categoryId,
      price: String(prod.price),
      stockQuantity: String(prod.stockQuantity),
      variants: (prod.variants || []).join(', '),
      description: prod.description || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (targetStatus) => {
    if (!form.name.trim()) return;
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      stockQuantity: Number(form.stockQuantity) || 0,
      variants: form.variants.split(',').map((s) => s.trim()).filter(Boolean),
      status: targetStatus,
      image: previewFiles[0]?.url || editing?.image || '/assets/placeholders/cat-paints.svg',
    };

    if (editing) {
      await productService.updateProduct(editing.id, payload);
      showToast(`Product updated (${targetStatus}).`, 'success');
    } else {
      await productService.createProduct(payload);
      showToast(`Product created (${targetStatus}).`, 'success');
    }
    setModalOpen(false);
    loadData();
  };

  const columns = [
    { key: 'name', label: 'Product', render: (row) => <span className="font-semibold text-[#0B2545]">{row.name}</span> },
    { key: 'sku', label: 'SKU' },
    { key: 'categoryName', label: 'Category' },
    { key: 'price', label: 'Demo Price', align: 'right', render: (row) => <span className="tabular-nums">{formatCurrency(row.price)}</span> },
    { key: 'stockQuantity', label: 'Stock', align: 'right', render: (row) => <span className="tabular-nums">{row.stockQuantity}</span> },
    { key: 'status', label: 'Review Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="staff"
      portalTitle="Staff Workspace"
      pageTitle="Product Drafts & Submissions"
      navItems={STAFF_NAV_ITEMS}
      requiredPermission="createProducts"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#6B7280]">
            Staff can create drafts and submit them for Admin review (pending approval).
          </p>
          <Button variant="primary" size="sm" onClick={openNew}>
            Add Product Draft
          </Button>
        </div>

        <DataTable columns={columns} rows={products} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Product Draft' : 'New Product Draft'}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Product Title *</label>
              <input
                type="text"
                className="rehoyah-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="rehoyah-label">SKU Placeholder</label>
              <input
                type="text"
                className="rehoyah-input"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="rehoyah-label">Category</label>
              <select
                className="rehoyah-select"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="rehoyah-label">Sample Price (NGN)</label>
              <input
                type="number"
                className="rehoyah-input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="rehoyah-label">Stock Quantity</label>
              <input
                type="number"
                className="rehoyah-input"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="rehoyah-label">Variations (comma-separated)</label>
            <input
              type="text"
              className="rehoyah-input"
              value={form.variants}
              onChange={(e) => setForm({ ...form, variants: e.target.value })}
            />
          </div>

          <div>
            <label className="rehoyah-label">Description</label>
            <textarea
              rows={3}
              className="rehoyah-textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <ImageUploadPlaceholder
            label="Product Image Preview (Demo)"
            multiple={false}
            files={previewFiles}
            onChange={setPreviewFiles}
          />

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => handleSave('draft')}>
              Save as Draft
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleSave('pending')}>
              Submit for Admin Review
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}
