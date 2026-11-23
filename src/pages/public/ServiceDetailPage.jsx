/**
 * SERVICE DETAIL TEMPLATE PAGE
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import * as contentService from '../../services/contentService.js';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      contentService.getServiceBySlug(slug),
      contentService.getServices({ activeOnly: true }),
    ]).then(([found, all]) => {
      if (!active) return;
      setService(found);
      if (found) {
        setRelated(all.filter((s) => s.id !== found.id && s.category === found.category).slice(0, 3));
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <PageShell>
      <div className="rehoyah-container-wide py-10 md:py-14">
        {loading ? (
          <LoadingState rows={4} />
        ) : !service ? (
          <EmptyState
            title="Service not found"
            description="The requested service could not be located."
            actionLabel="Browse All Services"
            actionTo="/services"
          />
        ) : (
          <div className="space-y-12">
            <div>
              <Breadcrumbs
                items={[
                  { label: 'Home', to: '/' },
                  { label: 'Services', to: '/services' },
                  { label: service.name },
                ]}
              />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
                    {service.category}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#0B2545]">{service.name}</h1>
                  <p className="text-base text-[#4B5563] leading-relaxed">{service.description}</p>

                  {service.process?.length > 0 && (
                    <div className="pt-4">
                      <h2 className="text-lg font-semibold text-[#0B2545] mb-3">Typical Execution Steps</h2>
                      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.process.map((step, i) => (
                          <li key={step} className="rehoyah-card p-3.5 text-sm text-[#111827] flex items-start gap-2.5">
                            <span className="text-xs font-bold text-[#B39022] tabular-nums mt-0.5">
                              0{i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button to={`/request-quote?service=${encodeURIComponent(service.name)}`} variant="primary">
                      Request a Quote for {service.name}
                    </Button>
                    <Button to="/book-consultation" variant="secondary">
                      Book Site Consultation
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="aspect-[4/3] rounded-md overflow-hidden border border-[#DEE2E6] bg-[#F8F9FA]">
                    <img
                      src={service.image}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Service gallery slot — project photos can be linked per service in Admin &gt; Services.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Placeholder */}
            <div className="rehoyah-card p-6 md:p-8 bg-[#F8F9FA]">
              <h2 className="text-lg font-semibold text-[#0B2545] mb-4">Service FAQs (Editable Placeholder)</h2>
              {service.faqs?.length > 0 ? (
                <div className="space-y-4">
                  {service.faqs.map((faq) => (
                    <div key={faq.q}>
                      <h3 className="text-sm font-semibold text-[#0B2545]">{faq.q}</h3>
                      <p className="text-sm text-[#4B5563] mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#4B5563]">
                  Frequently asked questions and scope notes for {service.name} can be added by an administrator in Admin &gt; Services.
                </p>
              )}
            </div>

            {/* Related Services */}
            {related.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#0B2545] mb-4">Related Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {related.map((rel) => (
                    <Link key={rel.id} to={`/services/${rel.slug}`} className="rehoyah-card rehoyah-card-interactive p-5">
                      <p className="text-xs text-[#6B7280]">{rel.category}</p>
                      <h3 className="mt-1 text-base font-semibold text-[#0B2545]">{rel.name}</h3>
                      <p className="mt-1.5 text-sm text-[#4B5563] line-clamp-2">{rel.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
