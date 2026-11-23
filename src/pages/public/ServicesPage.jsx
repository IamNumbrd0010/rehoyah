/**
 * SERVICES DIRECTORY PAGE
 * --------------------------------------------------------------------------
 * Data-driven listing of all active services across Finishing & Wall
 * Treatments, Furniture & Custom Production, and Renovation & Consultation.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import * as contentService from '../../services/contentService.js';

const SERVICE_CATEGORIES = [
  'all',
  'Finishing & Wall Treatments',
  'Furniture & Custom Production',
  'Renovation & Consultation',
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    contentService.getServices({ activeOnly: true }).then((list) => {
      setServices(list);
      setLoading(false);
    });
  }, []);

  const filtered = services.filter((s) => {
    const matchCat = category === 'all' || s.category === category;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <PageShell>
      <section className="bg-[#F8F9FA] border-b border-[#EAECEF] py-10 md:py-14">
        <div className="rehoyah-container-wide">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
                Professional Execution
              </p>
              <h1 className="mt-1 text-3xl md:text-4xl font-bold text-[#0B2545]">
                Interior, Exterior &amp; Custom Furniture Services
              </h1>
              <p className="mt-2.5 text-sm md:text-base text-[#4B5563]">
                Explore our complete service catalogue. Pricing is tailored per project scope and site measurements—request a quote for an itemized estimate.
              </p>
            </div>
            <Button to="/request-quote" variant="primary">
              Request a Quote
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="rehoyah-container-wide space-y-8">
          <div className="rehoyah-card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border cursor-pointer transition-colors ${
                    category === cat
                      ? 'bg-[#0B2545] text-white border-[#0B2545]'
                      : 'bg-[#F8F9FA] text-[#4B5563] border-[#EAECEF] hover:border-[#CED4DA]'
                  }`}
                >
                  {cat === 'all' ? 'All Services' : cat}
                </button>
              ))}
            </div>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search services..."
              label="Search services"
              className="w-full lg:w-72"
            />
          </div>

          {loading ? (
            <LoadingState rows={4} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((srv) => (
                <article key={srv.id} className="rehoyah-card rehoyah-card-interactive overflow-hidden flex flex-col">
                  <Link to={`/services/${srv.slug}`} className="block aspect-[16/10] bg-[#F1F3F5] border-b border-[#EAECEF]">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#6B7280]">{srv.category}</p>
                      <h2 className="mt-1 text-lg font-semibold text-[#0B2545]">
                        <Link to={`/services/${srv.slug}`} className="hover:underline">
                          {srv.name}
                        </Link>
                      </h2>
                      <p className="mt-2 text-sm text-[#4B5563]">{srv.shortDescription}</p>
                    </div>
                    <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between">
                      <Link
                        to={`/services/${srv.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B2545] hover:underline"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/request-quote?service=${encodeURIComponent(srv.name)}`}
                        className="text-xs font-semibold text-[#B39022] hover:underline"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
