/**
 * STAFF ENQUIRIES & QUOTE WORK QUEUE (/staff/enquiries)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as quoteService from '../../services/quoteService.js';
import { STAFF_NAV_ITEMS } from './staffNav.js';

export default function StaffEnquiriesPage() {
  const { currentUser, showToast } = useApp();
  const [quotes, setQuotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [noteText, setNoteText] = useState('');

  const loadEnquiries = () => {
    if (!currentUser) return;
    quoteService.getQuotes().then((all) => {
      setQuotes(
        currentUser.role === 'admin'
          ? all
          : all.filter((q) => q.assignedStaffId === currentUser.id || !q.assignedStaffId)
      );
    });
  };

  useEffect(() => {
    loadEnquiries();
  }, [currentUser]);

  const handleStatusUpdate = async (id, nextStatus) => {
    const res = await quoteService.updateQuoteStatus(id, nextStatus);
    loadEnquiries();
    if (selected?.id === id) setSelected(res.data);
    showToast(`Enquiry status updated to ${nextStatus}.`, 'success');
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || !selected) return;
    const res = await quoteService.addQuoteNote(selected.id, currentUser?.fullName, noteText.trim());
    setNoteText('');
    setSelected(res.data);
    loadEnquiries();
    showToast('Internal note saved in demo storage.', 'success');
  };

  const columns = [
    {
      key: 'id',
      label: 'Reference',
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelected(row)}
          className="font-semibold text-[#0B2545] hover:underline tabular-nums cursor-pointer"
        >
          {row.id}
        </button>
      ),
    },
    { key: 'customerName', label: 'Customer (Demo)' },
    { key: 'service', label: 'Service Requested' },
    { key: 'location', label: 'Location' },
    { key: 'createdAt', label: 'Date', render: (row) => <span className="tabular-nums">{row.createdAt}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'action',
      label: 'Details',
      render: (row) => (
        <Button variant="secondary" size="sm" onClick={() => setSelected(row)}>
          Open
        </Button>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="staff"
      portalTitle="Staff Workspace"
      pageTitle="Assigned Enquiries"
      navItems={STAFF_NAV_ITEMS}
      requiredPermission="manageQuotes"
    >
      <DataTable columns={columns} rows={quotes} emptyTitle="No assigned enquiries" />

      <Modal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={`Enquiry ${selected?.id || ''}`}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded bg-[#F8F9FA] border border-[#EAECEF]">
              <p><strong>Customer:</strong> {selected.customerName}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Service:</strong> {selected.service}</p>
              <p><strong>Location:</strong> {selected.location}</p>
              <p><strong>Budget:</strong> {selected.budgetRange || 'Not specified'}</p>
            </div>

            <div>
              <p className="font-semibold text-[#0B2545] mb-1">Request Description</p>
              <p className="text-[#4B5563]">{selected.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="stf-qt-status" className="text-xs font-semibold text-[#0B2545]">
                Update Status:
              </label>
              <select
                id="stf-qt-status"
                className="rehoyah-select w-48"
                value={selected.status}
                onChange={(e) => handleStatusUpdate(selected.id, e.target.value)}
              >
                {['Received', 'Under Review', 'Preparing', 'Sent', 'Accepted', 'Declined', 'Expired'].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-[#EAECEF] space-y-3">
              <p className="font-semibold text-[#0B2545]">Internal Notes</p>
              {(selected.internalNotes || []).map((n) => (
                <div key={n.id} className="p-2.5 rounded bg-[#F8F9FA] border border-[#EAECEF] text-xs">
                  <p className="text-[#111827]">{n.text}</p>
                  <p className="text-[#6B7280] mt-1">{n.author} · {n.date}</p>
                </div>
              ))}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  className="rehoyah-input flex-1"
                  placeholder="Add an internal coordinator note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <Button type="submit" variant="primary" size="sm">Save Note</Button>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}
