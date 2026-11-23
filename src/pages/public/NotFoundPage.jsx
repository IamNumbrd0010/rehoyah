/**
 * 404 NOT FOUND PAGE
 */

import Button from '../../components/common/Button.jsx';
import PageShell from '../../components/layout/PageShell.jsx';

export default function NotFoundPage() {
  return (
    <PageShell>
      <div className="rehoyah-container py-20 text-center space-y-4 max-w-lg mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-[#B39022]">404 Error</p>
        <h1 className="text-3xl font-bold text-[#0B2545]">Page Not Found</h1>
        <p className="text-sm text-[#4B5563]">
          The page you requested does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button to="/" variant="primary" size="sm">Return Home</Button>
          <Button to="/shop" variant="secondary" size="sm">Browse Shop</Button>
        </div>
      </div>
    </PageShell>
  );
}
