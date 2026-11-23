/**
 * QUOTATION & ENQUIRY SERVICE (DEMO MODE)
 * --------------------------------------------------------------------------
 * Manages quote requests from public visitors/customers, staff notes,
 * staff assignments, and itemized quotation builder records.
 *
 * TODO (BACKEND INTEGRATION):
 * - Replace getQuotes() with GET /api/quotes (scoped by customer or assigned staff on server).
 * - Replace createQuoteRequest() with POST /api/quotes + email/SMS notification trigger.
 * - Replace createQuotation() with POST /api/quotes/:id/quotation.
 */

import { initialQuotes } from '../data/demoData.js';
import { readDemoStore, writeDemoStore } from './demoStore.js';

const QUOTES_KEY = 'quotes';

export async function getQuotes(filters = {}) {
  let list = readDemoStore(QUOTES_KEY, initialQuotes);

  if (filters.customerId) {
    list = list.filter((q) => q.customerId === filters.customerId);
  }
  if (filters.assignedStaffId) {
    list = list.filter((q) => q.assignedStaffId === filters.assignedStaffId);
  }
  if (filters.status && filters.status !== 'all') {
    list = list.filter((q) => q.status === filters.status);
  }
  if (filters.search) {
    const term = filters.search.trim().toLowerCase();
    list = list.filter(
      (q) =>
        q.id.toLowerCase().includes(term) ||
        q.customerName.toLowerCase().includes(term) ||
        q.service.toLowerCase().includes(term) ||
        q.location.toLowerCase().includes(term)
    );
  }

  return list;
}

export async function getQuoteById(id) {
  const list = readDemoStore(QUOTES_KEY, initialQuotes);
  return list.find((q) => q.id === id) || null;
}

export async function createQuoteRequest(data) {
  // TODO: POST /api/quotes — persist in database and notify staff
  const list = readDemoStore(QUOTES_KEY, initialQuotes);
  const newQuote = {
    id: `QT-DEMO-${Math.floor(200 + Math.random() * 799)}`,
    customerId: data.customerId || null,
    customerName: data.name,
    phone: data.phone,
    email: data.email,
    location: data.location,
    service: data.service,
    propertyType: data.propertyType,
    description: data.description,
    budgetRange: data.budgetRange || 'Not specified',
    timeline: data.timeline || 'Flexible',
    siteInspectionRequested: Boolean(data.siteInspectionRequested),
    uploadedFileNames: data.uploadedFileNames || [],
    status: 'Received',
    assignedStaffId: null,
    assignedStaffName: 'Unassigned',
    createdAt: new Date().toISOString().slice(0, 10),
    internalNotes: [],
    quotation: null,
    isDemo: true,
  };

  writeDemoStore(QUOTES_KEY, [newQuote, ...list]);
  return { ok: true, data: newQuote, isDemo: true };
}

export async function updateQuoteStatus(id, status) {
  const list = readDemoStore(QUOTES_KEY, initialQuotes);
  const updated = list.map((q) => (q.id === id ? { ...q, status } : q));
  writeDemoStore(QUOTES_KEY, updated);
  return { ok: true, data: updated.find((q) => q.id === id), isDemo: true };
}

export async function assignQuoteStaff(id, staffId, staffName) {
  const list = readDemoStore(QUOTES_KEY, initialQuotes);
  const updated = list.map((q) =>
    q.id === id ? { ...q, assignedStaffId: staffId, assignedStaffName: staffName } : q
  );
  writeDemoStore(QUOTES_KEY, updated);
  return { ok: true, data: updated.find((q) => q.id === id), isDemo: true };
}

export async function addQuoteNote(id, author, text) {
  const list = readDemoStore(QUOTES_KEY, initialQuotes);
  const updated = list.map((q) => {
    if (q.id !== id) return q;
    const note = {
      id: `note-${Date.now()}`,
      author: author || 'Demo Staff',
      text,
      date: new Date().toISOString().slice(0, 10),
    };
    return { ...q, internalNotes: [...(q.internalNotes || []), note] };
  });
  writeDemoStore(QUOTES_KEY, updated);
  return { ok: true, data: updated.find((q) => q.id === id), isDemo: true };
}

export async function createQuotation(id, quotationData) {
  // TODO: Save quotation line items to `quotations` + `quotation_items` tables on backend
  const list = readDemoStore(QUOTES_KEY, initialQuotes);
  const updated = list.map((q) =>
    q.id === id ? { ...q, quotation: quotationData, status: quotationData.nextStatus || q.status } : q
  );
  writeDemoStore(QUOTES_KEY, updated);
  return { ok: true, data: updated.find((q) => q.id === id), isDemo: true };
}
