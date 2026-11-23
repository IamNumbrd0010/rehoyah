/**
 * FORGOT PASSWORD PAGE (DEMO PLACEHOLDER)
 */

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import * as authService from '../../services/authService.js';
import { isValidEmail } from '../../utils/validation.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    const res = await authService.requestPasswordReset(email);
    if (res.ok) setResultMessage(res.message);
  };

  return (
    <PageShell>
      <div className="rehoyah-container py-12 md:py-16">
        <div className="max-w-md mx-auto rehoyah-card p-6 md:p-8 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
              Password Recovery (Demo)
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0B2545]">Reset Password</h1>
            <p className="mt-1 text-xs text-[#4B5563]">
              Enter your email address. Real password reset emails require backend auth integration.
            </p>
          </div>

          {resultMessage ? (
            <div className="p-4 rounded bg-[#F0FDF4] border border-[#BBF7D0] space-y-2 text-xs text-[#166534]">
              <div className="flex items-center gap-2 font-semibold text-[#15803D]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demo Request Handled</span>
              </div>
              <p>{resultMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="fp-email" className="rehoyah-label">Email Address</label>
                <input
                  id="fp-email"
                  type="email"
                  className="rehoyah-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(error)}
                />
                {error && <p className="text-xs text-[#B91C1C] mt-1">{error}</p>}
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Request Reset Link (Demo)
              </Button>
            </form>
          )}

          <p className="text-xs text-center text-[#4B5563]">
            <Link to="/login" className="font-semibold text-[#0B2545] hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
