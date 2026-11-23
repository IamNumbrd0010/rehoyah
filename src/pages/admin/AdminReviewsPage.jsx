/**
 * ADMIN REVIEWS & TESTIMONIALS MODERATION (/admin/reviews)
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminReviewsPage() {
  const { showToast } = useApp();
  const [reviews, setReviews] = useState([]);

  const loadReviews = () => contentService.getTestimonials(false).then(setReviews);
  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (id, status, published) => {
    await contentService.updateTestimonial(id, { status, published });
    loadReviews();
    showToast(`Sample review marked ${status}.`, 'info');
  };

  const columns = [
    { key: 'customerName', label: 'Client (Sample)' },
    { key: 'projectType', label: 'Project Type' },
    { key: 'text', label: 'Feedback Placeholder', render: (row) => <p className="max-w-md text-xs text-[#4B5563]">{row.text}</p> },
    { key: 'status', label: 'Approval', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Moderation',
      render: (row) => (
        <div className="flex gap-1.5">
          <Button variant="primary" size="sm" onClick={() => handleModerate(row.id, 'Approved', true)}>
            Approve &amp; Publish
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleModerate(row.id, 'Rejected', false)}>
            Unpublish
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Reviews & Testimonials Moderation"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-4">
        <p className="text-xs text-[#6B7280]">
          Only verified, genuine client testimonials should be published live. Entries below are visibly marked demo placeholders.
        </p>
        <DataTable columns={columns} rows={reviews} />
      </div>
    </DashboardShell>
  );
}
