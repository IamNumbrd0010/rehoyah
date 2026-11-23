/**
 * STAFF TASKS PAGE (/staff/tasks)
 */

import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import DataTable from '../../components/dashboard/DataTable.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as staffService from '../../services/staffService.js';
import { STAFF_NAV_ITEMS } from './staffNav.js';

export default function StaffTasksPage() {
  const { currentUser, showToast } = useApp();
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks = () => {
    if (!currentUser) return;
    staffService.getTasks({ status: statusFilter }).then((all) => {
      setTasks(
        currentUser.role === 'admin'
          ? all
          : all.filter((t) => t.assignedToId === currentUser.id)
      );
    });
  };

  useEffect(() => {
    loadTasks();
  }, [currentUser, statusFilter]);

  const handleStatusChange = async (id, nextStatus) => {
    await staffService.updateTaskStatus(id, nextStatus);
    loadTasks();
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({ ...selectedTask, status: nextStatus });
    }
    showToast(`Task updated to ${nextStatus}.`, 'success');
  };

  const columns = [
    {
      key: 'title',
      label: 'Task',
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedTask(row)}
          className="font-semibold text-[#0B2545] hover:underline text-left cursor-pointer"
        >
          {row.title}
        </button>
      ),
    },
    { key: 'priority', label: 'Priority' },
    { key: 'dueDate', label: 'Due Date', render: (row) => <span className="tabular-nums">{row.dueDate}</span> },
    { key: 'assignedBy', label: 'Assigned By' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Update',
      render: (row) => (
        <select
          aria-label={`Update status for ${row.title}`}
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="rehoyah-select py-1 text-xs"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
  ];

  return (
    <DashboardShell
      portal="staff"
      portalTitle="Staff Workspace"
      pageTitle="Assigned Tasks"
      navItems={STAFF_NAV_ITEMS}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'Pending', 'In Progress', 'Completed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded border cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0B2545] text-white border-[#0B2545]'
                  : 'bg-white text-[#4B5563] border-[#DEE2E6]'
              }`}
            >
              {st === 'all' ? 'All Tasks' : st}
            </button>
          ))}
        </div>

        <DataTable columns={columns} rows={tasks} emptyTitle="No tasks found" />
      </div>

      <Modal
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || 'Task Details'}
      >
        {selectedTask && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B7280] tabular-nums">
                {selectedTask.id} · Due {selectedTask.dueDate}
              </span>
              <StatusBadge status={selectedTask.status} />
            </div>
            <p className="text-[#4B5563]">{selectedTask.description}</p>
            <p className="text-xs text-[#6B7280]">
              Related {selectedTask.relatedType}: <strong>{selectedTask.relatedId || 'None'}</strong>
            </p>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}
