/**
 * ARTICLE DETAIL PAGE
 */

import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';

export default function ArticleDetailPage() {
  const { articleSlug } = useParams();
  const { showToast } = useApp();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      contentService.getArticleBySlug(articleSlug),
      contentService.getArticles({ publishedOnly: true }),
    ]).then(([found, all]) => {
      if (!active) return;
      setArticle(found);
      if (found) {
        setRelated(all.filter((a) => a.id !== found.id).slice(0, 3));
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [articleSlug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard.', 'success');
    }
  };

  return (
    <PageShell>
      <div className="rehoyah-container py-10 md:py-14">
        {loading ? (
          <LoadingState rows={4} />
        ) : !article ? (
          <EmptyState
            title="Article not found"
            description="This sample article could not be found."
            actionLabel="Back to Inspiration"
            actionTo="/inspiration"
          />
        ) : (
          <article className="max-w-3xl mx-auto space-y-8">
            <Breadcrumbs
              items={[
                { label: 'Home', to: '/' },
                { label: 'Inspiration', to: '/inspiration' },
                { label: article.title },
              ]}
            />

            <header className="space-y-4">
              <p className="text-xs text-[#6B7280] flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#B39022]">{article.category}</span>
                <span aria-hidden="true">·</span>
                <span>{article.datePlaceholder}</span>
                <span aria-hidden="true">·</span>
                <span>{article.readTimePlaceholder}</span>
                <span aria-hidden="true">·</span>
                <span>{article.authorPlaceholder}</span>
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0B2545] leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-[#6B7280]">Sample Demo Article — editable in Admin &gt; Articles</p>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2545] hover:underline cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Copy Link
                </button>
              </div>
            </header>

            <div className="aspect-[16/9] rounded-md overflow-hidden border border-[#DEE2E6] bg-[#F8F9FA]">
              <img
                src={article.image}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-5 text-base text-[#1F2937] leading-[1.8]">
              {(article.body || []).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {related.length > 0 && (
              <div className="pt-10 border-t border-[#EAECEF]">
                <h2 className="text-xl font-bold text-[#0B2545] mb-4">More Sample Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map((item) => (
                    <Link key={item.id} to={`/inspiration/${item.slug}`} className="rehoyah-card rehoyah-card-interactive p-4">
                      <p className="text-xs text-[#6B7280]">{item.category}</p>
                      <h3 className="mt-1 text-sm font-semibold text-[#0B2545]">{item.title}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </div>
    </PageShell>
  );
}
