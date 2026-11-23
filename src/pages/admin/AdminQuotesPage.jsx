/**
 * ADMIN QUOTATIONS & ENQUIRIES (/admin/quotes)
 * --------------------------------------------------------------------------
 * Supports assigning staff, logging internal notes, updating statuses, and
 * building itemized quotations (line items, rate, quantity, discount, valid-until).
 */

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as quoteService from '../../services/quoteService.js';
import * as staffService from '../../services/staffService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

const QUOTE_STATUSES = ['Received', 'Under Review', 'Preparing', 'Sent', 'Accepted', 'Declined', 'Expired'];

export default function AdminQuotesPage() {
  const { showToast } = useApp();
  const [quotes, setQuotes] = useState([]);
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [discount, setDiscount] = useState('0');
  const [validUntil, setValidUntil] = useState('2026-04-30');
  const [terms, setTerms] = useState('Demo quotation preview — not an official quote until backend email/PDF delivery is wired.');

  const loadData = () => {
    Promise.all([
      quoteService.getQuotes({ search, status: statusFilter }),
      staffService.getStaff(),
    ]).then(([q, s]) => {
      setQuotes(q);
      setStaff(s);
    });
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const openQuoteModal = (q) => {
    setSelected(q);
    setLineItems(
      q.quotation?.lineItems || [{ id: `li-${Date.now()}`, description: q.service, quantity: 1, unitRate: 0 }]
    );
    setDiscount(String(q.quotation?.discount || 0));
    setValidUntil(q.quotation?.validUntil || '2026-04-30');
    setTerms(q.quotation?.terms || 'Demo quotation preview.');
  };

  const subtotal = lineItems.reduce((s, li) => s + Number(li.quantity || 0) * Number(li.unitRate || 0), 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0));

  const handleSaveQuotation = async (nextStatus) => {
    if (!selected) return;
    const res = await quoteService.createQuotation(selected.id, {
      lineItems,
      discount: Number(discount) || 0,
      validUntil,
      terms,
      nextStatus,
    });
    setSelected(res.data);
    loadData();
    showToast(
      nextStatus === 'Sent'
        ? 'Demo quotation marked Sent (no real email sent).'
        : 'Demo quotation saved.',
      'success'
    );
  };

  const columns = [
    {
      key: 'id',
      label: 'Ref',
      render: (row) => (
        <button type="button" onClick={() => openQuoteModal(row)} className="font-semibold text-[#0B2545] hover:underline tabular-nums cursor-pointer">
          {row.id}
        </button>
      ),
    },
    { key: 'customerName', label: 'Client (Demo)' },
    { key: 'service', label: 'Service' },
    { key: 'assignedStaffName', label: 'Assigned Staff' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button variant="secondary" size="sm" onClick={() => openQuoteModal(row)}>
          Prepare Quote
        </Button>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Quotations & Enquiries"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="rehoyah-card p-4 flex flex-wrap gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search quote ID, client, location..." label="Search quotes" className="w-64" />
          <select className="rehoyah-select w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <DataTable columns={columns} rows={quotes} />
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={`Quote Workspace: ${selected?.id || ''}`} maxWidth="max-w-3xl">
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded bg-[#F8F9FA] border border-[#EAECEF]">
              <p><strong>Client:</strong> {selected.customerName}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p><strong>Service:</strong> {selected.service} ({selected.propertyType})</p>
              <p><strong>Location:</strong> {selected.location}</p>
              <p className="sm:col-span-2"><strong>Request:</strong> {selected.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="rehoyah-label">Assign Staff</label>
                <select
                  className="rehoyah-select"
                  value={selected.assignedStaffId || ''}
                  onChange={async (e) => {
                    const member = staff.find((s) => s.id === e.target.value);
                    const res = await quoteService.assignQuoteStaff(
                      selected.id,
                      member?.id || null,
                      member?.fullName || 'Unassigned'
                    );
                    setSelected(res.data);
                    loadData();
                  }}
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                </select>
              </div>
              <div>
                <label className="rehoyah-label">Quote Status</label>
                <select
                  className="rehoyah-select"
                  value={selected.status}
                  onChange={async (e) => {
                    const res = await quoteService.updateQuoteStatus(selected.id, e.target.value);
                    setSelected(res.data);
                    loadData();
                  }}
                >
                  {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Line Item Quotation Builder */}
            <div className="pt-3 border-t border-[#EAECEF] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#0B2545]">Quotation Line Items (Demo Builder)</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setLineItems([...lineItems, { id: `li-${Date.now()}`, description: '', quantity: 1, unitRate: 0 }])
                  }
                >
                  <Plus className="w-3.5 h-3.5" /> Add Line
                </Button>
              </div>

              {lineItems.map((li, idx) => (
                <div key={li.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Item / Scope description"
                    className="rehoyah-input col-span-6"
                    value={li.description}
                    onChange={(e) => {
                      const next = [...lineItems];
                      next[idx] = { ...li, description: e.target.value };
                      setLineItems(next);
                    }}
                  />
                  <input
                    type="number"
                    min={1}
                    className="rehoyah-input col-span-2 tabular-nums"
                    value={li.quantity}
                    onChange={(e) => {
                      const next = [...lineItems];
                      next[idx] = { ...li, quantity: Number(e.target.value) };
                      setLineItems(next);
                    }}
                  />
                  <input
                    type="number"
                    min={0}
                    className="rehoyah-input col-span-3 tabular-nums"
                    value={li.unitRate}
                    onChange={(e) => {
                      const next = [...lineItems];
                      next[idx] = { ...li, unitRate: Number(e.target.value) };
                      setLineItems(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))}
                    aria-label="Remove line item"
                    className="col-span-1 p-2 text-[#6B7280] hover:text-[#B91C1C]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="rehoyah-label">Discount (₦)</label>
                  <input type="number" className="rehoyah-input tabular-nums" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                </div>
                <div>
                  <label className="rehoyah-label">Valid Until</label>
                  <input type="date" className="rehoyah-input" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                </div>
              </div>

              <div className="p-3 rounded bg-[#F8F9FA] border border-[#EAECEF] flex justify-between font-bold text-[#0B2545]">
                <span>Demo Quotation Total</span>
                <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleSaveQuotation('Preparing')}>
                  Save Draft
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleSaveQuotation('Sent')}>
                  Mark Sent (Demo Placeholder)
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}
