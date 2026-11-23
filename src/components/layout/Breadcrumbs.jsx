/**
 * BREADCRUMBS NAVIGATION COMPONENT
 */

import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B7280]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" aria-hidden="true" />}
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-[#0B2545] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-semibold text-[#0B2545]' : ''}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
