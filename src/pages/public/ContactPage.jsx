/**
 * CONTACT PAGE (PLACEHOLDER CONTACT DETAILS + VALIDATED DEMO FORM)
 */

import { useState } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import { isValidEmail, isValidPhone } from '../../utils/validation.js';

export default function ContactPage() {
  const { settings, showToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: 'General Enquiry', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const contact = settings?.contact || {
    phone: '+234 (0) 800 000 0000 [Placeholder]',
    whatsapp: '+234 (0) 800 000 0000 [Placeholder]',
    email: 'hello@rehoyah-example.ng [Placeholder]',
    address: 'Showroom & Studio Address Placeholder, Nigeria',
    workingHours: 'Monday – Saturday, Hours Placeholder',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!isValidEmail(form.email)) next.email = 'Valid email is required.';
    if (!isValidPhone(form.phone)) next.phone = 'Valid phone number is required.';
    if (!form.message.trim()) next.message = 'Please enter your message.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    await contentService.submitContactMessage(form);
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', topic: 'General Enquiry', message: '' });
    showToast('Contact message saved in local demo storage only.', 'success');
  };

  return (
    <PageShell>
      <section className="bg-[#F8F9FA] border-b border-[#EAECEF] py-10">
        <div className="rehoyah-container-wide">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B2545]">Contact Rehoyah</h1>
          <p className="mt-2 text-sm md:text-base text-[#4B5563] max-w-2xl">
            Replace the contact placeholders below via Admin &gt; Settings once verified business phone, WhatsApp, and showroom address details are ready.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="rehoyah-container-wide grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-5">
            <div className="rehoyah-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-[#0B2545]">Contact Details (Placeholders)</h2>
              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#0B2545] mt-1 shrink-0" />
                  <span><strong>Phone:</strong> {contact.phone}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-[#0B2545] mt-1 shrink-0" />
                  <span><strong>WhatsApp:</strong> {contact.whatsapp}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#0B2545] mt-1 shrink-0" />
                  <span><strong>Email:</strong> {contact.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#0B2545] mt-1 shrink-0" />
                  <span><strong>Location:</strong> {contact.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#0B2545] mt-1 shrink-0" />
                  <span><strong>Working Hours:</strong> {contact.workingHours}</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-[#EAECEF] flex flex-wrap gap-2">
                <Button to="/request-quote" variant="primary" size="sm">Request a Quote</Button>
                <Button to="/book-consultation" variant="secondary" size="sm">Book Consultation</Button>
              </div>
            </div>

            {/* Map Location Placeholder (No invented address or wrong embed) */}
            <div className="rehoyah-card p-6 bg-[#F8F9FA] text-center space-y-2">
              <MapPin className="w-6 h-6 text-[#0B2545] mx-auto" />
              <p className="text-sm font-semibold text-[#0B2545]">Map Location Slot (Placeholder)</p>
              <p className="text-xs text-[#6B7280]">
                Insert verified Google Maps embed or coordinates here once the confirmed showroom address is finalized.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rehoyah-card p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#0B2545] mb-2">Send a Message</h2>
              <p className="text-xs text-[#6B7280] mb-6">
                Demo Notice: Submitting this form validates inputs and stores a demo record locally. It does NOT send email to Rehoyah until a backend mail/API handler is connected.
              </p>

              {submitted ? (
                <div className="p-6 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] space-y-3">
                  <div className="flex items-center gap-2 text-[#15803D] font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Message Saved in Demo Mode</span>
                  </div>
                  <p className="text-sm text-[#166534]">
                    Your enquiry has been recorded in browser demo storage only and has not been delivered to Rehoyah yet.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Demo Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cnt-name" className="rehoyah-label">Full Name *</label>
                      <input
                        id="cnt-name"
                        type="text"
                        className="rehoyah-input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        aria-invalid={Boolean(errors.name)}
                      />
                      {errors.name && <p className="text-xs text-[#B91C1C] mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="cnt-email" className="rehoyah-label">Email *</label>
                      <input
                        id="cnt-email"
                        type="email"
                        className="rehoyah-input"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        aria-invalid={Boolean(errors.email)}
                      />
                      {errors.email && <p className="text-xs text-[#B91C1C] mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cnt-phone" className="rehoyah-label">Phone *</label>
                      <input
                        id="cnt-phone"
                        type="tel"
                        className="rehoyah-input"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        aria-invalid={Boolean(errors.phone)}
                      />
                      {errors.phone && <p className="text-xs text-[#B91C1C] mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="cnt-topic" className="rehoyah-label">Topic</label>
                      <select
                        id="cnt-topic"
                        className="rehoyah-select"
                        value={form.topic}
                        onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Materials & Paint Supply">Materials &amp; Paint Supply</option>
                        <option value="Custom Furniture">Custom Furniture</option>
                        <option value="Site Inspection & Renovation">Site Inspection &amp; Renovation</option>
                        <option value="Franchise / Dealer / Contractor (Future)">Franchise / Dealer / Contractor (Future)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cnt-msg" className="rehoyah-label">Message *</label>
                    <textarea
                      id="cnt-msg"
                      rows={4}
                      className="rehoyah-textarea"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      aria-invalid={Boolean(errors.message)}
                    />
                    {errors.message && <p className="text-xs text-[#B91C1C] mt-1">{errors.message}</p>}
                  </div>

                  <Button type="submit" variant="primary">
                    Submit Demo Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
