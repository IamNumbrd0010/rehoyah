/**
 * PERMISSION NOTICE & ACCESS RESTRICTED SCREEN
 * --------------------------------------------------------------------------
 * Displayed whenever a visitor or demo user lacks access to a portal or
 * permission-gated module.
 *
 * SECURITY REMINDER:
 * Real backend APIs and database rules must enforce these exact checks.
 */

import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import Button from '../common/Button.jsx';

export default function PermissionNotice({
  title = 'Access Restricted (Frontend Preview)',
  message = 'Your current demo role does not have permission to view this page.',
  requiredRole,
}) {
  const { switchRole } = useApp();
  const navigate = useNavigate();

  const handleSwitch = async (roleKey, targetPath) => {
    await switchRole(roleKey);
    navigate(targetPath);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="rehoyah-card max-w-lg w-full p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-md bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-[#0B2545]">{title}</h2>
        <p className="text-sm text-[#4B5563] leading-relaxed">{message}</p>
        <p className="text-xs text-[#6B7280] bg-[#F8F9FA] p-3 rounded border border-[#EAECEF]">
          Note: Frontend role &amp; permission checks are UI previews only. When connecting your backend database, enforce identical rules on every API endpoint and database query.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button to="/" variant="secondary" size="sm">
            Return Home
          </Button>
          <Button to="/login" variant="primary" size="sm">
            Go to Demo Login
          </Button>
          {requiredRole === 'customer' && (
            <Button variant="gold" size="sm" onClick={() => handleSwitch('customer', '/account')}>
              Preview Customer
            </Button>
          )}
          {requiredRole === 'staff' && (
            <Button variant="gold" size="sm" onClick={() => handleSwitch('staff', '/staff')}>
              Preview Staff
            </Button>
          )}
          {requiredRole === 'admin' && (
            <Button variant="gold" size="sm" onClick={() => handleSwitch('admin', '/admin')}>
              Preview Admin
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
