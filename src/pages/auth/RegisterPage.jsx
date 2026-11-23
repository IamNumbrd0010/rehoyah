/**
 * CUSTOMER REGISTRATION PAGE (DEMO)
 * --------------------------------------------------------------------------
 * SECURITY RULE:
 * Public registration ALWAYS creates a 'customer' account. Staff and Admin
 * roles must NEVER be selectable on a public signup form.
 */

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as authService from '../../services/authService.js';
import { isValidEmail, isValidPhone, validatePassword } from '../../utils/validation.js';

export default function RegisterPage() {
  const { setCurrentUser, showToast } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    consent: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.';
    if (form.phone && !isValidPhone(form.phone)) next.phone = 'Enter a valid phone number.';
    const passErr = validatePassword(form.password);
    if (passErr) next.password = passErr;
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    if (!form.consent) next.consent = 'Please accept the privacy and terms placeholder.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const res = await authService.registerCustomer(form);
    if (!res.ok) {
      setSubmitError(res.error);
      return;
    }
    setCurrentUser(res.data);
    showToast('Demo customer account created.', 'success');
    navigate('/account');
  };

  return (
    <PageShell>
      <div className="rehoyah-container py-12 md:py-16">
        <div className="max-w-md mx-auto rehoyah-card p-6 md:p-8 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
              Customer Registration (Demo)
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0B2545]">Create Customer Account</h1>
            <p className="mt-1 text-xs text-[#4B5563]">
              Public sign-up creates a Customer account only. Staff accounts are invited internally by an Administrator.
            </p>
          </div>

          {submitError && (
            <div className="p-3 rounded bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#B91C1C]">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reg-name" className="rehoyah-label">Full Name *</label>
              <input
                id="reg-name"
                type="text"
                className="rehoyah-input"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                aria-invalid={Boolean(errors.fullName)}
              />
              {errors.fullName && <p className="text-xs text-[#B91C1C] mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="rehoyah-label">Email Address *</label>
              <input
                id="reg-email"
                type="email"
                className="rehoyah-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <p className="text-xs text-[#B91C1C] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="reg-phone" className="rehoyah-label">Phone Number (Optional)</label>
              <input
                id="reg-phone"
                type="tel"
                className="rehoyah-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && <p className="text-xs text-[#B91C1C] mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="reg-pass" className="rehoyah-label">Password *</label>
              <div className="relative">
                <input
                  id="reg-pass"
                  type={showPass ? 'text' : 'password'}
                  className="rehoyah-input pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#B91C1C] mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="reg-confirm" className="rehoyah-label">Confirm Password *</label>
              <input
                id="reg-confirm"
                type={showPass ? 'text' : 'password'}
                className="rehoyah-input"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                aria-invalid={Boolean(errors.confirmPassword)}
              />
              {errors.confirmPassword && <p className="text-xs text-[#B91C1C] mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2 text-xs text-[#4B5563] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-0.5 accent-[#0B2545]"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="underline text-[#0B2545]">Terms</Link> and{' '}
                  <Link to="/privacy" className="underline text-[#0B2545]">Privacy Policy</Link> (Placeholders).
                </span>
              </label>
              {errors.consent && <p className="text-xs text-[#B91C1C] mt-1">{errors.consent}</p>}
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Create Demo Customer Account
            </Button>
          </form>

          <p className="text-xs text-center text-[#4B5563] pt-2 border-t border-[#EAECEF]">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-[#0B2545] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
