/**
 * ADMIN SETTINGS PAGE (/admin/settings)
 * --------------------------------------------------------------------------
 * Allows editing company contact placeholders, homepage hero slot,
 * credibility & testimonials section visibility, and SEO defaults in
 * demo localStorage.
 */

import { useEffect, useState } from 'react';
import Button from '../../components/common/Button.jsx';
import ImageUploadPlaceholder from '../../components/common/ImageUploadPlaceholder.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import { ADMIN_NAV_ITEMS } from './adminNav.js';

export default function AdminSettingsPage() {
  const { settings, refreshSettings, showToast } = useApp();
  const [form, setForm] = useState(null);
  const [heroFiles, setHeroFiles] = useState([]);

  useEffect(() => {
    if (settings) setForm(structuredClone(settings));
  }, [settings]);

  if (!form) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    const updated = {
      ...form,
      homepage: {
        ...form.homepage,
        heroImage: heroFiles[0]?.url || form.homepage.heroImage,
      },
    };
    await contentService.updateSettings(updated);
    await refreshSettings();
    showToast('Settings saved in browser demo storage.', 'success');
  };

  return (
    <DashboardShell
      portal="admin"
      portalTitle="Admin Control Center"
      pageTitle="Site & Homepage Settings"
      navItems={ADMIN_NAV_ITEMS}
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        <div className="rehoyah-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#0B2545]">Company Contact Placeholders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="rehoyah-label">Phone Placeholder</label>
              <input
                type="text"
                className="rehoyah-input"
                value={form.contact.phone}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
              />
            </div>
            <div>
              <label className="rehoyah-label">WhatsApp Placeholder</label>
              <input
                type="text"
                className="rehoyah-input"
                value={form.contact.whatsapp}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, whatsapp: e.target.value } })}
              />
            </div>
            <div>
              <label className="rehoyah-label">Email Placeholder</label>
              <input
                type="text"
                className="rehoyah-input"
                value={form.contact.email}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
              />
            </div>
            <div>
              <label className="rehoyah-label">Working Hours Placeholder</label>
              <input
                type="text"
                className="rehoyah-input"
                value={form.contact.workingHours}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, workingHours: e.target.value } })}
              />
            </div>
          </div>
          <div>
            <label className="rehoyah-label">Showroom / Office Address Placeholder</label>
            <input
              type="text"
              className="rehoyah-input"
              value={form.contact.address}
              onChange={(e) => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })}
            />
          </div>
        </div>

        <div className="rehoyah-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#0B2545]">Homepage Hero &amp; Section Visibility</h2>
          <div>
            <label className="rehoyah-label">Hero Headline</label>
            <input
              type="text"
              className="rehoyah-input"
              value={form.homepage.heroTitle}
              onChange={(e) => setForm({ ...form, homepage: { ...form.homepage, heroTitle: e.target.value } })}
            />
          </div>
          <div>
            <label className="rehoyah-label">Hero Supporting Copy</label>
            <textarea
              rows={2}
              className="rehoyah-textarea"
              value={form.homepage.heroSubtitle}
              onChange={(e) => setForm({ ...form, homepage: { ...form.homepage, heroSubtitle: e.target.value } })}
            />
          </div>
          <ImageUploadPlaceholder
            label="Replace Hero Image (Local Browser Preview)"
            multiple={false}
            files={heroFiles}
            onChange={setHeroFiles}
          />

          <div className="flex flex-wrap gap-6 pt-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.homepage.showCredibilitySection}
                onChange={(e) =>
                  setForm({
                    ...form,
                    homepage: { ...form.homepage, showCredibilitySection: e.target.checked },
                  })
                }
                className="accent-[#0B2545]"
              />
              <span>Show Credibility Strip on Home</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.homepage.showTestimonialsSection}
                onChange={(e) =>
                  setForm({
                    ...form,
                    homepage: { ...form.homepage, showTestimonialsSection: e.target.checked },
                  })
                }
                className="accent-[#0B2545]"
              />
              <span>Show Testimonials Section on Home</span>
            </label>
          </div>
        </div>

        <Button type="submit" variant="primary">
          Save Settings (Demo Storage)
        </Button>
      </form>
    </DashboardShell>
  );
}
