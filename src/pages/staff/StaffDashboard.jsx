/**
 * STAFF WORKSPACE OVERVIEW (/staff)
 */

import { useEffect, useState } from 'react';
import { CheckSquare, FileEdit, FolderKanban, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import * as projectService from '../../services/projectService.js';
import * as quoteService from '../../services/quoteService.js';
import * as staffService from '../../services/staffService.js';
import { STAFF_NAV_ITEMS } from './staffNav.js';

export default function StaffDashboard() {
  const { currentUser } = useApp();
  const [tasks, setTasks] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    Promise.all([
      staffService.getTasks(),
      quoteService.getQuotes(),
      projectService.getProjects(),
      contentService.getArticles(),
    ]).then(([t, q, p, a]) => {
      setTasks(
        currentUser.role === 'admin'
          ? t
          : t.filter((item) => item.assignedToId === currentUser.id)
      );
      setEnquiries(
        currentUser.role === 'admin'
          ? q
          : q.filter((item) => item.assignedStaffId === currentUser.id || !item.assignedStaffId)
      );
      setProjects(
        currentUser.role === 'admin'
          ? p
          : p.filter((item) => item.assignedStaffId === currentUser.id)
      );
      setArticles(a.filter((art) => art.status === 'draft' || art.status === 'pending'));
    });
  }, [currentUser]);

  return (
    <DashboardShell
      portal="staff"
      portalTitle="Staff Workspace"
      portalSubtitle={currentUser?.staffRoleTitle || 'Staff Demo'}
      pageTitle="Staff Dashboard"
      navItems={STAFF_NAV_ITEMS}
    >
      <div className="space-y-6">
        <div className="rehoyah-card p-5 bg-[#0B2545] text-white border-[#0B2545]">
          <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            Welcome, {currentUser?.fullName}
          </p>
          <p className="text-sm text-[#E5E7EB] mt-1">
            Role Preview: <strong>{currentUser?.staffRoleTitle || 'Staff'}</strong> · Department: {currentUser?.department || 'Operations (Demo)'}.
            Sidebar items adjust automatically based on your assigned demo permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Assigned Tasks" value={tasks.length} note="Demo task queue" icon={CheckSquare} />
          <StatCard label="Quote Enquiries" value={enquiries.length} note="Assigned or open" icon={MessageSquareText} />
          <StatCard label="Project Assignments" value={projects.length} note="Active & planned" icon={FolderKanban} />
          <StatCard label="Content Drafts" value={articles.length} note="Awaiting review" icon={FileEdit} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rehoyah-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0B2545]">Task Deadlines (Demo)</h2>
              <Link to="/staff/tasks" className="text-xs font-semibold text-[#0B2545] hover:underline">
                Manage Tasks
              </Link>
            </div>
            <div className="divide-y divide-[#EAECEF]">
              {tasks.slice(0, 4).map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0B2545]">{t.title}</p>
                    <p className="text-xs text-[#6B7280] tabular-nums">Due {t.dueDate} · Priority: {t.priority}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
              {tasks.length === 0 && <p className="text-sm text-[#6B7280]">No tasks assigned.</p>}
            </div>
          </div>

          <div className="rehoyah-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0B2545]">Assigned Enquiries</h2>
              <Link to="/staff/enquiries" className="text-xs font-semibold text-[#0B2545] hover:underline">
                Open Queue
              </Link>
            </div>
            <div className="divide-y divide-[#EAECEF]">
              {enquiries.slice(0, 4).map((q) => (
                <div key={q.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0B2545]">{q.customerName} — {q.service}</p>
                    <p className="text-xs text-[#6B7280] tabular-nums">{q.id} · {q.location}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
              ))}
              {enquiries.length === 0 && <p className="text-sm text-[#6B7280]">No assigned enquiries.</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
