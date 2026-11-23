/**
 * LOGIN PAGE (DEMO AUTHENTICATION)
 * --------------------------------------------------------------------------
 * Clearly states that authentication is simulated for frontend previewing.
 * Includes a visibly labeled DEMO ROLE SWITCHER for previewing Customer,
 * Staff, and Admin dashboards. Remove the switcher and wire real backend
 * auth in `src/services/authService.js` before production.
 */

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as authService from '../../services/authService.js';
import { isValidEmail } from '../../utils/validation.js';

export default function LoginPage() {
  const { setCurrentUser, switchRole, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setSubmitting(true);
    const res = await authService.login(email, password);
    setSubmitting(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setCurrentUser(res.data);
    showToast(`Signed into demo ${res.data.role} account.`, 'success');
    if (res.data.role === 'admin') navigate('/admin');
    else if (res.data.role === 'staff') navigate('/staff');
    else navigate('/account');
  };

  const handleDemoSwitch = async (roleKey, path) => {
    await switchRole(roleKey);
    navigate(path);
  };

  return (
    <PageShell>
      <div className="rehoyah-container py-12 md:py-16">
        <div className="max-w-md mx-auto space-y-6">
          <div className="rehoyah-card p-6 md:p-8 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
                Simulated Demo Login
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#0B2545]">Sign In to Your Account</h1>
              <p className="mt-1.5 text-xs text-[#4B5563]">
                Authentication is simulated for frontend preview. Connect real password verification in <code>authService.js</code> before launch.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#B91C1C]" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className="rehoyah-label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  className="rehoyah-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer.demo@example.com"
                />
              </div>

              <div>
                <label htmlFor="login-pass" className="rehoyah-label">Password</label>
                <div className="relative">
                  <input
                    id="login-pass"
                    type={showPassword ? 'text' : 'password'}
                    className="rehoyah-input pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter any password in demo mode"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0B2545] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-[#4B5563] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#0B2545]"
                  />
                  <span>Remember me (Placeholder)</span>
                </label>
                <Link to="/forgot-password" className="font-semibold text-[#0B2545] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In (Demo)'}
              </Button>
            </form>

            <p className="text-xs text-center text-[#4B5563] pt-2 border-t border-[#EAECEF]">
              New customer?{' '}
              <Link to="/register" className="font-semibold text-[#0B2545] hover:underline">
                Create a customer account
              </Link>
            </p>
          </div>

          {/* DEMO ROLE SWITCHER — Development / Preview Tool Only */}
          <div className="rehoyah-card p-5 bg-[#F8F9FA] space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B2545]">
              DEMO ROLE SWITCHER (Preview Only)
            </p>
            <p className="text-xs text-[#4B5563]">
              Quickly preview role-specific dashboards. Remove this block once real authentication is connected.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleDemoSwitch('customer', '/account')}>
                Customer
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleDemoSwitch('staff', '/staff')}>
                Staff
              </Button>
              <Button variant="gold" size="sm" onClick={() => handleDemoSwitch('admin', '/admin')}>
                Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
