import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import ToastNotification from './ToastNotification';
import { getTasks, createTask, updateTask, deleteTask } from '../api';

const TaskManager = ({ user }) => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null); // { type: 'task', taskId, title }

  // Form State for Creating Task
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    priority: 'medium',
    subtasks: [{ title: '', instructions: '' }]
  });
  const [formValidationErrors, setFormValidationErrors] = useState([]);

  // Toast Alerts State
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', title = '') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User context object for audit logging
  const userContext = user ? { userId: user._id, username: user.username } : { userId: 'usr_guest', username: 'Guest User' };

  // Fetch Tasks using central api service (Practical 6)
  const fetchTasksData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resData = await getTasks(priorityFilter, statusFilter, searchQuery);
      setTasks(resData.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, [priorityFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasksData();
  };

  // Create Task Form Logic
  const handleSubtaskChange = (index, field, value) => {
    const updatedSubtasks = [...formData.subtasks];
    updatedSubtasks[index][field] = value;
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const addSubtaskField = () => {
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, { title: '', instructions: '' }]
    });
  };

  const removeSubtaskField = (index) => {
    const updatedSubtasks = formData.subtasks.filter((_, i) => i !== index);
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    setFormValidationErrors([]);

    const cleanSubtasks = formData.subtasks.filter((st) => st.title.trim() !== '');

    try {
      const resData = await createTask(
        { ...formData, subtasks: cleanSubtasks },
        userContext
      );

      addToast(`Task "${resData.data.title}" created & logged successfully!`, 'success', 'Task Created');
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        instructions: '',
        priority: 'medium',
        subtasks: [{ title: '', instructions: '' }]
      });
      fetchTasksData();
    } catch (err) {
      if (err.details && Array.isArray(err.details)) {
        setFormValidationErrors(err.details.map((d) => d.message));
      } else {
        setFormValidationErrors([err.message || 'Failed to create task']);
      }
      addToast(err.message || 'Validation failed', 'danger', 'Creation Error');
    }
  };

  // Toggle Task Completion
  const handleToggleTaskComplete = async (task) => {
    const updatedStatus = !task.completed;
    try {
      const resData = await updateTask(
        task._id,
        { completed: updatedStatus },
        userContext
      );

      addToast(
        `Task "${task.title}" marked as ${updatedStatus ? 'completed' : 'pending'}.`,
        updatedStatus ? 'success' : 'info',
        'Status Updated'
      );
      fetchTasksData();
    } catch (err) {
      addToast(err.message, 'danger', 'Update Error');
    }
  };

  // Delete Action Handlers
  const promptDeleteTask = (task) => {
    setDeleteCandidate({
      type: 'task',
      taskId: task._id,
      title: task.title
    });
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;

    try {
      const resData = await deleteTask(deleteCandidate.taskId, userContext);
      addToast(`Task "${deleteCandidate.title}" deleted and logged in audit sheet.`, 'warning', 'Task Deleted');
      fetchTasksData();
    } catch (err) {
      addToast(err.message, 'danger', 'Delete Error');
    } finally {
      setDeleteCandidate(null);
    }
  };

  // Stats Calculations
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalSubtasksCount = tasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0);
  const completedSubtasksCount = tasks.reduce(
    (acc, t) => acc + (t.subtasks?.filter((st) => st.completed).length || 0),
    0
  );

  return (
    <div className="task-manager-container container">
      {/* Toast Alert Banner */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      {/* Delete Confirmation Alert Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteCandidate?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />

      {/* Page Header */}
      <div className="task-page-header">
        <div>
          <span className="section-badge">Practical 6 Full-Stack React + Node + MongoDB</span>
          <h1 className="page-title">Task Management Suite</h1>
          <p className="page-subtitle">
            Centralized API integration (src/api.js), Mongoose schema validation, real-time activity logging, and step-by-step subtask pagers.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create New Task
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="task-stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{totalTasks}</span>
          <span className="stat-desc">Registered in database</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed Tasks</span>
          <span className="stat-value text-success">{completedTasksCount}</span>
          <span className="stat-desc">
            {totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0}% completion rate
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Subtasks Progress</span>
          <span className="stat-value text-highlight">
            {completedSubtasksCount} / {totalSubtasksCount}
          </span>
          <span className="stat-desc">Subtask steps completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active User Session</span>
          <span className="stat-value text-warning">{user?.username || 'Guest'}</span>
          <span className="stat-desc">All actions logged to audit trail</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="task-controls-card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks by title, description or instructions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div className="filter-group">
          <div className="filter-item">
            <label className="filter-label">Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching backend tasks via src/api.js...</p>
        </div>
      ) : error ? (
        <div className="error-card">
          <h4>Failed to fetch tasks</h4>
          <p>{error}</p>
          <button onClick={fetchTasksData} className="btn btn-secondary btn-sm">
            Retry Connection
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-tasks-card">
          <h3>No Tasks Found</h3>
          <p>No tasks match your search filter criteria.</p>
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            Create First Task
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => {
            const subCount = task.subtasks?.length || 0;
            const subCompleted = task.subtasks?.filter((st) => st.completed).length || 0;
            const progressPercent = subCount > 0 ? Math.round((subCompleted / subCount) * 100) : task.completed ? 100 : 0;

            return (
              <div key={task._id} className={`task-card ${task.completed ? 'completed-card' : ''}`}>
                <div className="task-card-header">
                  <span className={`priority-badge priority-${task.priority}`}>
                    {task.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className={`status-badge ${task.completed ? 'status-completed' : 'status-pending'}`}>
                    {task.completed ? '✓ Completed' : 'Pending'}
                  </span>
                </div>

                <h3 className="task-title" onClick={() => navigate(`/tasks/${task._id}`)}>
                  {task.title}
                </h3>

                {task.description && <p className="task-description">{task.description}</p>}

                {/* Subtask Progress Bar */}
                <div className="progress-section">
                  <div className="progress-bar-header">
                    <span>Subtasks Progress</span>
                    <span>
                      {subCompleted} / {subCount} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                {/* Task Instructions snippet */}
                {task.instructions && (
                  <div className="task-instruction-box">
                    <span className="instruction-heading">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      Task Instructions:
                    </span>
                    <p className="instruction-preview">{task.instructions}</p>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="task-card-actions">
                  <button
                    className="btn btn-primary btn-sm flex-1"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                  >
                    Open Paged Subtasks View →
                  </button>

                  <button
                    className={`btn btn-sm ${task.completed ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => handleToggleTaskComplete(task)}
                    title={task.completed ? 'Mark Pending' : 'Mark Complete'}
                  >
                    {task.completed ? 'Undo' : '✓ Done'}
                  </button>

                  <button
                    className="btn btn-danger-icon btn-sm"
                    onClick={() => promptDeleteTask(task)}
                    title="Delete Task"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal Dialog */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsCreateModalOpen(false)}>
              &times;
            </button>

            <h3 className="modal-title">Create New Task</h3>
            <p className="modal-subtitle">
              Action logged for user <strong>{user?.username || 'Guest'}</strong>. Title auto-trimmed before save.
            </p>

            {formValidationErrors.length > 0 && (
              <div className="validation-error-alert">
                <strong>Validation Errors Returned by Mongoose:</strong>
                <ul>
                  {formValidationErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleCreateTaskSubmit} className="task-form">
              <div className="form-group">
                <label className="form-label">
                  Task Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Practical 6: Wire React Frontend to Express Backend"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Priority Enum</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="form-input"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="form-group flex-2">
                  <label className="form-label">Task Description</label>
                  <input
                    type="text"
                    placeholder="Brief task objective..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Task Instructions</label>
                <textarea
                  rows="3"
                  placeholder="Step-by-step guidance for executing this task..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Subtasks Builder */}
              <div className="subtasks-builder">
                <div className="subtasks-builder-header">
                  <label className="form-label">Subtasks &amp; Step-by-Step Pagers</label>
                  <button type="button" onClick={addSubtaskField} className="btn btn-secondary btn-xs">
                    + Add Subtask Step
                  </button>
                </div>

                {formData.subtasks.map((sub, idx) => (
                  <div key={idx} className="subtask-builder-row">
                    <span className="step-num">{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder={`Subtask #${idx + 1} Title`}
                      value={sub.title}
                      onChange={(e) => handleSubtaskChange(idx, 'title', e.target.value)}
                      className="form-input flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Instructions..."
                      value={sub.instructions}
                      onChange={(e) => handleSubtaskChange(idx, 'instructions', e.target.value)}
                      className="form-input flex-1"
                    />
                    {formData.subtasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubtaskField(idx)}
                        className="btn btn-danger-icon btn-xs"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save &amp; Record Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
