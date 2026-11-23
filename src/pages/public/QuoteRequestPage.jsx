/**
 * REQUEST A QUOTE PAGE
 * --------------------------------------------------------------------------
 * Collects project scope, property type, service, optional budget & timeline,
 * local photo preview, site inspection preference, and consent.
 * Includes a Review step before recording the request in demo storage.
 */

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import ImageUploadPlaceholder from '../../components/common/ImageUploadPlaceholder.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import * as quoteService from '../../services/quoteService.js';
import { isValidEmail, isValidPhone } from '../../utils/validation.js';

export default function QuoteRequestPage() {
  const [searchParams] = useSearchParams();
  const { currentUser, showToast } = useApp();

  const [services, setServices] = useState([]);
  const [step, setStep] = useState('form'); // 'form' | 'review' | 'success'
  const [createdQuote, setCreatedQuote] = useState(null);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    service: searchParams.get('service') || 'Interior Painting',
    propertyType: 'Home',
    description: '',
    budgetRange: '',
    timeline: 'Within 1 month',
    siteInspectionRequested: true,
    consent: false,
  });

  useEffect(() => {
    contentService.getServices({ activeOnly: true }).then(setServices);
  }, []);

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

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required.';
    if (!isValidPhone(form.phone)) next.phone = 'Enter a valid phone number.';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.';
    if (!form.location.trim()) next.location = 'Project city/location is required.';
    if (!form.description.trim()) next.description = 'Please describe the work needed.';
    if (!form.consent) next.consent = 'Please confirm consent to be contacted regarding this quote.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('review');
  };

  const handleConfirmSubmit = async () => {
    const res = await quoteService.createQuoteRequest({
      ...form,
      customerId: currentUser?.id || null,
      uploadedFileNames: files.map((f) => f.name),
    });
    if (res.ok) {
      setCreatedQuote(res.data);
      setStep('success');
      showToast('Quote request saved in local demo storage.', 'success');
    }
  };

  return (
    <PageShell>
      <section className="bg-[#F8F9FA] border-b border-[#EAECEF] py-10">
        <div className="rehoyah-container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Request a Quote' }]} />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
            Project Quotation · Demo Flow
          </p>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold text-[#0B2545]">
            Request a Project Quote
          </h1>
          <p className="mt-2 text-sm text-[#4B5563] max-w-2xl">
            Share your space requirements and preferred services. Requests created here are stored in browser demo storage so you can inspect them in Customer, Staff, and Admin dashboards.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="rehoyah-container max-w-3xl">
          {step === 'form' && (
            <form onSubmit={handleReview} className="rehoyah-card p-6 md:p-8 space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="qt-name" className="rehoyah-label">Full Name *</label>
                  <input
                    id="qt-name"
                    type="text"
                    className="rehoyah-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="text-xs text-[#B91C1C] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="qt-phone" className="rehoyah-label">Phone Number *</label>
                  <input
                    id="qt-phone"
                    type="tel"
                    className="rehoyah-input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <p className="text-xs text-[#B91C1C] mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="qt-email" className="rehoyah-label">Email Address *</label>
                  <input
                    id="qt-email"
                    type="email"
                    className="rehoyah-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="text-xs text-[#B91C1C] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="qt-location" className="rehoyah-label">Project Location (Area / City) *</label>
                  <input
                    id="qt-location"
                    type="text"
                    className="rehoyah-input"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Lekki, Lagos"
                    aria-invalid={Boolean(errors.location)}
                  />
                  {errors.location && <p className="text-xs text-[#B91C1C] mt-1">{errors.location}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="qt-service" className="rehoyah-label">Primary Service *</label>
                  <select
                    id="qt-service"
                    className="rehoyah-select"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="qt-prop" className="rehoyah-label">Property Type *</label>
                  <select
                    id="qt-prop"
                    className="rehoyah-select"
                    value={form.propertyType}
                    onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                  >
                    {['Home', 'Office', 'School', 'Hotel', 'Commercial', 'Other'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="qt-budget" className="rehoyah-label">Estimated Budget Range (Optional)</label>
                  <input
                    id="qt-budget"
                    type="text"
                    className="rehoyah-input"
                    value={form.budgetRange}
                    onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                    placeholder="e.g. ₦500,000 – ₦1,500,000"
                  />
                </div>
                <div>
                  <label htmlFor="qt-timeline" className="rehoyah-label">Desired Timeline</label>
                  <select
                    id="qt-timeline"
                    className="rehoyah-select"
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  >
                    <option value="Urgent (1–2 weeks)">Urgent (1–2 weeks)</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="1–3 months">1–3 months</option>
                    <option value="Planning / Flexible">Planning / Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="qt-desc" className="rehoyah-label">Scope &amp; Space Description *</label>
                <textarea
                  id="qt-desc"
                  rows={4}
                  className="rehoyah-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Room count, current wall/ceiling state, preferred finishes or furniture dimensions..."
                  aria-invalid={Boolean(errors.description)}
                />
                {errors.description && <p className="text-xs text-[#B91C1C] mt-1">{errors.description}</p>}
              </div>

              <ImageUploadPlaceholder
                label="Upload Space Photos (Local Browser Preview Only)"
                files={files}
                onChange={setFiles}
              />

              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2.5 text-sm text-[#111827] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.siteInspectionRequested}
                    onChange={(e) => setForm({ ...form, siteInspectionRequested: e.target.checked })}
                    className="mt-1 accent-[#0B2545]"
                  />
                  <span>Request an on-site measurement &amp; inspection</span>
                </label>

                <label className="flex items-start gap-2.5 text-sm text-[#111827] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    className="mt-1 accent-[#0B2545]"
                  />
                  <span>I consent to be contacted regarding this quotation request *</span>
                </label>
                {errors.consent && <p className="text-xs text-[#B91C1C]">{errors.consent}</p>}
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg">
                  Review Quote Request
                </Button>
              </div>
            </form>
          )}

          {step === 'review' && (
            <div className="rehoyah-card p-6 md:p-8 space-y-5">
              <h2 className="text-xl font-bold text-[#0B2545]">Review Your Quote Request</h2>
              <dl className="divide-y divide-[#EAECEF] border border-[#EAECEF] rounded text-sm">
                <div className="px-4 py-3 flex justify-between gap-4"><dt className="text-[#6B7280]">Name</dt><dd className="font-medium">{form.name}</dd></div>
                <div className="px-4 py-3 flex justify-between gap-4"><dt className="text-[#6B7280]">Phone / Email</dt><dd className="font-medium text-right">{form.phone} · {form.email}</dd></div>
                <div className="px-4 py-3 flex justify-between gap-4"><dt className="text-[#6B7280]">Location</dt><dd className="font-medium">{form.location}</dd></div>
                <div className="px-4 py-3 flex justify-between gap-4"><dt className="text-[#6B7280]">Service &amp; Property</dt><dd className="font-medium">{form.service} ({form.propertyType})</dd></div>
                <div className="px-4 py-3 flex justify-between gap-4"><dt className="text-[#6B7280]">Timeline</dt><dd className="font-medium">{form.timeline}</dd></div>
                <div className="px-4 py-3"><dt className="text-[#6B7280] mb-1">Description</dt><dd className="text-[#111827]">{form.description}</dd></div>
              </dl>
              <div className="p-3 rounded bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E]">
                Demo Notice: Confirming saves this request locally in your browser so you can preview Staff/Admin quote tools. It is NOT yet sent to Rehoyah until the backend is connected.
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setStep('form')}>Edit Details</Button>
                <Button variant="primary" onClick={handleConfirmSubmit}>Confirm Demo Submission</Button>
              </div>
            </div>
          )}

          {step === 'success' && createdQuote && (
            <div className="rehoyah-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-md bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B2545]">Quote Request Saved (Demo Only)</h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Demo Reference: <strong className="text-[#0B2545] tabular-nums">{createdQuote.id}</strong>.
                <br />
                <strong>Important:</strong> This request is stored locally in browser demo storage only and has <strong>not yet been sent to Rehoyah</strong> because the backend API and email/database services are not connected yet.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button to="/account/quotes" variant="primary" size="sm">View in Demo Account</Button>
                <Button to="/services" variant="secondary" size="sm">Explore Services</Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
