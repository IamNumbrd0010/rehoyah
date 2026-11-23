/**
 * INSPIRATION & ARTICLES PAGE (DEMO EDITORIAL)
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import * as contentService from '../../services/contentService.js';

const ARTICLE_CATEGORIES = ['all', 'Colour & Paint', 'Interior Design', 'Maintenance', 'Commercial Spaces', 'Materials Guide', 'Trends'];

export default function InspirationPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    contentService
      .getArticles({ publishedOnly: true, category, search })
      .then((list) => {
        if (!active) return;
        setArticles(list);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, search]);

  const featured = articles.find((a) => a.featured) || articles[0];
  const rest = featured ? articles.filter((a) => a.id !== featured.id) : [];

  return (
    <PageShell>
      <section className="bg-[#F8F9FA] border-b border-[#EAECEF] py-10">
        <div className="rehoyah-container-wide">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Inspiration' }]} />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
            Editorial Guides · Demo Content
          </p>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold text-[#0B2545]">
            Design Inspiration &amp; Surface Care
          </h1>
          <p className="mt-2 text-sm text-[#4B5563] max-w-2xl">
            Sample guides on choosing finishes, colours, wallpapers, lighting, and furniture. Replace and expand via Admin &gt; Articles.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="rehoyah-container-wide space-y-8">
          <div className="rehoyah-card p-4 space-y-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search articles..."
              label="Search articles"
              className="max-w-md"
            />
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F1F3F5]">
              {ARTICLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border cursor-pointer ${
                    category === cat
                      ? 'bg-[#0B2545] text-white border-[#0B2545]'
                      : 'bg-[#F8F9FA] text-[#4B5563] border-[#EAECEF]'
                  }`}
                >
                  {cat === 'all' ? 'All Topics' : cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingState rows={3} />
          ) : articles.length === 0 ? (
            <EmptyState
              title="No demo articles matched"
              description="Clear your search or choose All Topics."
              actionLabel="Reset"
              onAction={() => {
                setCategory('all');
                setSearch('');
              }}
            />
          ) : (
            <div className="space-y-8">
              {featured && (
                <article className="rehoyah-card overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                  <Link to={`/inspiration/${featured.slug}`} className="lg:col-span-6 bg-[#F1F3F5] aspect-[16/10] lg:aspect-auto">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-center space-y-3">
                    <p className="text-xs text-[#6B7280] flex items-center gap-2">
                      <span className="font-semibold text-[#B39022]">Featured Demo Guide</span>
                      <span aria-hidden="true">·</span>
                      <span>{featured.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{featured.readTimePlaceholder}</span>
                    </p>
                    <h2 className="text-2xl font-bold text-[#0B2545]">
                      <Link to={`/inspiration/${featured.slug}`} className="hover:underline">
                        {featured.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-[#4B5563] leading-relaxed">{featured.excerpt}</p>
                    <Link to={`/inspiration/${featured.slug}`} className="text-sm font-semibold text-[#0B2545] hover:underline pt-1">
                      Read Full Guide
                    </Link>
                  </div>
                </article>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((art) => (
                  <article key={art.id} className="rehoyah-card rehoyah-card-interactive overflow-hidden flex flex-col">
                    <Link to={`/inspiration/${art.slug}`} className="block aspect-[16/10] bg-[#F1F3F5] border-b border-[#EAECEF]">
                      <img
                        src={art.image}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                          <span>{art.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{art.datePlaceholder}</span>
                        </p>
                        <h3 className="mt-1.5 text-lg font-semibold text-[#0B2545]">
                          <Link to={`/inspiration/${art.slug}`} className="hover:underline">
                            {art.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm text-[#4B5563] line-clamp-2">{art.excerpt}</p>
                      </div>
                      <Link to={`/inspiration/${art.slug}`} className="text-xs font-semibold text-[#0B2545] hover:underline">
                        Read Article
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
