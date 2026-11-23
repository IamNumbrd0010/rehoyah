/**
 * STAFF PROJECTS PAGE (/staff/projects)
 */

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import ImageUploadPlaceholder from '../../components/common/ImageUploadPlaceholder.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as projectService from '../../services/projectService.js';
import { STAFF_NAV_ITEMS } from './staffNav.js';

export default function StaffProjectsPage() {
  const { currentUser, showToast } = useApp();
  const [projects, setProjects] = useState([]);
  const [noteById, setNoteById] = useState({});
  const [progressById, setProgressById] = useState({});
  const [photos, setPhotos] = useState([]);

  const loadProjects = () => {
    if (!currentUser) return;
    projectService.getProjects().then((all) => {
      const visible =
        currentUser.role === 'admin'
          ? all
          : all.filter((p) => p.assignedStaffId === currentUser.id);
      setProjects(visible);
    });
  };

  useEffect(() => {
    loadProjects();
  }, [currentUser]);

  const handleToggleMilestone = async (projId, msId) => {
    await projectService.toggleProjectMilestone(projId, msId);
    loadProjects();
    showToast('Project milestone updated in demo storage.', 'info');
  };

  const handlePostUpdate = async (proj) => {
    const note = noteById[proj.id] || 'Progress check logged (Demo)';
    const progress =
      progressById[proj.id] !== undefined ? Number(progressById[proj.id]) : proj.progress;
    await projectService.addProjectUpdate(proj.id, {
      note,
      progress,
      author: currentUser?.fullName,
    });
    setNoteById((prev) => ({ ...prev, [proj.id]: '' }));
    loadProjects();
    showToast('Project progress update saved locally.', 'success');
  };

  return (
    <DashboardShell
      portal="staff"
      portalTitle="Staff Workspace"
      pageTitle="Assigned Projects & Milestones"
      navItems={STAFF_NAV_ITEMS}
      requiredPermission="updateProjects"
    >
      <div className="space-y-6">
        {projects.map((proj) => (
          <div key={proj.id} className="rehoyah-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs text-[#6B7280]">{proj.category} · {proj.location}</p>
                <h2 className="text-lg font-bold text-[#0B2545]">{proj.title}</h2>
              </div>
              <StatusBadge status={proj.status} />
            </div>

            {proj.milestones?.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
                  Milestones (Click to toggle)
                </h3>
                <div className="space-y-1.5">
                  {proj.milestones.map((ms) => (
                    <button
                      key={ms.id}
                      type="button"
                      onClick={() => handleToggleMilestone(proj.id, ms.id)}
                      className="flex items-center gap-2 text-sm text-[#111827] hover:text-[#0B2545] cursor-pointer"
                    >
                      {ms.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#9CA3AF]" />
                      )}
                      <span className={ms.completed ? 'line-through text-[#6B7280]' : ''}>{ms.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-[#EAECEF] items-end">
              <div className="md:col-span-3">
                <label className="rehoyah-label">Progress (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="rehoyah-input tabular-nums"
                  value={progressById[proj.id] ?? proj.progress}
                  onChange={(e) =>
                    setProgressById((prev) => ({ ...prev, [proj.id]: e.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-6">
                <label className="rehoyah-label">Progress Note</label>
                <input
                  type="text"
                  className="rehoyah-input"
                  placeholder="Enter site progress update..."
                  value={noteById[proj.id] || ''}
                  onChange={(e) =>
                    setNoteById((prev) => ({ ...prev, [proj.id]: e.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-3">
                <Button variant="primary" size="sm" className="w-full" onClick={() => handlePostUpdate(proj)}>
                  Log Demo Update
                </Button>
              </div>
            </div>

            <ImageUploadPlaceholder
              label="Site Progress Photos (Demo Preview Only)"
              files={photos}
              onChange={setPhotos}
            />
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
