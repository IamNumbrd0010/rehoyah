/**
 * ADMIN ORDER MANAGEMENT (/admin/orders)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Modal from '../../components/common/Modal.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as orderService from '../../services/orderService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const { showToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const loadOrders = () => {
    orderService.getOrders({ search, status: statusFilter }).then(setOrders);
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter]);

  const handleStatusChange = async (id, nextStatus) => {
    const res = await orderService.updateOrderStatus(id, nextStatus);
    loadOrders();
    if (selected?.id === id) setSelected(res.data);
    showToast(`Order ${id} updated to ${nextStatus} (Demo).`, 'success');
  };

  const columns = [
    {
      key: 'id',
      label: 'Order Ref',
      render: (row) => (
        <button type="button" onClick={() => setSelected(row)} className="font-semibold text-[#0B2545] hover:underline tabular-nums cursor-pointer">
          {row.id}
        </button>
      ),
    },
    { key: 'customerName', label: 'Customer (Demo)' },
    { key: 'createdAt', label: 'Date', render: (row) => <span className="tabular-nums">{row.createdAt}</span> },
    { key: 'total', label: 'Total', align: 'right', render: (row) => <span className="tabular-nums font-semibold">{formatCurrency(row.total)}</span> },
    { key: 'fulfillmentStatus', label: 'Fulfillment', render: (row) => <StatusBadge status={row.fulfillmentStatus} /> },
    {
      key: 'actions',
      label: 'Manage',
      render: (row) => (
        <Button variant="secondary" size="sm" onClick={() => setSelected(row)}>View / Update</Button>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Order Management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="rehoyah-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search order ID or customer..." label="Search orders" className="w-64" />
            <select className="rehoyah-select w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Button variant="secondary" size="sm" onClick={() => showToast('Export placeholder — connect CSV/API export on backend.', 'info')}>
            Export Orders (Placeholder)
          </Button>
        </div>

        <DataTable columns={columns} rows={orders} />
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={`Order Detail: ${selected?.id || ''}`} maxWidth="max-w-2xl">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="p-4 rounded bg-[#F8F9FA] border border-[#EAECEF] grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p><strong>Customer:</strong> {selected.customerName}</p>
              <p><strong>Phone:</strong> {selected.customerPhone}</p>
              <p><strong>Method:</strong> {selected.deliveryMethod}</p>
              <p><strong>Payment:</strong> {selected.paymentStatus}</p>
              <p className="sm:col-span-2"><strong>Address:</strong> {selected.deliveryAddress}</p>
            </div>

            <div className="divide-y divide-[#EAECEF] border border-[#EAECEF] rounded p-3">
              {selected.items.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span>{item.name} ({item.variant}) x{item.quantity}</span>
                  <span className="tabular-nums font-semibold">{formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold">Fulfillment Status:</label>
                <select
                  className="rehoyah-select w-44"
                  value={selected.fulfillmentStatus}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                >
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {selected.fulfillmentStatus !== 'Cancelled' && (
                <Button variant="danger" size="sm" onClick={() => setConfirmCancel(selected)}>
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(confirmCancel)}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => handleStatusChange(confirmCancel.id, 'Cancelled')}
        title="Cancel Demo Order?"
        message={`Mark ${confirmCancel?.id || ''} as Cancelled?`}
        confirmLabel="Cancel Order"
      />
    </DashboardShell>
  );
}
