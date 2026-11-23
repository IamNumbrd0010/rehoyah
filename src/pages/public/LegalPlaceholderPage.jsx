/**
 * LEGAL PLACEHOLDER PAGE (PRIVACY POLICY & TERMS)
 */

import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';

export default function LegalPlaceholderPage({ type = 'privacy' }) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy (Placeholder)' : 'Terms of Use (Placeholder)';

  return (
    <PageShell>
      <div className="rehoyah-container py-12 max-w-3xl space-y-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />
        <h1 className="text-3xl font-bold text-[#0B2545]">{title}</h1>
        <div className="rehoyah-card p-6 md:p-8 space-y-4 text-sm text-[#4B5563] leading-relaxed">
          <p className="font-semibold text-[#0B2545]">
            Placeholder Notice — Replace with counsel-reviewed legal copy before production launch.
          </p>
          {isPrivacy ? (
            <>
              <p>
                When the backend database, authentication, payment processing (Paystack), and notification providers are connected, this policy should detail how Rehoyah collects, stores, secures, and retains customer names, phone numbers, delivery addresses, project photos, and order metadata in compliance with Nigerian Data Protection Regulation (NDPR / NDPA).
              </p>
              <p>
                In current Demo Mode, no personal records are transmitted to external servers; demo inputs remain inside your local browser storage only.
              </p>
            </>
          ) : (
            <>
              <p>
                This placeholder outlines future terms governing online product orders, itemized service quotations, site inspections, custom furniture lead times, and cancellation policies once Rehoyah launches live operations.
              </p>
              <p>
                All prices, timelines, and project records currently displayed on the frontend are sample demonstration placeholders.
              </p>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
