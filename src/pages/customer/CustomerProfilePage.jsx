/**
 * CUSTOMER PROFILE & ADDRESS MANAGEMENT (/account/profile)
 */

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as authService from '../../services/authService.js';
import { CUSTOMER_NAV_ITEMS } from './customerNav.js';

export default function CustomerProfilePage() {
  const { currentUser, setCurrentUser, showToast } = useApp();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', state: '' });

  useEffect(() => {
    if (!currentUser) return;
    setFullName(currentUser.fullName || '');
    setPhone(currentUser.phone || '');
    setAddresses(currentUser.addresses || []);
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await authService.updateCustomerProfile(currentUser.id, { fullName, phone, addresses });
    if (res.ok) {
      setCurrentUser(res.data);
      showToast('Demo profile updated locally.', 'success');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.label.trim() || !newAddress.street.trim()) return;
    const next = [...addresses, { id: `addr-${Date.now()}`, ...newAddress }];
    setAddresses(next);
    setNewAddress({ label: '', street: '', city: '', state: '' });
    const res = await authService.updateCustomerProfile(currentUser.id, { addresses: next });
    if (res.ok) {
      setCurrentUser(res.data);
      showToast('Demo delivery address added.', 'success');
    }
  };

  const handleRemoveAddress = async (addrId) => {
    const next = addresses.filter((a) => a.id !== addrId);
    setAddresses(next);
    const res = await authService.updateCustomerProfile(currentUser.id, { addresses: next });
    if (res.ok) {
      setCurrentUser(res.data);
      showToast('Address removed from demo profile.', 'info');
    }
  };

  return (
    <DashboardShell
      portal="customer"
      portalTitle="Customer Portal"
      pageTitle="Profile & Saved Addresses"
      navItems={CUSTOMER_NAV_ITEMS}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleSaveProfile} className="lg:col-span-6 rehoyah-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#0B2545]">Personal Details (Demo)</h2>
          <div>
            <label htmlFor="prof-name" className="rehoyah-label">Full Name</label>
            <input
              id="prof-name"
              type="text"
              className="rehoyah-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="prof-email" className="rehoyah-label">Email</label>
            <input
              id="prof-email"
              type="email"
              className="rehoyah-input bg-[#F8F9FA]"
              value={currentUser?.email || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor="prof-phone" className="rehoyah-label">Phone</label>
            <input
              id="prof-phone"
              type="tel"
              className="rehoyah-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Save Demo Profile
          </Button>
        </form>

        <div className="lg:col-span-6 rehoyah-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#0B2545]">Delivery Addresses (Demo)</h2>
          {addresses.length === 0 ? (
            <p className="text-xs text-[#6B7280]">No saved addresses yet.</p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-3 rounded border border-[#EAECEF] flex items-start justify-between gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-[#0B2545]">{addr.label}</p>
                    <p className="text-xs text-[#4B5563]">
                      {addr.street} {addr.city && `· ${addr.city}`} {addr.state && `· ${addr.state}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(addr.id)}
                    aria-label={`Delete ${addr.label}`}
                    className="p-1 text-[#6B7280] hover:text-[#B91C1C] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddAddress} className="pt-4 border-t border-[#EAECEF] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Add Address Placeholder
            </h3>
            <input
              type="text"
              placeholder="Label (e.g. Home, Office)"
              className="rehoyah-input"
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
            />
            <input
              type="text"
              placeholder="Street / Estate"
              className="rehoyah-input"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                className="rehoyah-input"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="State"
                className="rehoyah-input"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              Add Demo Address
            </Button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
