/**
 * CUSTOMER DASHBOARD OVERVIEW (/account)
 */

import { useEffect, useState } from 'react';
import { FileText, FolderKanban, Heart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as orderService from '../../services/orderService.js';
import * as projectService from '../../services/projectService.js';
import * as quoteService from '../../services/quoteService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { CUSTOMER_NAV_ITEMS } from './customerNav.js';

export default function CustomerDashboard() {
  const { currentUser, wishlistIds } = useApp();
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    Promise.all([
      orderService.getOrders({ customerId: currentUser.id }),
      quoteService.getQuotes({ customerId: currentUser.id }),
      projectService.getProjects({ customerId: currentUser.id }),
    ]).then(([ord, qt, proj]) => {
      setOrders(ord);
      setQuotes(qt);
      setProjects(proj);
    });
  }, [currentUser]);

  return (
    <DashboardShell
      portal="customer"
      portalTitle="Customer Portal"
      portalSubtitle="Demo Account Preview"
      pageTitle="Account Overview"
      navItems={CUSTOMER_NAV_ITEMS}
    >
      <div className="space-y-6">
        <div className="rehoyah-card p-5 bg-[#0B2545] text-white border-[#0B2545] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Demo Customer Workspace
            </p>
            <h2 className="text-xl font-bold text-white mt-1">
              Welcome, {currentUser?.fullName}
            </h2>
            <p className="text-xs text-[#D1D5DB] mt-1">
              All orders, quotes, saved items, and project updates here are stored in browser demo storage until backend persistence is connected.
            </p>
          </div>
          <Button to="/request-quote" variant="gold" size="sm">
            New Quote Request
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Demo Orders" value={orders.length} note="Unpaid demo drafts" icon={Package} />
          <StatCard label="Saved Wishlist Items" value={wishlistIds.length} note="Local browser state" icon={Heart} />
          <StatCard label="Quote Requests" value={quotes.length} note="Demo submissions" icon={FileText} />
          <StatCard label="Linked Projects" value={projects.length} note="Progress placeholders" icon={FolderKanban} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rehoyah-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#0B2545]">Recent Demo Orders</h3>
              <Link to="/account/orders" className="text-xs font-semibold text-[#0B2545] hover:underline">
                View All
              </Link>
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-[#6B7280]">No demo orders yet.</p>
            ) : (
              <div className="divide-y divide-[#EAECEF]">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <Link to={`/account/orders/${ord.id}`} className="text-sm font-semibold text-[#0B2545] hover:underline tabular-nums">
                        {ord.id}
                      </Link>
                      <p className="text-xs text-[#6B7280]">{ord.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold tabular-nums">{formatCurrency(ord.total)}</span>
                      <StatusBadge status={ord.fulfillmentStatus} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rehoyah-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#0B2545]">Recent Quote Requests</h3>
              <Link to="/account/quotes" className="text-xs font-semibold text-[#0B2545] hover:underline">
                View All
              </Link>
            </div>
            {quotes.length === 0 ? (
              <p className="text-sm text-[#6B7280]">No demo quote requests yet.</p>
            ) : (
              <div className="divide-y divide-[#EAECEF]">
                {quotes.slice(0, 3).map((qt) => (
                  <div key={qt.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0B2545]">{qt.service}</p>
                      <p className="text-xs text-[#6B7280] tabular-nums">{qt.id} · {qt.location}</p>
                    </div>
                    <StatusBadge status={qt.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
