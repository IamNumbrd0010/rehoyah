/**
 * PUBLIC PAGE SHELL
 * --------------------------------------------------------------------------
 * Wraps every public route with skip-to-content accessibility link, SiteHeader,
 * main content area, SiteFooter, CartDrawer, and Toast feedback.
 */

import SiteFooter from './SiteFooter.jsx';
import SiteHeader from './SiteHeader.jsx';

export default function PageShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
