/**
 * SITE FOOTER COMPONENT
 * --------------------------------------------------------------------------
 * Displays brand wordmark/tagline, navigation links, shop categories,
 * service links, placeholder contact details, newsletter demo form,
 * legal placeholder links, and quick demo portal shortcuts.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import { isValidEmail } from '../../utils/validation.js';
import Button from '../common/Button.jsx';

export default function SiteFooter() {
  const { settings, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const contact = settings?.contact || {
    phone: '+234 (0) 800 000 0000 [Placeholder]',
    email: 'hello@rehoyah-example.ng [Placeholder]',
    address: 'Showroom Address Placeholder, Nigeria',
    workingHours: 'Mon – Sat, Hours Placeholder',
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterError('');
    if (!isValidEmail(email)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    await contentService.subscribeNewsletter(email.trim());
    setSubscribed(true);
    setEmail('');
    showToast('Newsletter email saved in local demo storage only.', 'success');
  };

  return (
    <footer className="bg-[#0B2545] text-[#E5E7EB] border-t border-white/10">
      <div className="rehoyah-container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to="/"
              className="inline-block text-2xl font-bold tracking-wider text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              REHOYAH
            </Link>
            <p className="text-sm text-[#D1D5DB] leading-relaxed max-w-sm">
              Transforming Spaces, Creating Lasting Impressions. Complete interior &amp; exterior finishing materials, custom furniture, and renovation solutions.
            </p>

            <form onSubmit={handleNewsletter} className="pt-2 space-y-2 max-w-sm" noValidate>
              <label htmlFor="footer-newsletter" className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                Newsletter (Demo Only)
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-3 py-2 text-sm rounded bg-white text-[#111827] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <Button type="submit" variant="gold" size="sm">
                  Join
                </Button>
              </div>
              {newsletterError && <p className="text-xs text-[#FCA5A5]">{newsletterError}</p>}
              {subscribed && (
                <p className="text-xs text-[#BBF7D0]">
                  Saved locally for demo preview — not yet connected to a mailing list service.
                </p>
              )}
            </form>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About Rehoyah</Link></li>
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/projects" className="hover:text-white">Projects</Link></li>
              <li><Link to="/inspiration" className="hover:text-white">Inspiration</Link></li>
              <li><Link to="/request-quote" className="hover:text-white">Request a Quote</Link></li>
              <li><Link to="/book-consultation" className="hover:text-white">Book Consultation</Link></li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Shop Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?category=cat-paints" className="hover:text-white">Paints &amp; Finishes</Link></li>
              <li><Link to="/shop?category=cat-decor" className="hover:text-white">Decoration Materials</Link></li>
              <li><Link to="/shop?category=cat-furniture" className="hover:text-white">Furniture</Link></li>
              <li><Link to="/shop?category=cat-lighting" className="hover:text-white">Lighting</Link></li>
              <li><Link to="/shop?category=cat-tools" className="hover:text-white">Tools &amp; Accessories</Link></li>
            </ul>
          </div>

          {/* Contact Placeholders & Portals */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Contact (Placeholders)
            </h3>
            <div className="space-y-1.5 text-sm text-[#D1D5DB]">
              <p>{contact.address}</p>
              <p>{contact.phone}</p>
              <p>{contact.email}</p>
              <p>{contact.workingHours}</p>
            </div>
            <div className="pt-2 flex flex-wrap gap-3 text-xs text-[#9CA3AF]">
              <Link to="/contact" className="hover:text-white underline">Contact Page</Link>
              <Link to="/login" className="hover:text-white underline">Portal Login</Link>
              <Link to="/account" className="hover:text-white underline">Customer</Link>
              <Link to="/staff" className="hover:text-white underline">Staff</Link>
              <Link to="/admin" className="hover:text-white underline">Admin</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <p>&copy; {new Date().getFullYear()} REHOYAH. Frontend Blueprint — Demo Content Active.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-white">Privacy Policy (Placeholder)</Link>
            <Link to="/terms" className="hover:text-white">Terms of Use (Placeholder)</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
