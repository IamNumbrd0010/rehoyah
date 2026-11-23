/**
 * CONSULTATION BOOKING PAGE (DEMO)
 */

import { useEffect, useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import { isValidEmail, isValidPhone } from '../../utils/validation.js';

export default function BookingPage() {
  const { currentUser, showToast } = useApp();
  const [form, setForm] = useState({
    consultationType: 'Interior Design Consultation',
    preferredDate: '',
    preferredSlot: '10:00 AM – 11:00 AM',
    mode: 'On-Site Visit (Demo)',
    location: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || currentUser.fullName || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || '',
      }));
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.preferredDate) next.preferredDate = 'Select a preferred date.';
    if (!form.name.trim()) next.name = 'Full name is required.';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email.';
    if (!isValidPhone(form.phone)) next.phone = 'Enter a valid phone number.';
    if (form.mode.includes('On-Site') && !form.location.trim()) {
      next.location = 'Please provide a site address or area.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const res = await contentService.createAppointment({
      ...form,
      customerId: currentUser?.id || null,
    });
    if (res.ok) {
      setBookingResult(res.data);
      showToast('Consultation request saved locally (demo only).', 'success');
    }
  };

  return (
    <PageShell>
      <section className="bg-[#F8F9FA] border-b border-[#EAECEF] py-10">
        <div className="rehoyah-container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Book a Consultation' }]} />
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B2545]">Book a Consultation</h1>
          <p className="mt-2 text-sm text-[#4B5563] max-w-2xl">
            Request an on-site or remote finishing consultation. Live calendar availability will connect once backend scheduling is wired.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="rehoyah-container max-w-3xl">
          {bookingResult ? (
            <div className="rehoyah-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-md bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B2545]">Demo Consultation Request Recorded</h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Reference <strong className="tabular-nums text-[#0B2545]">{bookingResult.id}</strong> for{' '}
                <strong>{bookingResult.preferredDate}</strong> ({bookingResult.preferredSlot}).
              </p>
              <div className="p-3.5 rounded bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E]">
                <strong>Demo Disclaimer:</strong> This appointment request was NOT actually booked with or delivered to Rehoyah. Real scheduling and confirmations will activate once connected to a backend database.
              </div>
              <Button variant="secondary" size="sm" onClick={() => setBookingResult(null)}>
                Submit Another Demo Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rehoyah-card p-6 md:p-8 space-y-5" noValidate>
              <div className="flex items-center gap-2 text-xs text-[#4B5563] bg-[#F8F9FA] p-3 rounded border border-[#EAECEF]">
                <Calendar className="w-4 h-4 text-[#0B2545] shrink-0" />
                <span>Placeholder schedule slots — real staff calendar availability requires backend connection.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bk-type" className="rehoyah-label">Consultation Type</label>
                  <select
                    id="bk-type"
                    className="rehoyah-select"
                    value={form.consultationType}
                    onChange={(e) => setForm({ ...form, consultationType: e.target.value })}
                  >
                    <option value="Interior Design Consultation">Interior Design Consultation</option>
                    <option value="Paint & Colour Advisory">Paint &amp; Colour Advisory</option>
                    <option value="Custom Furniture Sizing">Custom Furniture Sizing</option>
                    <option value="Renovation Site Walkthrough">Renovation Site Walkthrough</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bk-mode" className="rehoyah-label">Meeting Preference</label>
                  <select
                    id="bk-mode"
                    className="rehoyah-select"
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  >
                    <option value="On-Site Visit (Demo)">On-Site Visit</option>
                    <option value="Remote Video / Phone (Demo)">Remote Video / Phone</option>
                    <option value="Showroom Meeting Placeholder">Showroom Meeting (Placeholder)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bk-date" className="rehoyah-label">Preferred Date *</label>
                  <input
                    id="bk-date"
                    type="date"
                    className="rehoyah-input"
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    aria-invalid={Boolean(errors.preferredDate)}
                  />
                  {errors.preferredDate && <p className="text-xs text-[#B91C1C] mt-1">{errors.preferredDate}</p>}
                </div>
                <div>
                  <label htmlFor="bk-slot" className="rehoyah-label">Preferred Time Slot</label>
                  <select
                    id="bk-slot"
                    className="rehoyah-select"
                    value={form.preferredSlot}
                    onChange={(e) => setForm({ ...form, preferredSlot: e.target.value })}
                  >
                    <option value="10:00 AM – 11:00 AM">10:00 AM – 11:00 AM</option>
                    <option value="11:30 AM – 12:30 PM">11:30 AM – 12:30 PM</option>
                    <option value="2:00 PM – 3:00 PM">2:00 PM – 3:00 PM</option>
                    <option value="4:00 PM – 5:00 PM">4:00 PM – 5:00 PM</option>
                  </select>
                </div>
              </div>

              {form.mode.includes('On-Site') && (
                <div>
                  <label htmlFor="bk-loc" className="rehoyah-label">Site Location *</label>
                  <input
                    id="bk-loc"
                    type="text"
                    className="rehoyah-input"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Area / street placeholder"
                    aria-invalid={Boolean(errors.location)}
                  />
                  {errors.location && <p className="text-xs text-[#B91C1C] mt-1">{errors.location}</p>}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bk-name" className="rehoyah-label">Full Name *</label>
                  <input
                    id="bk-name"
                    type="text"
                    className="rehoyah-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="text-xs text-[#B91C1C] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="bk-email" className="rehoyah-label">Email *</label>
                  <input
                    id="bk-email"
                    type="email"
                    className="rehoyah-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="text-xs text-[#B91C1C] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="bk-phone" className="rehoyah-label">Phone *</label>
                  <input
                    id="bk-phone"
                    type="tel"
                    className="rehoyah-input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <p className="text-xs text-[#B91C1C] mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="bk-notes" className="rehoyah-label">Optional Project Notes</label>
                <textarea
                  id="bk-notes"
                  rows={3}
                  className="rehoyah-textarea"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <Button type="submit" variant="primary" size="lg">
                Request Demo Consultation
              </Button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}
