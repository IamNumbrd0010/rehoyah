/**
 * CUSTOMER ORDERS PAGE (/account/orders)
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as orderService from '../../services/orderService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { CUSTOMER_NAV_ITEMS } from './customerNav.js';

export default function CustomerOrdersPage() {
  const { currentUser } = useApp();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    orderService.getOrders({ customerId: currentUser.id }).then(setOrders);
  }, [currentUser]);

  const columns = [
    {
      key: 'id',
      label: 'Order Ref',
      render: (row) => (
        <Link to={`/account/orders/${row.id}`} className="font-semibold text-[#0B2545] hover:underline tabular-nums">
          {row.id}
        </Link>
      ),
    },
    { key: 'createdAt', label: 'Date', render: (row) => <span className="tabular-nums">{row.createdAt}</span> },
    { key: 'items', label: 'Items', render: (row) => `${row.items.length} item(s)` },
    { key: 'total', label: 'Demo Total', align: 'right', render: (row) => <span className="font-semibold tabular-nums">{formatCurrency(row.total)}</span> },
    { key: 'paymentStatus', label: 'Payment', render: (row) => <span className="text-xs text-[#6B7280]">{row.paymentStatus}</span> },
    { key: 'fulfillmentStatus', label: 'Fulfillment', render: (row) => <StatusBadge status={row.fulfillmentStatus} /> },
  ];

  return (
    <DashboardShell
      portal="customer"
      portalTitle="Customer Portal"
      pageTitle="My Orders (Demo)"
      navItems={CUSTOMER_NAV_ITEMS}
    >
      <div className="space-y-4">
        <p className="text-xs text-[#6B7280]">
          Order records shown here are local demo drafts. Live order tracking and Paystack payment verification activate after backend connection.
        </p>
        <DataTable
          columns={columns}
          rows={orders}
          emptyTitle="No demo orders found"
          emptyDescription="Add products to your cart and submit a demo checkout draft to see it here."
        />
      </div>
    </DashboardShell>
  );
}
