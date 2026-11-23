/**
 * PRODUCT & CATEGORY SERVICE (DEMO MODE)
 * --------------------------------------------------------------------------
 * Manages catalog browsing, search/sorting, and staff/admin product & category CRUD.
 *
 * TODO (BACKEND INTEGRATION):
 * - Replace reads with GET /api/products and GET /api/categories
 * - Replace writes with authenticated POST/PATCH/DELETE endpoints enforcing
 *   `createProducts`, `editProducts`, `publishProducts`, `manageProducts` on server.
 */

import { initialCategories, initialProducts } from '../data/demoData.js';
import { slugify } from '../utils/validation.js';
import { readDemoStore, writeDemoStore } from './demoStore.js';

const PRODUCTS_KEY = 'products';
const CATEGORIES_KEY = 'categories';

export async function getProducts(filters = {}) {
  // TODO: Pass query params (?search=&category=&sort=&inStock=&status=) to backend API
  let list = readDemoStore(PRODUCTS_KEY, initialProducts);

  if (filters.publishedOnly) {
    list = list.filter((p) => p.status === 'published');
  }
  if (filters.status && filters.status !== 'all') {
    list = list.filter((p) => p.status === filters.status);
  }
  if (filters.category && filters.category !== 'all') {
    list = list.filter(
      (p) =>
        p.categoryId === filters.category ||
        p.categoryName.toLowerCase() === String(filters.category).toLowerCase() ||
        (p.subcategory && p.subcategory.toLowerCase() === String(filters.category).toLowerCase())
    );
  }
  if (filters.inStockOnly) {
    list = list.filter((p) => p.inStock && p.stockQuantity > 0);
  }
  if (filters.featuredOnly) {
    list = list.filter((p) => p.featured);
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (filters.sort === 'price-asc') {
    list = [...list].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (filters.sort === 'price-desc') {
    list = [...list].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (filters.sort === 'newest') {
    list = [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  } else {
    // featured / relevance
    list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return list;
}

export async function getProductBySlug(slug) {
  const list = readDemoStore(PRODUCTS_KEY, initialProducts);
  return list.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function createProduct(data) {
  // TODO: POST /api/products (validate inputs & enforce staff/admin permission on server)
  const list = readDemoStore(PRODUCTS_KEY, initialProducts);
  const categories = readDemoStore(CATEGORIES_KEY, initialCategories);
  const cat = categories.find((c) => c.id === data.categoryId) || categories[0];

  const newProduct = {
    id: `prod-${Date.now()}`,
    sku: data.sku || `RHY-DEMO-${Math.floor(100 + Math.random() * 900)}`,
    name: data.name,
    slug: data.slug || `${slugify(data.name)}-${Date.now().toString().slice(-4)}`,
    categoryId: cat ? cat.id : 'cat-paints',
    categoryName: cat ? cat.name : 'Paints & Finishes',
    subcategory: data.subcategory || '',
    price: Number(data.price) || 0,
    salePrice: data.salePrice ? Number(data.salePrice) : null,
    stockQuantity: Number(data.stockQuantity) || 0,
    inStock: Number(data.stockQuantity) > 0,
    featured: Boolean(data.featured),
    status: data.status || 'draft',
    image: data.image || '/assets/placeholders/cat-paints.svg',
    gallery: data.gallery || [data.image || '/assets/placeholders/cat-paints.svg'],
    description: data.description || '',
    specs: data.specs || [],
    variants: Array.isArray(data.variants)
      ? data.variants
      : String(data.variants || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
    createdAt: new Date().toISOString().slice(0, 10),
    isDemo: true,
  };

  const updated = [newProduct, ...list];
  writeDemoStore(PRODUCTS_KEY, updated);
  return { ok: true, data: newProduct, isDemo: true };
}

export async function updateProduct(id, updates) {
  // TODO: PATCH /api/products/:id
  const list = readDemoStore(PRODUCTS_KEY, initialProducts);
  const categories = readDemoStore(CATEGORIES_KEY, initialCategories);

  const updatedList = list.map((item) => {
    if (item.id !== id) return item;
    const cat = updates.categoryId ? categories.find((c) => c.id === updates.categoryId) : null;
    const nextQty =
      updates.stockQuantity !== undefined ? Number(updates.stockQuantity) : item.stockQuantity;
    return {
      ...item,
      ...updates,
      categoryName: cat ? cat.name : item.categoryName,
      stockQuantity: nextQty,
      inStock: nextQty > 0,
    };
  });

  writeDemoStore(PRODUCTS_KEY, updatedList);
  return { ok: true, data: updatedList.find((p) => p.id === id), isDemo: true };
}

export async function deleteProduct(id) {
  // TODO: DELETE /api/products/:id (admin only)
  const list = readDemoStore(PRODUCTS_KEY, initialProducts);
  writeDemoStore(
    PRODUCTS_KEY,
    list.filter((p) => p.id !== id)
  );
  return { ok: true, isDemo: true };
}

export async function getCategories(activeOnly = false) {
  const list = readDemoStore(CATEGORIES_KEY, initialCategories);
  const sorted = [...list].sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  return activeOnly ? sorted.filter((c) => c.active) : sorted;
}

export async function createCategory(data) {
  const list = readDemoStore(CATEGORIES_KEY, initialCategories);
  const newCat = {
    id: `cat-${Date.now()}`,
    name: data.name,
    slug: data.slug || slugify(data.name),
    description: data.description || '',
    subcategories: Array.isArray(data.subcategories) ? data.subcategories : [],
    image: data.image || '/assets/placeholders/cat-decor.svg',
    displayOrder: Number(data.displayOrder) || list.length + 1,
    active: data.active !== false,
  };
  writeDemoStore(CATEGORIES_KEY, [...list, newCat]);
  return { ok: true, data: newCat, isDemo: true };
}

export async function updateCategory(id, updates) {
  const list = readDemoStore(CATEGORIES_KEY, initialCategories);
  const updated = list.map((c) => (c.id === id ? { ...c, ...updates } : c));
  writeDemoStore(CATEGORIES_KEY, updated);
  return { ok: true, data: updated.find((c) => c.id === id), isDemo: true };
}

export async function deleteCategory(id) {
  const list = readDemoStore(CATEGORIES_KEY, initialCategories);
  writeDemoStore(
    CATEGORIES_KEY,
    list.filter((c) => c.id !== id)
  );
  return { ok: true, isDemo: true };
}
