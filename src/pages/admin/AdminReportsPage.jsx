/**
 * ADMIN DEMO REPORTS PAGE (/admin/reports)
 * --------------------------------------------------------------------------
 * Summarizes local demo counts only. Clearly marked as Demonstration Data
 * so it is never mistaken for live financial or operational telemetry.
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as orderService from '../../services/orderService.js';
import * as productService from '../../services/productService.js';
import * as projectService from '../../services/projectService.js';
import * as quoteService from '../../services/quoteService.js';
import * as staffService from '../../services/staffService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminReportsPage() {
  const { showToast } = useApp();
  const [range, setRange] = useState('30d');
  const [summary, setSummary] = useState({
    products: 0,
    outOfStock: 0,
    orders: 0,
    orderDraftVolume: 0,
    quotes: 0,
    projects: 0,
    tasksOpen: 0,
  });

  useEffect(() => {
    Promise.all([
      productService.getProducts(),
      orderService.getOrders(),
      quoteService.getQuotes(),
      projectService.getProjects(),
      staffService.getTasks(),
    ]).then(([prods, ords, qts, projs, tsks]) => {
      setSummary({
        products: prods.length,
        outOfStock: prods.filter((p) => !p.inStock || p.stockQuantity <= 0).length,
        orders: ords.length,
        orderDraftVolume: ords.reduce((s, o) => s + Number(o.total || 0), 0),
        quotes: qts.length,
        projects: projs.length,
        tasksOpen: tsks.filter((t) => t.status !== 'Completed').length,
      });
    });
  }, [range]);

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Reports Summary (Demo Data Only)"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-6">
        <div className="rehoyah-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] px-3 py-1.5 rounded">
            <strong>DEMO REPORTS NOTICE:</strong> Figures reflect local demo records only—not real company revenue or live analytics.
          </p>
          <div className="flex items-center gap-2">
            <select className="rehoyah-select w-36" value={range} onChange={(e) => setRange(e.target.value)} aria-label="Demo date range">
              <option value="7d">Last 7 days (Demo)</option>
              <option value="30d">Last 30 days (Demo)</option>
              <option value="90d">Last 90 days (Demo)</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => showToast('Export placeholder — connect backend CSV generator.', 'info')}
            >
              Export CSV (Placeholder)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Sample Products" value={summary.products} note={`${summary.outOfStock} out of stock`} />
          <StatCard label="Demo Order Drafts" value={summary.orders} note={`Draft sum: ${formatCurrency(summary.orderDraftVolume)}`} />
          <StatCard label="Demo Quote Pipeline" value={summary.quotes} note="Sample quote requests" />
          <StatCard label="Open Staff Tasks" value={summary.tasksOpen} note={`${summary.projects} demo projects`} />
        </div>
      </div>
    </DashboardShell>
  );
}
