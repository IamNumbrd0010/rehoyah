/**
 * SITE HEADER COMPONENT
 * --------------------------------------------------------------------------
 * Primary public navigation bar featuring:
 * - Rehoyah typographic wordmark (replaceable once logo file is supplied)
 * - Public page links (Home, About, Services, Shop, Projects, Inspiration, Contact)
 * - Cross-site Search modal trigger, Customer Account link, Cart Drawer button
 * - Prominent "Get a Quote" CTA
 * - Responsive mobile drawer trigger
 *
 * Also renders a slim, non-sticky Demo Role Switcher strip at the very top
 * ONLY when appConfig.DEMO_MODE === true, so evaluators can preview Customer,
 * Staff, and Admin views. Remove that strip once real authentication is wired.
 */

import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import appConfig from '../../config/appConfig.js';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import * as productService from '../../services/productService.js';
import * as projectService from '../../services/projectService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import SearchInput from '../common/SearchInput.jsx';
import MobileNavigation from './MobileNavigation.jsx';

const PUBLIC_NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Shop', to: '/shop' },
  { label: 'Projects', to: '/projects' },
  { label: 'Inspiration', to: '/inspiration' },
  { label: 'Contact', to: '/contact' },
];

export default function SiteHeader() {
  const { currentUser, switchRole, cartCount, setIsCartOpen } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], services: [], projects: [], articles: [] });

  useEffect(() => {
    if (!searchOpen) return;
    let active = true;
    const runSearch = async () => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) {
        setSearchResults({ products: [], services: [], projects: [], articles: [] });
        return;
      }
      const [products, services, projects, articles] = await Promise.all([
        productService.getProducts({ publishedOnly: true, search: q }),
        contentService.getServices({ activeOnly: true }),
        projectService.getProjects({ publishedOnly: true, search: q }),
        contentService.getArticles({ publishedOnly: true, search: q }),
      ]);
      if (!active) return;
      setSearchResults({
        products: products.slice(0, 4),
        services: services.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 4),
        projects: projects.slice(0, 3),
        articles: articles.slice(0, 3),
      });
    };
    runSearch();
    return () => {
      active = false;
    };
  }, [searchOpen, searchQuery]);

  const accountDestination = currentUser
    ? currentUser.role === 'admin'
      ? '/admin'
      : currentUser.role === 'staff'
      ? '/staff'
      : '/account'
    : '/login';

  const handleDemoSwitch = async (roleKey) => {
    const user = await switchRole(roleKey);
    if (user?.role === 'admin') navigate('/admin');
    else if (user?.role === 'staff') navigate('/staff');
    else if (user?.role === 'customer') navigate('/account');
  };

  return (
    <>
      {/* DEMO ONLY: Non-sticky role preview bar. Remove before production launch. */}
      {appConfig.DEMO_MODE && (
        <div className="bg-[#071A33] text-white text-xs border-b border-white/10">
          <div className="rehoyah-container-wide py-1.5 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[#E5E7EB]">
              <strong className="text-[#D4AF37]">DEMO MODE:</strong> Sample data only — not connected to live database or payments.
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#9CA3AF] mr-1">DEMO ROLE SWITCHER:</span>
              {[
                { key: 'visitor', label: 'Visitor' },
                { key: 'customer', label: 'Customer' },
                { key: 'staff', label: 'Staff' },
                { key: 'admin', label: 'Admin' },
              ].map((opt) => {
                const isActive =
                  (opt.key === 'visitor' && !currentUser) ||
                  (currentUser && currentUser.role === opt.key);
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleDemoSwitch(opt.key)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#0B2545] font-semibold'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#0B2545] text-white border-b border-white/10">
        <div className="rehoyah-container-wide h-16 md:h-[72px] flex items-center justify-between gap-6">
          {/* Typographic Brand Wordmark Placeholder */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold tracking-wider text-white whitespace-nowrap shrink-0"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            REHOYAH
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {PUBLIC_NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    isActive
                      ? 'text-[#D4AF37] border-[#D4AF37]'
                      : 'text-white/90 border-transparent hover:text-white hover:border-white/40'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search site"
              className="p-2 rounded text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to={accountDestination}
              aria-label={currentUser ? `Account (${currentUser.role})` : 'Sign in to account'}
              className="p-2 rounded text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping cart with ${cartCount} items`}
              className="relative p-2 rounded text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F57C00] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="hidden sm:block ml-1">
              <Button to="/request-quote" variant="gold" size="sm">
                Get a Quote
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
              className="lg:hidden p-2 rounded text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={PUBLIC_NAV_LINKS}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
      />

      {/* Global Search Modal */}
      <Modal isOpen={searchOpen} onClose={() => setSearchOpen(false)} title="Search Rehoyah (Demo)" maxWidth="max-w-2xl">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search paints, furniture, services, projects, or articles..."
          label="Search across Rehoyah"
        />

        {!searchQuery.trim() ? (
          <div className="mt-5 text-sm text-[#4B5563]">
            <p className="font-medium text-[#0B2545] mb-2">Popular pages</p>
            <div className="flex flex-wrap gap-2">
              {['/shop', '/services', '/projects', '/request-quote', '/book-consultation'].map((path) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium bg-[#F8F9FA] border border-[#DEE2E6] rounded hover:border-[#0B2545] text-[#0B2545]"
                >
                  {path.replace('/', '').replace('-', ' ')}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-5 max-h-[55vh] overflow-y-auto">
            {searchResults.products.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Products (Demo)</h4>
                <div className="divide-y divide-[#EAECEF] border border-[#EAECEF] rounded">
                  {searchResults.products.map((p) => (
                    <Link
                      key={p.id}
                      to={`/shop/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 hover:bg-[#F8F9FA]"
                    >
                      <span className="text-sm font-medium text-[#0B2545]">{p.name}</span>
                      <span className="text-xs font-semibold text-[#4B5563] tabular-nums">
                        {formatCurrency(p.salePrice || p.price)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchResults.services.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Services</h4>
                <div className="divide-y divide-[#EAECEF] border border-[#EAECEF] rounded">
                  {searchResults.services.map((s) => (
                    <Link
                      key={s.id}
                      to={`/services/${s.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="block px-3 py-2.5 hover:bg-[#F8F9FA]"
                    >
                      <span className="text-sm font-medium text-[#0B2545]">{s.name}</span>
                      <span className="block text-xs text-[#6B7280]">{s.category}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchResults.projects.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Projects (Demo)</h4>
                <div className="divide-y divide-[#EAECEF] border border-[#EAECEF] rounded">
                  {searchResults.projects.map((proj) => (
                    <Link
                      key={proj.id}
                      to={`/projects/${proj.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="block px-3 py-2.5 hover:bg-[#F8F9FA]"
                    >
                      <span className="text-sm font-medium text-[#0B2545]">{proj.title}</span>
                      <span className="block text-xs text-[#6B7280]">{proj.category}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchResults.articles.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Inspiration (Demo)</h4>
                <div className="divide-y divide-[#EAECEF] border border-[#EAECEF] rounded">
                  {searchResults.articles.map((art) => (
                    <Link
                      key={art.id}
                      to={`/inspiration/${art.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="block px-3 py-2.5 hover:bg-[#F8F9FA]"
                    >
                      <span className="text-sm font-medium text-[#0B2545]">{art.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchResults.products.length === 0 &&
              searchResults.services.length === 0 &&
              searchResults.projects.length === 0 &&
              searchResults.articles.length === 0 && (
                <p className="text-sm text-[#6B7280] py-4 text-center">
                  No demo results matched "{searchQuery}".
                </p>
              )}
          </div>
        )}
      </Modal>
    </>
  );
}
