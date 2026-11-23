/**
 * ORDER SERVICE (DEMO MODE)
 * --------------------------------------------------------------------------
 * Manages frontend demo order drafts, customer order history, and admin
 * fulfillment status updates.
 *
 * PAYMENT NOTICE:
 * - No real payment is processed in demo mode.
 * - Do NOT claim an order was paid until Paystack server-side verification
 *   confirms the transaction webhook/reference on your backend.
 *
 * TODO (BACKEND INTEGRATION):
 * - Replace getOrders() with GET /api/orders (scoped to customerId for customers).
 * - Replace createOrderDraft() with POST /api/orders + Paystack initialize endpoint.
 * - Replace updateOrderStatus() with PATCH /api/orders/:id/status (staff/admin only).
 */

import { initialOrders } from '../data/demoData.js';
import { readDemoStore, writeDemoStore } from './demoStore.js';

const ORDERS_KEY = 'orders';

export async function getOrders(filters = {}) {
  let list = readDemoStore(ORDERS_KEY, initialOrders);

  if (filters.customerId) {
    list = list.filter((o) => o.customerId === filters.customerId);
  }
  if (filters.status && filters.status !== 'all') {
    list = list.filter((o) => o.fulfillmentStatus === filters.status);
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function getOrderById(id) {
  const list = readDemoStore(ORDERS_KEY, initialOrders);
  return list.find((o) => o.id === id) || null;
}

export async function createOrderDraft(data) {
  // TODO: POST /api/orders -> calculate totals on server from product prices in DB
  // Never trust client-submitted unit prices in production!
  const list = readDemoStore(ORDERS_KEY, initialOrders);
  const subtotal = (data.items || []).reduce(
    (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
    0
  );

  const newOrder = {
    id: `ORD-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: data.customerId || null,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    deliveryMethod: data.deliveryMethod || 'Delivery Placeholder',
    deliveryAddress: data.deliveryAddress || 'Showroom Pickup Placeholder',
    items: data.items || [],
    subtotal,
    total: subtotal,
    paymentStatus: 'Demo Draft (Not Paid — Payment Not Connected)',
    fulfillmentStatus: 'Pending',
    createdAt: new Date().toISOString().slice(0, 10),
    notes: data.notes || '',
    history: [
      {
        status: 'Pending',
        note: 'Frontend demo order draft created (no payment collected).',
        timestamp: new Date().toLocaleString(),
      },
    ],
    isDemo: true,
  };

  writeDemoStore(ORDERS_KEY, [newOrder, ...list]);
  return { ok: true, data: newOrder, isDemo: true };
}

export async function updateOrderStatus(id, status, note = '') {
  // TODO: PATCH /api/orders/:id/status (require manageOrders or updateOrderStatus permission on server)
  const list = readDemoStore(ORDERS_KEY, initialOrders);
  const updated = list.map((order) => {
    if (order.id !== id) return order;
    return {
      ...order,
      fulfillmentStatus: status,
      history: [
        ...(order.history || []),
        {
          status,
          note: note || `Status updated to ${status} (Demo)`,
          timestamp: new Date().toLocaleString(),
        },
      ],
    };
  });

  writeDemoStore(ORDERS_KEY, updated);
  return { ok: true, data: updated.find((o) => o.id === id), isDemo: true };
}
