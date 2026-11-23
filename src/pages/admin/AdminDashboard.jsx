/**
 * ADMIN CONTROL CENTER OVERVIEW (/admin)
 */

import { useEffect, useState } from 'react';
import { FileText, FolderKanban, Package, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import * as orderService from '../../services/orderService.js';
import * as productService from '../../services/productService.js';
import * as projectService from '../../services/projectService.js';
import * as quoteService from '../../services/quoteService.js';
import * as staffService from '../../services/staffService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    Promise.all([
      productService.getProducts(),
      orderService.getOrders(),
      quoteService.getQuotes(),
      projectService.getProjects(),
      staffService.getActivityLogs(),
    ]).then(([p, o, q, pr, l]) => {
      setProducts(p);
      setOrders(o);
      setQuotes(q);
      setProjects(pr);
      setLogs(l);
    });
  }, []);

  const pendingProducts = products.filter((p) => p.status === 'pending' || p.status === 'draft');
  const openQuotes = quotes.filter((q) => ['Received', 'Under Review', 'Preparing'].includes(q.status));

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      portalSubtitle="Demo Mode Active"
      pageTitle="Admin Overview"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-6">
        <div className="rehoyah-card p-5 bg-[#0B2545] text-white border-[#0B2545] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Demonstration Snapshot
            </p>
            <p className="text-sm text-[#E5E7EB] mt-1">
              All counts and activity items below reflect local sample data only—not live business analytics.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button to="/admin/products" variant="gold" size="sm">Manage Products</Button>
            <Button to="/admin/quotes" variant="secondary" size="sm">Review Quotes</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Demo Orders" value={orders.length} note="Unpaid draft records" icon={ShoppingCart} />
          <StatCard label="Open Quote Enquiries" value={openQuotes.length} note={`${quotes.length} total demo quotes`} icon={FileText} />
          <StatCard label="Catalogue Products" value={products.length} note={`${pendingProducts.length} draft/pending`} icon={Package} />
          <StatCard label="Portfolio & Projects" value={projects.length} note="Demo project records" icon={FolderKanban} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Items Requiring Attention */}
          <div className="lg:col-span-6 rehoyah-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0B2545]">Items Requiring Attention (Demo)</h2>
              <Link to="/admin/quotes" className="text-xs font-semibold text-[#0B2545] hover:underline">
                Open Quotes
              </Link>
            </div>
            <div className="divide-y divide-[#EAECEF]">
              {openQuotes.map((q) => (
                <div key={q.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0B2545]">{q.customerName} — {q.service}</p>
                    <p className="text-xs text-[#6B7280] tabular-nums">{q.id} · {q.location}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
              ))}
              {pendingProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0B2545]">Product submission: {p.name}</p>
                    <p className="text-xs text-[#6B7280] tabular-nums">{formatCurrency(p.price)}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
              {openQuotes.length === 0 && pendingProducts.length === 0 && (
                <p className="text-sm text-[#6B7280]">No pending items in demo queue.</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-6 rehoyah-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0B2545]">Recent Staff &amp; Admin Activity (Demo)</h2>
              <Link to="/admin/activity" className="text-xs font-semibold text-[#0B2545] hover:underline">
                View All Logs
              </Link>
            </div>
            <div className="divide-y divide-[#EAECEF]">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#0B2545]">{log.action}</span>
                    <span className="text-xs text-[#6B7280]">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#4B5563]">
                    {log.actor} · {log.targetType}: {log.targetName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
