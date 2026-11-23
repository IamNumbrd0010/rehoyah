/**
 * ADMIN CUSTOMERS DIRECTORY (/admin/customers)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import * as orderService from '../../services/orderService.js';
import * as quoteService from '../../services/quoteService.js';
import * as staffService from '../../services/staffService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [custOrders, setCustOrders] = useState([]);
  const [custQuotes, setCustQuotes] = useState([]);

  useEffect(() => {
    staffService.getCustomers().then(setCustomers);
  }, []);

  const openCustomer = async (cust) => {
    setSelected(cust);
    const [o, q] = await Promise.all([
      orderService.getOrders({ customerId: cust.id }),
      quoteService.getQuotes({ customerId: cust.id }),
    ]);
    setCustOrders(o);
    setCustQuotes(q);
  };

  const filtered = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    return !q || c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const columns = [
    { key: 'fullName', label: 'Customer (Demo)', render: (row) => <span className="font-semibold text-[#0B2545]">{row.fullName}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'actions', label: 'Details', render: (row) => <Button variant="secondary" size="sm" onClick={() => openCustomer(row)}>Profile</Button> },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Customers (Demo Directory)"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search customers..." label="Search customers" className="max-w-sm" />
        <DataTable columns={columns} rows={filtered} />
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.fullName || 'Customer Profile'} maxWidth="max-w-xl">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="p-4 rounded bg-[#F8F9FA] border border-[#EAECEF] space-y-1">
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone || '—'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#0B2545] mb-1">Demo Orders ({custOrders.length})</h3>
              <p className="text-xs text-[#6B7280]">{custOrders.map((o) => o.id).join(', ') || 'None'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#0B2545] mb-1">Demo Quote Requests ({custQuotes.length})</h3>
              <p className="text-xs text-[#6B7280]">{custQuotes.map((q) => q.id).join(', ') || 'None'}</p>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}
