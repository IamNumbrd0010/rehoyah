/**
 * CONTENT, SERVICES, ARTICLES, APPOINTMENTS & SETTINGS SERVICE (DEMO MODE)
 * --------------------------------------------------------------------------
 * Centralizes Services, Inspiration Articles, Reviews/Testimonials,
 * Consultation Appointments, Contact/Newsletter demo submissions, and
 * Admin Site Settings.
 *
 * TODO (BACKEND INTEGRATION):
 * - Connect each group to its corresponding API endpoints and DB tables.
 * - Contact, booking, and newsletter forms currently store demo submissions
 *   locally only and do NOT send emails or create calendar bookings.
 */

import {
  initialAppointments,
  initialArticles,
  initialServices,
  initialSettings,
  initialTestimonials,
} from '../data/demoData.js';
import { slugify } from '../utils/validation.js';
import { readDemoStore, writeDemoStore } from './demoStore.js';

const SERVICES_KEY = 'services';
const ARTICLES_KEY = 'articles';
const TESTIMONIALS_KEY = 'testimonials';
const APPOINTMENTS_KEY = 'appointments';
const SETTINGS_KEY = 'settings';
const CONTACT_MESSAGES_KEY = 'contact_messages';
const NEWSLETTER_KEY = 'newsletter_subscribers';

// --- SERVICES ---
export async function getServices(filters = {}) {
  let list = readDemoStore(SERVICES_KEY, initialServices);
  list = [...list].sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  if (filters.activeOnly) list = list.filter((s) => s.active);
  if (filters.featuredOnly) list = list.filter((s) => s.featured);
  if (filters.category && filters.category !== 'all') {
    list = list.filter((s) => s.category === filters.category);
  }
  return list;
}

export async function getServiceBySlug(slug) {
  const list = readDemoStore(SERVICES_KEY, initialServices);
  return list.find((s) => s.slug === slug || s.id === slug) || null;
}

export async function saveService(data) {
  const list = readDemoStore(SERVICES_KEY, initialServices);
  if (data.id) {
    const updated = list.map((s) => (s.id === data.id ? { ...s, ...data } : s));
    writeDemoStore(SERVICES_KEY, updated);
    return { ok: true, data: updated.find((s) => s.id === data.id), isDemo: true };
  }
  const newService = {
    id: `srv-${Date.now()}`,
    name: data.name,
    slug: data.slug || slugify(data.name),
    category: data.category || 'Finishing & Wall Treatments',
    featured: Boolean(data.featured),
    active: data.active !== false,
    displayOrder: Number(data.displayOrder) || list.length + 1,
    image: data.image || '/assets/placeholders/hero-interior.svg',
    shortDescription: data.shortDescription || '',
    description: data.description || '',
    process: data.process || ['Consultation', 'Preparation', 'Execution', 'Review'],
    faqs: data.faqs || [],
  };
  writeDemoStore(SERVICES_KEY, [...list, newService]);
  return { ok: true, data: newService, isDemo: true };
}

