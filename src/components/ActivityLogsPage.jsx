import React, { useState, useEffect } from 'react';
import { getAuditLogs, getExcelExportUrl } from '../api';
import ToastNotification from './ToastNotification';

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [actionFilter, setActionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notifications
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

  // Fetch Audit Logs from Backend API
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAuditLogs(actionFilter, searchQuery);
      setLogs(res.data || []);
    } catch (err) {
      console.error('Error loading audit logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  // Handle Excel Sheet Export (.xlsx)
  const handleExportExcel = () => {
    addToast('Generating formatted Excel (.xlsx) spreadsheet of all audit logs...', 'success', 'Excel Export');
    const downloadUrl = getExcelExportUrl();
    window.location.href = downloadUrl;
  };

  // Badge Color Map for Action Types
  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'LOGIN':
      case 'LOGIN_2FA_SUCCESS':
      case '2FA_VERIFICATION_SUCCESS':
        return 'log-badge-success';
      case 'LOGOUT':
      case 'LOGIN_FAILED':
      case '2FA_FAILED':
        return 'log-badge-warning';
      case 'TASK_DELETE':
      case 'SUBTASK_DELETE':
        return 'log-badge-danger';
      case 'TASK_CREATE':
      case 'SUBTASK_ADD':
        return 'log-badge-primary';
      case 'PROFILE_PIC_UPDATE':
      case 'USER_REGISTERED':
        return 'log-badge-purple';
      default:
        return 'log-badge-default';
    }
  };

  return (
    <div className="activity-logs-container container">
      {/* Toast Alert Banners */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      {/* Page Header */}
      <div className="task-page-header">
        <div>
          <span className="section-badge">System Security &amp; Audit Trail</span>
          <h1 className="page-title">Activity Audit Logs</h1>
          <p className="page-subtitle">
            Complete real-time ledger of every user action, 2FA login, profile picture change, task addition, and deletion.
          </p>
        </div>

        {/* Download Excel Sheet Button (.xlsx) */}
        <button className="btn btn-primary btn-lg" onClick={handleExportExcel}>
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13h8" />
            <path d="M8 17h8" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Download Excel Sheet (.xlsx)
        </button>
      </div>

      {/* Stats Summary */}
      <div className="task-stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Logged Activities</span>
          <span className="stat-value">{logs.length}</span>
          <span className="stat-desc">Recorded system audit events</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Deletions Logged</span>
          <span className="stat-value text-danger">
            {logs.filter((l) => l.action.includes('DELETE')).length}
          </span>
          <span className="stat-desc">Task &amp; subtask delete entries</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Auth &amp; 2FA Events</span>
          <span className="stat-value text-success">
            {logs.filter((l) => l.action.includes('LOGIN') || l.action.includes('2FA')).length}
          </span>
          <span className="stat-desc">Security &amp; verification logs</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Profile Updates</span>
          <span className="stat-value text-highlight">
            {logs.filter((l) => l.action.includes('PROFILE')).length}
          </span>
          <span className="stat-desc">Avatar &amp; profile changes</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="task-controls-card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search logs by username, action or activity details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search Logs
          </button>
        </form>

        <div className="filter-group">
          <div className="filter-item">
            <label className="filter-label">Filter Action:</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Actions</option>
              <option value="TASK_DELETE">Deletions (TASK_DELETE)</option>
              <option value="TASK_CREATE">Additions (TASK_CREATE)</option>
              <option value="LOGIN_2FA_SUCCESS">2FA Logins</option>
              <option value="PROFILE_PIC_UPDATE">Profile Pic Updates</option>
              <option value="LOGOUT">Logouts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading activity audit logs...</p>
        </div>
      ) : error ? (
        <div className="error-card">
          <h4>Failed to load logs</h4>
          <p>{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="empty-tasks-card">
          <h3>No Audit Logs Found</h3>
          <p>No activity records match your filter criteria.</p>
        </div>
      ) : (
        <div className="logs-table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User ID &amp; Name</th>
                <th>Action Type</th>
                <th>Activity Description / Details</th>
                <th>Target ID</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="log-time-cell">
                    {new Date(log.timestamp).toLocaleString('en-US', {
                      dateStyle: 'short',
                      timeStyle: 'medium'
                    })}
                  </td>
                  <td>
                    <div className="log-user-info">
                      <span className="log-username">{log.username || 'Guest User'}</span>
                      <span className="log-userid">ID: {log.userId}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`log-badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="log-details-cell">{log.details}</td>
                  <td className="log-target-cell">
                    {log.targetId ? <code>{log.targetId.slice(0, 16)}</code> : '-'}
                  </td>
                  <td className="log-ip-cell">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivityLogsPage;
