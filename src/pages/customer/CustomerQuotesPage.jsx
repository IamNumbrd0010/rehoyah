/**
 * CUSTOMER QUOTES PAGE (/account/quotes)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as quoteService from '../../services/quoteService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { CUSTOMER_NAV_ITEMS } from './customerNav.js';

export default function CustomerQuotesPage() {
  const { currentUser, showToast } = useApp();
  const [quotes, setQuotes] = useState([]);

  const loadQuotes = () => {
    if (!currentUser) return;
    quoteService.getQuotes({ customerId: currentUser.id }).then(setQuotes);
  };

  useEffect(() => {
    loadQuotes();
  }, [currentUser]);

  const handleDecision = async (id, nextStatus) => {
    await quoteService.updateQuoteStatus(id, nextStatus);
    loadQuotes();
    showToast(`Demo quote status updated to ${nextStatus}.`, 'info');
  };

  return (
    <DashboardShell
      portal="customer"
      portalTitle="Customer Portal"
      pageTitle="Quote Requests & Quotations"
      navItems={CUSTOMER_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#6B7280]">
            Track quote statuses (Received, Under Review, Preparing, Sent, Accepted, Declined, Expired).
          </p>
          <Button to="/request-quote" variant="primary" size="sm">Request New Quote</Button>
        </div>

        {quotes.length === 0 ? (
          <EmptyState
            title="No quote requests yet"
            description="Submit a quote request to preview how quotations appear here."
            actionLabel="Request a Quote"
            actionTo="/request-quote"
          />
        ) : (
          <div className="space-y-4">
            {quotes.map((qt) => {
              const items = qt.quotation?.lineItems || [];
              const sub = items.reduce((s, l) => s + Number(l.quantity) * Number(l.unitRate), 0);
              const total = Math.max(0, sub - Number(qt.quotation?.discount || 0));

              return (
                <div key={qt.id} className="rehoyah-card p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-[#6B7280] tabular-nums">{qt.id} · {qt.createdAt}</p>
                      <h3 className="text-base font-semibold text-[#0B2545]">
                        {qt.service} ({qt.propertyType})
                      </h3>
                      <p className="text-xs text-[#4B5563] mt-0.5">{qt.location}</p>
                    </div>
                    <StatusBadge status={qt.status} />
                  </div>

                  <p className="text-sm text-[#4B5563]">{qt.description}</p>

                  {qt.quotation && items.length > 0 && (
                    <div className="p-4 rounded bg-[#F8F9FA] border border-[#EAECEF] space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#0B2545]">
                        Prepared Demo Quotation
                      </p>
                      {items.map((li) => (
                        <div key={li.id} className="flex justify-between text-xs text-[#4B5563]">
                          <span>{li.description} (x{li.quantity})</span>
                          <span className="tabular-nums font-medium">{formatCurrency(li.quantity * li.unitRate)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-[#DEE2E6] flex justify-between text-sm font-bold text-[#0B2545]">
                        <span>Estimated Total (Demo)</span>
                        <span className="tabular-nums">{formatCurrency(total)}</span>
                      </div>
                      {qt.status === 'Sent' && (
                        <div className="flex gap-2 pt-2">
                          <Button variant="primary" size="sm" onClick={() => handleDecision(qt.id, 'Accepted')}>
                            Accept Demo Quote
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDecision(qt.id, 'Declined')}>
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