// --- ARTICLES ---
export async function getArticles(filters = {}) {
  let list = readDemoStore(ARTICLES_KEY, initialArticles);
  if (filters.publishedOnly) list = list.filter((a) => a.status === 'published');
  if (filters.category && filters.category !== 'all') {
    list = list.filter((a) => a.category === filters.category);
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function getArticleBySlug(slug) {
  const list = readDemoStore(ARTICLES_KEY, initialArticles);
  return list.find((a) => a.slug === slug || a.id === slug) || null;
}

export async function saveArticle(data) {
  const list = readDemoStore(ARTICLES_KEY, initialArticles);
  if (data.id) {
    const updated = list.map((a) => (a.id === data.id ? { ...a, ...data } : a));
    writeDemoStore(ARTICLES_KEY, updated);
    return { ok: true, data: updated.find((a) => a.id === data.id), isDemo: true };
  }
  const newArticle = {
    id: `art-${Date.now()}`,
    title: data.title,
    slug: data.slug || `${slugify(data.title)}-${Date.now().toString().slice(-4)}`,
    category: data.category || 'Interior Design',
    tags: data.tags || ['Demo'],
    excerpt: data.excerpt || '',
    image: data.image || '/assets/placeholders/hero-interior.svg',
    datePlaceholder: data.datePlaceholder || 'Sample Date Placeholder',
    readTimePlaceholder: data.readTimePlaceholder || '4 min read (Demo)',
    authorPlaceholder: data.authorPlaceholder || 'Demo Staff Draft',
    featured: Boolean(data.featured),
    status: data.status || 'draft',
    body: Array.isArray(data.body)
      ? data.body
      : String(data.body || '')
          .split('\n\n')
          .filter(Boolean),
    isDemo: true,
  };
  writeDemoStore(ARTICLES_KEY, [newArticle, ...list]);
  return { ok: true, data: newArticle, isDemo: true };
}

// --- TESTIMONIALS / REVIEWS ---
export async function getTestimonials(publishedOnly = false) {
  const list = readDemoStore(TESTIMONIALS_KEY, initialTestimonials);
  return publishedOnly ? list.filter((t) => t.published && t.status === 'Approved') : list;
}

export async function updateTestimonial(id, updates) {
  const list = readDemoStore(TESTIMONIALS_KEY, initialTestimonials);
  const updated = list.map((t) => (t.id === id ? { ...t, ...updates } : t));
  writeDemoStore(TESTIMONIALS_KEY, updated);
  return { ok: true, data: updated.find((t) => t.id === id), isDemo: true };
}

// --- APPOINTMENTS ---
export async function getAppointments() {
  return readDemoStore(APPOINTMENTS_KEY, initialAppointments);
}

export async function createAppointment(data) {
  // TODO: POST /api/appointments with real staff availability verification
  const list = readDemoStore(APPOINTMENTS_KEY, initialAppointments);
  const newApt = {
    id: `APT-DEMO-${Math.floor(300 + Math.random() * 699)}`,
    customerId: data.customerId || null,
    customerName: data.name,
    email: data.email,
    phone: data.phone,
    consultationType: data.consultationType,
    preferredDate: data.preferredDate,
    preferredSlot: data.preferredSlot,
    mode: data.mode,
    location: data.location || 'Remote / Phone',
    notes: data.notes || '',
    status: 'Requested (Demo)',
    assignedStaffId: null,
    isDemo: true,
  };
  writeDemoStore(APPOINTMENTS_KEY, [newApt, ...list]);
  return { ok: true, data: newApt, isDemo: true };
}

export async function updateAppointment(id, updates) {
  const list = readDemoStore(APPOINTMENTS_KEY, initialAppointments);
  const updated = list.map((a) => (a.id === id ? { ...a, ...updates } : a));
  writeDemoStore(APPOINTMENTS_KEY, updated);
  return { ok: true, data: updated.find((a) => a.id === id), isDemo: true };
}

// --- SETTINGS ---
export async function getSettings() {
  return readDemoStore(SETTINGS_KEY, initialSettings);
}

export async function updateSettings(nextSettings) {
  writeDemoStore(SETTINGS_KEY, nextSettings);
  return { ok: true, data: nextSettings, isDemo: true };
}

// --- CONTACT & NEWSLETTER (DEMO ONLY) ---
export async function submitContactMessage(data) {
  // TODO: POST /api/contact — send email / store support ticket
  const list = readDemoStore(CONTACT_MESSAGES_KEY, []);
  const record = { id: `MSG-${Date.now()}`, ...data, createdAt: new Date().toISOString(), isDemo: true };
  writeDemoStore(CONTACT_MESSAGES_KEY, [record, ...list]);
  return { ok: true, data: record, isDemo: true };
}

export async function subscribeNewsletter(email) {
  // TODO: POST /api/newsletter — integrate with mailing list provider
  const list = readDemoStore(NEWSLETTER_KEY, []);
  if (!list.includes(email)) {
    writeDemoStore(NEWSLETTER_KEY, [...list, email]);
  }
  return { ok: true, isDemo: true };
}
