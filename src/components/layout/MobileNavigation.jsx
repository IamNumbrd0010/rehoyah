/**
 * MOBILE NAVIGATION DRAWER
 * --------------------------------------------------------------------------
 * Accessible slide-out menu for small screens and tablets.
 */

import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, User, X } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function MobileNavigation({
  isOpen,
  onClose,
  navLinks,
  cartCount,
  onOpenCart,
  currentUser,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const accountTarget = currentUser
    ? currentUser.role === 'admin'
      ? '/admin'
      : currentUser.role === 'staff'
      ? '/staff'
      : '/account'
    : '/login';

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
      <div className="fixed inset-0 bg-[#0B2545]/50" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAECEF]">
          <span className="font-bold text-lg tracking-wide text-[#0B2545]" style={{ fontFamily: 'var(--font-heading)' }}>
            REHOYAH
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-2 rounded text-[#4B5563] hover:text-[#0B2545] hover:bg-[#F1F3F5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0B2545] text-white'
                    : 'text-[#111827] hover:bg-[#F8F9FA] hover:text-[#0B2545]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#EAECEF] space-y-3 bg-[#F8F9FA]">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={accountTarget}
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded border border-[#DEE2E6] bg-white text-[#0B2545]"
            >
              <User className="w-4 h-4" />
              {currentUser ? 'Dashboard' : 'Account'}
            </Link>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded border border-[#DEE2E6] bg-white text-[#0B2545]"
            >
              <ShoppingBag className="w-4 h-4" />
              Cart ({cartCount})
            </button>
          </div>
          <Button to="/request-quote" variant="gold" className="w-full" onClick={onClose}>
            Get a Quote
          </Button>
        </div>
      </div>
    </div>
  );
}
