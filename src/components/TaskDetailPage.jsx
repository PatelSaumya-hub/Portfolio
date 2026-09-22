import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import ToastNotification from './ToastNotification';
import { getTaskById, getTasks, updateTask, deleteTask, updateSubtask, deleteSubtask } from '../api';

const TaskDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subtask Pagination State
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', title = '') => {
    const toastId = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id: toastId, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
  };

  const removeToast = (toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  // User context object for audit logging
  const userContext = user ? { userId: user._id, username: user.username } : { userId: 'usr_guest', username: 'Guest User' };

  // Fetch Task Details & All Tasks list using src/api.js
  const fetchTaskDetailsData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch current task by ID
      const res = await getTaskById(id);
      setTask(res.data);

      // 2. Fetch all tasks to enable Next Task navigation
      const listRes = await getTasks();
      setAllTasks(listRes.data || []);
    } catch (err) {
      console.error('Fetch detail error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetailsData();
    setActiveStepIndex(0);
  }, [id]);

  if (loading) {
    return (
      <div className="task-detail-container container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching task details via src/api.js...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="task-detail-container container">
        <div className="error-card">
          <h2>Task Not Found</h2>
          <p>{error || 'The requested task does not exist in the database.'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
            ← Back to Task Dashboard
          </button>
        </div>
      </div>
    );
  }

  const subtasks = task.subtasks || [];
  const totalSubtasks = subtasks.length;
  const activeSubtask = subtasks[activeStepIndex];
  const completedSubtasksCount = subtasks.filter((st) => st.completed).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasksCount / totalSubtasks) * 100) : task.completed ? 100 : 0;

  // Determine Next Task in list
  const currentTaskIndex = allTasks.findIndex((t) => t._id === task._id);
  const nextTask = currentTaskIndex >= 0 && currentTaskIndex < allTasks.length - 1 ? allTasks[currentTaskIndex + 1] : null;
  const prevTask = currentTaskIndex > 0 ? allTasks[currentTaskIndex - 1] : null;

  // Subtask Actions
  const handleToggleSubtask = async (subtaskId, currentCompleted) => {
    try {
      const res = await updateSubtask(
        task._id,
        subtaskId,
        { completed: !currentCompleted },
        userContext
      );

      setTask(res.data);
      addToast(
        `Subtask step marked as ${!currentCompleted ? 'completed' : 'pending'} & logged.`,
        !currentCompleted ? 'success' : 'info',
        'Subtask Updated'
      );
    } catch (err) {
      addToast(err.message, 'danger', 'Update Error');
    }
  };

  const handleCompleteAndNextSubtask = async (subtaskId) => {
    await handleToggleSubtask(subtaskId, false);
    if (activeStepIndex < totalSubtasks - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  // Toggle Entire Task Complete
  const handleToggleTaskComplete = async () => {
    const updatedStatus = !task.completed;
    try {
      const res = await updateTask(
        task._id,
        { completed: updatedStatus },
        userContext
      );

      setTask(res.data);
      addToast(
        `Task "${task.title}" marked as ${updatedStatus ? 'completed' : 'pending'}.`,
        updatedStatus ? 'success' : 'info',
        'Task Status'
      );
    } catch (err) {
      addToast(err.message, 'danger', 'Update Error');
    }
  };

  // Prompt Delete Task or Subtask
  const promptDeleteTask = () => {
    setDeleteCandidate({
      type: 'task',
      id: task._id,
      title: task.title
    });
  };

  const promptDeleteSubtask = (subtask) => {
    setDeleteCandidate({
      type: 'subtask',
      id: subtask._id,
      title: subtask.title
    });
  };

  const confirmDeleteAction = async () => {
    if (!deleteCandidate) return;

    try {
      if (deleteCandidate.type === 'task') {
        await deleteTask(deleteCandidate.id, userContext);
        addToast(`Task "${deleteCandidate.title}" deleted and logged to Excel audit sheet.`, 'warning', 'Task Deleted');
        navigate('/tasks');
      } else if (deleteCandidate.type === 'subtask') {
        const res = await deleteSubtask(task._id, deleteCandidate.id, userContext);
        setTask(res.data);
        addToast(`Subtask step "${deleteCandidate.title}" deleted & logged.`, 'warning', 'Subtask Deleted');

        if (activeStepIndex >= res.data.subtasks.length && activeStepIndex > 0) {
          setActiveStepIndex(res.data.subtasks.length - 1);
        }
      }
    } catch (err) {
      addToast(err.message, 'danger', 'Delete Error');
    } finally {
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="task-detail-container container">
      {/* Toast Alert Notifications */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      {/* Delete Confirmation Alert Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${deleteCandidate?.type || 'item'}?`}
        onConfirm={confirmDeleteAction}
        onCancel={() => setDeleteCandidate(null)}
      />

      {/* Navigation Breadcrumb Bar */}
      <div className="detail-nav-bar">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tasks')}>
          ← Back to Task Dashboard
        </button>

        <div className="nav-task-jump-buttons">
          {prevTask && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(`/tasks/${prevTask._id}`)}
              title={prevTask.title}
            >
              ← Prev Task
            </button>
          )}
          {nextTask && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(`/tasks/${nextTask._id}`)}
              title={nextTask.title}
            >
              Next Task: {nextTask.title.slice(0, 20)}... →
            </button>
          )}
        </div>
      </div>

      {/* Main Task Header Card */}
      <div className="task-detail-card">
        <div className="detail-header-top">
          <div className="badges-group">
            <span className={`priority-badge priority-${task.priority}`}>
              {task.priority.toUpperCase()} PRIORITY
            </span>
            <span className={`status-badge ${task.completed ? 'status-completed' : 'status-pending'}`}>
              {task.completed ? '✓ Overall Task Completed' : 'In Progress'}
            </span>
          </div>

          <div className="action-buttons-group">
            <button
              className={`btn btn-sm ${task.completed ? 'btn-secondary' : 'btn-success'}`}
              onClick={handleToggleTaskComplete}
            >
              {task.completed ? 'Mark Pending' : '✓ Mark Entire Task Completed'}
            </button>
            <button className="btn btn-danger-icon btn-sm" onClick={promptDeleteTask} title="Delete Task">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        </div>

        <h1 className="detail-task-title">{task.title}</h1>
        {task.description && <p className="detail-task-desc">{task.description}</p>}

        {/* Task Overall Progress */}
        <div className="detail-progress-wrapper">
          <div className="progress-bar-header">
            <span>Overall Completion Progress</span>
            <span>
              {completedSubtasksCount} of {totalSubtasks} Subtasks ({progressPercent}%)
            </span>
          </div>
          <div className="progress-track lg">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Task Instructions Section */}
      {task.instructions && (
        <div className="task-instructions-card">
          <div className="instructions-card-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <h3>Task Master Instructions</h3>
          </div>
          <div className="instructions-body">
            <p>{task.instructions}</p>
          </div>
        </div>
      )}

      {/* Subtask Step-by-Step Dedicated Paging Showcase System */}
      <div className="subtasks-pager-section">
        <div className="pager-section-header">
          <div>
            <h2>Dedicated Subtask Step Pager</h2>
            <p>Step-by-step showcase for executing individual task requirements.</p>
          </div>

          <div className="pager-step-indicator">
            Step <strong>{totalSubtasks > 0 ? activeStepIndex + 1 : 0}</strong> of {totalSubtasks}
          </div>
        </div>

        {totalSubtasks === 0 ? (
          <div className="empty-subtasks-box">
            <p>No subtask steps added yet for this task.</p>
          </div>
        ) : (
          <>
            {/* Step Pager Navigation Pills */}
            <div className="subtask-step-pills">
              {subtasks.map((st, idx) => (
                <button
                  key={st._id || idx}
                  className={`step-pill ${idx === activeStepIndex ? 'active' : ''} ${st.completed ? 'completed' : ''}`}
                  onClick={() => setActiveStepIndex(idx)}
                >
                  <span className="pill-num">{idx + 1}</span>
                  <span className="pill-title">{st.title.slice(0, 18)}{st.title.length > 18 ? '...' : ''}</span>
                  {st.completed && <span className="pill-check">✓</span>}
                </button>
              ))}
            </div>

            {/* Active Subtask Page Showcase Card */}
            {activeSubtask && (
              <div className={`subtask-showcase-card ${activeSubtask.completed ? 'completed-step' : ''}`}>
                <div className="showcase-card-header">
                  <span className="step-tag">Step #{activeStepIndex + 1}</span>
                  <div className="showcase-header-right">
                    <span className={`step-status-tag ${activeSubtask.completed ? 'done' : 'pending'}`}>
                      {activeSubtask.completed ? '✓ Completed' : 'Pending Action'}
                    </span>
                    <button
                      className="btn btn-danger-icon btn-xs"
                      onClick={() => promptDeleteSubtask(activeSubtask)}
                      title="Delete this subtask step"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>

                <h3 className="showcase-subtask-title">{activeSubtask.title}</h3>

                {/* Subtask Instructions Box */}
                {activeSubtask.instructions ? (
                  <div className="subtask-instruction-detail">
                    <h4>Subtask Guidance / Instructions:</h4>
                    <p>{activeSubtask.instructions}</p>
                  </div>
                ) : (
                  <p className="no-sub-instructions">No additional instructions specified for this subtask step.</p>
                )}

                {/* Interactive Subtask Action Bar */}
                <div className="showcase-controls">
                  <button
                    className={`btn ${activeSubtask.completed ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => handleToggleSubtask(activeSubtask._id, activeSubtask.completed)}
                  >
                    {activeSubtask.completed ? 'Undo Completion' : '✓ Mark Step Complete'}
                  </button>

                  {!activeSubtask.completed && activeStepIndex < totalSubtasks - 1 && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleCompleteAndNextSubtask(activeSubtask._id)}
                    >
                      ✓ Complete &amp; Next Step →
                    </button>
                  )}
                </div>

                {/* Step Pager Footer Navigation */}
                <div className="pager-footer-nav">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  >
                    ← Previous Step
                  </button>

                  <div className="dots-nav">
                    {subtasks.map((_, i) => (
                      <span
                        key={i}
                        className={`dot ${i === activeStepIndex ? 'active' : ''}`}
                        onClick={() => setActiveStepIndex(i)}
                      />
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={activeStepIndex === totalSubtasks - 1}
                    onClick={() => setActiveStepIndex((prev) => Math.min(totalSubtasks - 1, prev + 1))}
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Next Task Banner Progression */}
      {nextTask && (
        <div className="next-task-banner-card">
          <div className="banner-content">
            <span className="banner-badge">Task Queue</span>
            <h3>Finished with this task? Move to the Next Task!</h3>
            <p><strong>Next Task:</strong> {nextTask.title}</p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(`/tasks/${nextTask._id}`)}
          >
            Go to Next Task →
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;
