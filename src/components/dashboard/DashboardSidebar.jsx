/**
 * DASHBOARD SIDEBAR (DESKTOP + ACCESSIBLE MOBILE DRAWER)
 */

import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ExternalLink, X } from 'lucide-react';

export default function DashboardSidebar({
  portalTitle,
  portalSubtitle,
  navItems = [],
  mobileOpen,
  onCloseMobile,
}) {
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCloseMobile();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileOpen, onCloseMobile]);

  const navContent = (
    <div className="flex flex-col h-full bg-[#0B2545] text-white w-64">
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="text-lg font-bold tracking-wider text-white block"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            REHOYAH
          </Link>
          <p className="text-[11px] text-[#D4AF37] font-semibold mt-0.5">{portalTitle}</p>
          {portalSubtitle && <p className="text-[11px] text-[#9CA3AF]">{portalSubtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
          className="lg:hidden p-1.5 rounded text-white/80 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label={`${portalTitle} navigation`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={Boolean(item.end)}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#0B2545] font-semibold'
                    : 'text-[#E5E7EB] hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded text-xs font-medium bg-white/10 text-white hover:bg-white/15 transition-colors"
        >
          <span>Public Website</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block shrink-0 border-r border-[#071A33]">{navContent}</aside>

      {/* Mobile slide-over sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true" aria-label="Workspace menu">
          <div className="fixed inset-0 bg-[#0B2545]/50" onClick={onCloseMobile} />
          <div className="relative z-10 h-full shadow-2xl">{navContent}</div>
        </div>
      )}
    </>
  );
}
