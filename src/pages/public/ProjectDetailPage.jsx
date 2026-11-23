/**
 * PROJECT CASE STUDY DETAIL PAGE
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import BeforeAfterSlider from '../../components/projects/BeforeAfterSlider.jsx';
import ProjectCard from '../../components/projects/ProjectCard.jsx';
import * as projectService from '../../services/projectService.js';

export default function ProjectDetailPage() {
  const { projectSlug } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      projectService.getProjectBySlug(projectSlug),
      projectService.getProjects({ publishedOnly: true }),
    ]).then(([found, all]) => {
      if (!active) return;
      setProject(found);
      if (found) {
        setRelated(all.filter((p) => p.id !== found.id).slice(0, 3));
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [projectSlug]);

  return (
    <PageShell>
      <div className="rehoyah-container-wide py-10 md:py-14">
        {loading ? (
          <LoadingState rows={4} />
        ) : !project ? (
          <EmptyState
            title="Project not found"
            description="This portfolio entry could not be found."
            actionLabel="Back to Projects"
            actionTo="/projects"
          />
        ) : (
          <div className="space-y-12">
            <div>
              <Breadcrumbs
                items={[
                  { label: 'Home', to: '/' },
                  { label: 'Projects', to: '/projects' },
                  { label: project.title },
                ]}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
                    {project.category} · {project.projectType}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#0B2545]">{project.title}</h1>
                  <p className="text-base text-[#4B5563] leading-relaxed">{project.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="rehoyah-card p-4">
                      <p className="text-xs text-[#6B7280]">Location</p>
                      <p className="text-sm font-semibold text-[#0B2545] mt-1">{project.location}</p>
                    </div>
                    <div className="rehoyah-card p-4">
                      <p className="text-xs text-[#6B7280]">Completion</p>
                      <p className="text-sm font-semibold text-[#0B2545] mt-1">{project.completionDate}</p>
                    </div>
                    <div className="rehoyah-card p-4">
                      <p className="text-xs text-[#6B7280]">Project Status</p>
                      <p className="text-sm font-semibold text-[#0B2545] mt-1">{project.status}</p>
                    </div>
                  </div>

                  {project.servicesUsed?.length > 0 && (
                    <div className="pt-2">
                      <h2 className="text-sm font-semibold text-[#0B2545] mb-2">Services Applied</h2>
                      <p className="text-sm text-[#4B5563]">{project.servicesUsed.join(' · ')}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button to="/request-quote" variant="primary">
                      Request a Similar Project Quote
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  <div className="aspect-[4/3] rounded-md overflow-hidden border border-[#DEE2E6]">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {project.beforeImage && project.afterImage && (
              <div className="pt-8 border-t border-[#EAECEF] max-w-4xl">
                <h2 className="text-xl font-bold text-[#0B2545] mb-4">Before &amp; After Comparison</h2>
                <BeforeAfterSlider
                  beforeImage={project.beforeImage}
                  afterImage={project.afterImage}
                />
              </div>
            )}

            {related.length > 0 && (
              <div className="pt-8 border-t border-[#EAECEF]">
                <h2 className="text-xl font-bold text-[#0B2545] mb-5">Related Sample Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((item) => (
                    <ProjectCard key={item.id} project={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
