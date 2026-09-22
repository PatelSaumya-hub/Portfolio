// Centralized API Consumption Helper Module (Practical 6 Requirement)

const BASE_URL = '/api';

// Helper to construct request headers with user context
const getHeaders = (userContext = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (userContext.userId) headers['x-user-id'] = userContext.userId;
  if (userContext.username) headers['x-user-name'] = userContext.username;
  return headers;
};

// Generic response handler
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.details = data.details || [];
    throw error;
  }
  return data;
};

// --- Task API Endpoints ---

export const getTasks = async (priority = 'all', completed = 'all', search = '') => {
  let url = `${BASE_URL}/tasks?`;
  if (priority && priority !== 'all') url += `priority=${priority}&`;
  if (completed && completed !== 'all') url += `completed=${completed === 'completed'}&`;
  if (search) url += `search=${encodeURIComponent(search)}&`;

  const response = await fetch(url);
  return handleResponse(response);
};

export const getTaskById = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`);
  return handleResponse(response);
};

export const createTask = async (taskData, userContext = {}) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: getHeaders(userContext),
    body: JSON.stringify(taskData)
  });
  return handleResponse(response);
};

export const updateTask = async (id, updateData, userContext = {}) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(userContext),
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
};

export const deleteTask = async (id, userContext = {}) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(userContext)
  });
  return handleResponse(response);
};

export const addSubtask = async (taskId, subtaskData, userContext = {}) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}/subtasks`, {
    method: 'POST',
    headers: getHeaders(userContext),
    body: JSON.stringify(subtaskData)
  });
  return handleResponse(response);
};

export const updateSubtask = async (taskId, subtaskId, updateData, userContext = {}) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: 'PATCH',
    headers: getHeaders(userContext),
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
};

export const deleteSubtask = async (taskId, subtaskId, userContext = {}) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: 'DELETE',
    headers: getHeaders(userContext)
  });
  return handleResponse(response);
};

// --- Authentication & User API Endpoints ---

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
};

export const verify2FA = async (userId, code) => {
  const response = await fetch(`${BASE_URL}/auth/verify-2fa`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ userId, code })
  });
  return handleResponse(response);
};

export const logoutUser = async (userId, username) => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: getHeaders({ userId, username }),
    body: JSON.stringify({ userId, username })
  });
  return handleResponse(response);
};

export const updateProfilePic = async (userId, profilePic) => {
  const response = await fetch(`${BASE_URL}/auth/profile-pic`, {
    method: 'PUT',
    headers: getHeaders({ userId }),
    body: JSON.stringify({ userId, profilePic })
  });
  return handleResponse(response);
};

// --- Audit Logs & Excel Export Endpoints ---

export const getAuditLogs = async (action = 'all', search = '') => {
  let url = `${BASE_URL}/logs?`;
  if (action && action !== 'all') url += `action=${action}&`;
  if (search) url += `search=${encodeURIComponent(search)}&`;

  const response = await fetch(url);
  return handleResponse(response);
};

export const getExcelExportUrl = () => `${BASE_URL}/logs/export-excel`;
