/**
 * CUSTOMER ORDER DETAIL PAGE (/account/orders/:id)
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import * as orderService from '../../services/orderService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { CUSTOMER_NAV_ITEMS } from './customerNav.js';

export default function CustomerOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderService.getOrderById(id).then(setOrder);
  }, [id]);

  return (
    <DashboardShell
      portal="customer"
      portalTitle="Customer Portal"
      pageTitle={`Order ${id}`}
      navItems={CUSTOMER_NAV_ITEMS}
    >
      {!order ? (
        <EmptyState
          title="Order not found"
          description="This demo order reference could not be found."
          actionLabel="Back to Orders"
          actionTo="/account/orders"
        />
      ) : (
        <div className="space-y-6">
          <div className="rehoyah-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#6B7280] tabular-nums">Created {order.createdAt}</p>
              <h2 className="text-xl font-bold text-[#0B2545] tabular-nums">{order.id}</h2>
              <p className="text-xs text-[#6B7280] mt-1">{order.paymentStatus}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.fulfillmentStatus} />
              <Button to="/account/orders" variant="secondary" size="sm">All Orders</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 rehoyah-card p-6 space-y-4">
              <h3 className="text-base font-semibold text-[#0B2545]">Items</h3>
              <div className="divide-y divide-[#EAECEF]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-[#0B2545]">{item.name}</p>
                      <p className="text-xs text-[#6B7280]">
                        Variant: {item.variant} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-[#0B2545] tabular-nums">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#EAECEF] flex justify-between text-base font-bold text-[#0B2545]">
                <span>Demo Total</span>
                <span className="tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="rehoyah-card p-5 space-y-2 text-sm">
                <h3 className="font-semibold text-[#0B2545]">Fulfillment Details</h3>
                <p className="text-[#4B5563]"><strong>Method:</strong> {order.deliveryMethod}</p>
                <p className="text-[#4B5563]"><strong>Address:</strong> {order.deliveryAddress}</p>
              </div>
              <div className="rehoyah-card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[#0B2545]">Status History (Demo)</h3>
                <ul className="space-y-2 text-xs text-[#4B5563]">
                  {(order.history || []).map((h, i) => (
                    <li key={i} className="pb-2 border-b border-[#F1F3F5] last:border-none">
                      <p className="font-semibold text-[#0B2545]">{h.status}</p>
                      <p>{h.note}</p>
                      <p className="text-[#9CA3AF] mt-0.5">{h.timestamp}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
