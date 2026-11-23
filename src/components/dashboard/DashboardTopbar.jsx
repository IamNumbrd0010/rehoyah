/**
 * DASHBOARD TOPBAR
 * --------------------------------------------------------------------------
 * Displays mobile menu toggle, page title, notifications popover,
 * Demo Role Switcher, and Sign Out / Login control.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu } from 'lucide-react';
import appConfig from '../../config/appConfig.js';
import { useApp } from '../../context/AppContext.jsx';
import * as notificationService from '../../services/notificationService.js';

export default function DashboardTopbar({ title, onOpenMobile }) {
  const { currentUser, switchRole, logout } = useApp();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    notificationService.getNotifications(currentUser.role).then(setNotifications);
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    await notificationService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleQuickRole = async (roleKey) => {
    const user = await switchRole(roleKey);
    if (!user) navigate('/');
    else if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'staff') navigate('/staff');
    else navigate('/account');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#EAECEF] px-4 md:px-6 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open workspace navigation"
          className="lg:hidden p-2 rounded text-[#0B2545] hover:bg-[#F1F3F5] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-[#0B2545] truncate">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {appConfig.DEMO_MODE && (
          <div className="hidden md:flex items-center gap-1.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded px-2.5 py-1 text-xs">
            <span className="text-[#6B7280] font-medium">Demo Switcher:</span>
            {['customer', 'staff', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleQuickRole(r)}
                className={`px-2 py-0.5 rounded capitalize cursor-pointer ${
                  currentUser?.role === r
                    ? 'bg-[#0B2545] text-white font-semibold'
                    : 'text-[#4B5563] hover:text-[#0B2545]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            aria-label={`Notifications (${unreadCount} unread)`}
            className="relative p-2 rounded text-[#4B5563] hover:text-[#0B2545] hover:bg-[#F1F3F5] cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F57C00]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#DEE2E6] rounded-md shadow-xl p-3 z-40">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EAECEF]">
                <span className="text-xs font-semibold text-[#0B2545]">Notifications (Demo)</span>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-[#6B7280] hover:text-[#0B2545] cursor-pointer"
                >
                  Close
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs text-[#6B7280] py-3 text-center">No demo notifications.</p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`p-2 rounded border text-xs ${
                        n.read ? 'bg-white border-[#EAECEF]' : 'bg-[#F8F9FA] border-[#D4AF37]/50'
                      }`}
                    >
                      <p className="font-semibold text-[#0B2545]">{n.title}</p>
                      <p className="text-[#4B5563] mt-0.5">{n.message}</p>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(n.id)}
                          className="mt-1 text-[11px] font-semibold text-[#0B2545] underline cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-[#EAECEF]">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-[#0B2545] max-w-[140px] truncate">
                {currentUser.fullName}
              </p>
              <p className="text-[11px] text-[#6B7280] capitalize">
                {currentUser.staffRoleTitle || currentUser.role} (Demo)
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              aria-label="Sign out of demo session"
              className="p-2 rounded text-[#4B5563] hover:text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-xs font-semibold text-[#0B2545] hover:underline">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
