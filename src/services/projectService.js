/**
 * PROJECT & PORTFOLIO SERVICE (DEMO MODE)
 * --------------------------------------------------------------------------
 * Manages public portfolio items, before/after showcase entries, and active
 * customer/staff/admin project tracking with milestones and updates.
 *
 * TODO (BACKEND INTEGRATION):
 * - Replace with GET/POST/PATCH endpoints mapped to `projects`,
 *   `project_milestones`, `project_updates`, and `project_media` tables.
 */

import { initialProjects } from '../data/demoData.js';
import { slugify } from '../utils/validation.js';
import { readDemoStore, writeDemoStore } from './demoStore.js';

const PROJECTS_KEY = 'projects';

export async function getProjects(filters = {}) {
  let list = readDemoStore(PROJECTS_KEY, initialProjects);

  if (filters.publishedOnly) {
    list = list.filter((p) => p.published);
  }
  if (filters.featuredOnly) {
    list = list.filter((p) => p.featured);
  }
  if (filters.customerId) {
    list = list.filter((p) => p.customerId === filters.customerId);
  }
  if (filters.assignedStaffId) {
    list = list.filter((p) => p.assignedStaffId === filters.assignedStaffId);
  }
  if (filters.category && filters.category !== 'all') {
    const catLower = filters.category.toLowerCase();
    list = list.filter(
      (p) =>
        p.category.toLowerCase() === catLower ||
        (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase() === catLower))
    );
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getProjectBySlug(slug) {
  const list = readDemoStore(PROJECTS_KEY, initialProjects);
  return list.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getProjectById(id) {
  const list = readDemoStore(PROJECTS_KEY, initialProjects);
  return list.find((p) => p.id === id) || null;
}

export async function createProject(data) {
  const list = readDemoStore(PROJECTS_KEY, initialProjects);
  const newProject = {
    id: `proj-${Date.now()}`,
    title: data.title,
    slug: data.slug || `${slugify(data.title)}-${Date.now().toString().slice(-4)}`,
    category: data.category || 'Residential',
    tags: data.tags || ['Interior'],
    location: data.location || 'Location Placeholder (Demo)',
    projectType: data.projectType || 'Interior Finishing',
    completionDate: data.completionDate || 'Timeline Placeholder',
    status: data.status || 'Planned',
    progress: Number(data.progress) || 0,
    featured: Boolean(data.featured),
    published: data.published !== false,
    image: data.image || '/assets/placeholders/project-residential.svg',
    gallery: data.gallery || [data.image || '/assets/placeholders/project-residential.svg'],
    beforeImage: data.beforeImage || null,
    afterImage: data.afterImage || null,
    servicesUsed: data.servicesUsed || [],
    description: data.description || '',
    customerId: data.customerId || null,
    assignedStaffId: data.assignedStaffId || null,
    budgetPlaceholder: data.budgetPlaceholder || 'Demo Budget Placeholder',
    milestones: data.milestones || [],
    updates: [],
    isDemo: true,
  };
  writeDemoStore(PROJECTS_KEY, [newProject, ...list]);
  return { ok: true, data: newProject, isDemo: true };
}

export async function updateProject(id, updates) {
  const list = readDemoStore(PROJECTS_KEY, initialProjects);
  const updated = list.map((p) => (p.id === id ? { ...p, ...updates } : p));
  writeDemoStore(PROJECTS_KEY, updated);
  return { ok: true, data: updated.find((p) => p.id === id), isDemo: true };
}

export async function addProjectUpdate(id, update) {
  const list = readDemoStore(PROJECTS_KEY, initialProjects);
  const updated = list.map((p) => {
    if (p.id !== id) return p;
    const entry = {
      id: `upd-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      note: update.note,
      author: update.author || 'Demo Staff',
    };
    return {
      ...p,
      progress: update.progress !== undefined ? Number(update.progress) : p.progress,
      status: update.status || p.status,
      updates: [entry, ...(p.updates || [])],
    };
  });
  writeDemoStore(PROJECTS_KEY, updated);
  return { ok: true, data: updated.find((p) => p.id === id), isDemo: true };
}

export async function toggleProjectMilestone(projectId, milestoneId) {
  const list = readDemoStore(PROJECTS_KEY, initialProjects);
  const updated = list.map((p) => {
    if (p.id !== projectId) return p;
    const milestones = (p.milestones || []).map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    return { ...p, milestones };
  });
  writeDemoStore(PROJECTS_KEY, updated);
  return { ok: true, data: updated.find((p) => p.id === projectId), isDemo: true };
}
