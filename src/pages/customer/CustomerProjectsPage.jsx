/**
 * CUSTOMER PROJECTS PAGE (/account/projects)
 */

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as projectService from '../../services/projectService.js';
import { CUSTOMER_NAV_ITEMS } from './customerNav.js';

export default function CustomerProjectsPage() {
  const { currentUser } = useApp();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    projectService.getProjects({ customerId: currentUser.id }).then(setProjects);
  }, [currentUser]);

  return (
    <DashboardShell
      portal="customer"
      portalTitle="Customer Portal"
      pageTitle="My Projects (Progress Placeholders)"
      navItems={CUSTOMER_NAV_ITEMS}
    >
      {projects.length === 0 ? (
        <EmptyState
          title="No active projects linked"
          description="Once Rehoyah links an active finishing or renovation project to your account, progress milestones will appear here."
          actionLabel="Explore Portfolio"
          actionTo="/projects"
        />
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => (
            <div key={proj.id} className="rehoyah-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-[#6B7280]">{proj.category} · {proj.location}</p>
                  <h3 className="text-lg font-bold text-[#0B2545]">{proj.title}</h3>
                </div>
                <StatusBadge status={proj.status} />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#6B7280]">Demo Progress</span>
                  <span className="font-semibold text-[#0B2545] tabular-nums">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#EAECEF] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0B2545]" style={{ width: `${proj.progress}%` }} />
                </div>
              </div>

              {proj.milestones?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
                    Milestones
                  </h4>
                  <ul className="space-y-1.5 text-sm">
                    {proj.milestones.map((ms) => (
                      <li key={ms.id} className="flex items-center gap-2 text-[#111827]">
                        {ms.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                        )}
                        <span className={ms.completed ? 'line-through text-[#6B7280]' : ''}>{ms.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
