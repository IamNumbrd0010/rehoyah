/**
 * PROJECTS / PORTFOLIO INDEX PAGE
 */

import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import ProjectCard from '../../components/projects/ProjectCard.jsx';
import * as projectService from '../../services/projectService.js';

const PROJECT_FILTERS = [
  'all',
  'Residential',
  'Commercial',
  'Office',
  'School',
  'Church',
  'Hotel',
  'Restaurant',
  'Interior',
  'Exterior',
  'Furniture',
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    projectService
      .getProjects({ publishedOnly: true, category, search })
      .then((list) => {
        if (!active) return;
        setProjects(list);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, search]);

  return (
    <PageShell>
      <section className="bg-[#F8F9FA] border-b border-[#EAECEF] py-10">
        <div className="rehoyah-container-wide">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Projects' }]} />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
            Portfolio Showcase · Demo Entries
          </p>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold text-[#0B2545]">
            Completed &amp; Ongoing Spaces
          </h1>
          <p className="mt-2 text-sm text-[#4B5563] max-w-2xl">
            Demonstration portfolio layout ready for verified Rehoyah site photographs, before/after pairs, and project notes.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="rehoyah-container-wide space-y-8">
          <div className="rehoyah-card p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search projects by title, type, or location..."
                label="Search projects"
                className="w-full md:w-80"
              />
              <span className="text-xs text-[#6B7280] tabular-nums">
                {projects.length} demo project{projects.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F1F3F5]">
              {PROJECT_FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border cursor-pointer transition-colors ${
                    category === cat
                      ? 'bg-[#0B2545] text-white border-[#0B2545]'
                      : 'bg-[#F8F9FA] text-[#4B5563] border-[#EAECEF] hover:border-[#CED4DA]'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingState rows={3} />
          ) : projects.length === 0 ? (
            <EmptyState
              title="No demo projects match that filter"
              description="Reset filters to view all sample portfolio entries."
              actionLabel="Show All Projects"
              onAction={() => {
                setCategory('all');
                setSearch('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
