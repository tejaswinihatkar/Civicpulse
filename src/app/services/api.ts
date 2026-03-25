import { Issue, IssueCategory, IssueStatus, IssuePriority } from '../types';

const API_BASE = '/api';

export interface ComplaintResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  department: string;
  reportedById: string;
  reportedByName: string;
  reportedAt: string;
  updatedAt: string;
  upvotes: number;
  assignedToId?: string;
  assignedToName?: string;
  images?: string[];
  slaDeadline?: string;
  resolvedAt?: string;
  acknowledgedAt?: string;
  inProgressAt?: string;
  beforeImages?: string[];
  afterImages?: string[];
  workNotes?: string;
  sponsorName?: string;
  sponsorAmount?: number;
  anonymous?: boolean;
}

/**
 * Maps backend ComplaintResponse DTO → frontend Issue type.
 * The backend already sends status as lowercase hyphenated (e.g. "in-progress"),
 * so we only need to handle the case where it doesn't.
 */
export function mapComplaintToIssue(c: ComplaintResponse): Issue {
  // Normalise status: backend sends "submitted", "acknowledged", "in-progress", "resolved", "rejected"
  const rawStatus = (c.status || 'submitted').toLowerCase().replace('_', '-');
  const rawPriority = (c.priority || 'medium').toLowerCase();
  const rawCategory = (c.category || 'other').toLowerCase();

  return {
    id: String(c.id),
    title: c.title,
    description: c.description,
    category: rawCategory as IssueCategory,
    status: rawStatus as IssueStatus,
    priority: rawPriority as IssuePriority,
    location: {
      lat: c.latitude || 0,
      lng: c.longitude || 0,
      address: c.address || ''
    },
    images: c.images || [],
    reportedBy: c.reportedByName || (c.reportedById ? String(c.reportedById) : 'Anonymous'),
    reportedAt: new Date(c.reportedAt),
    updatedAt: new Date(c.updatedAt || c.reportedAt),
    upvotes: c.upvotes || 0,
    assignedTo: c.assignedToName || undefined,
    department: c.department,
    slaDeadline: c.slaDeadline ? new Date(c.slaDeadline) : undefined,
    resolvedAt: c.resolvedAt ? new Date(c.resolvedAt) : undefined,
    proofOfWork: c.resolvedAt ? {
      beforeImages: c.beforeImages || [],
      afterImages: c.afterImages || [],
      completedAt: new Date(c.resolvedAt),
      notes: c.workNotes || ''
    } : undefined,
    sponsored: c.sponsorName ? {
      sponsorId: 'ngo-sponsored',
      sponsorName: c.sponsorName,
      amount: c.sponsorAmount || 0
    } : undefined
  };
}

// ──────────────── Token management ────────────────
export function getToken(): string | null {
  return localStorage.getItem('civicpulse_token');
}

export function setToken(token: string) {
  localStorage.setItem('civicpulse_token', token);
}

export function removeToken() {
  localStorage.removeItem('civicpulse_token');
  localStorage.removeItem('civicpulse_user');
}

export function getStoredUser(): any | null {
  const raw = localStorage.getItem('civicpulse_user');
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: any) {
  localStorage.setItem('civicpulse_user', JSON.stringify(user));
}

// ──────────────── Fetch wrapper ────────────────
async function apiFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  } catch (networkError) {
    // Network error = server is down or unreachable
    throw new Error('Server is unreachable. Please make sure the backend is running on port 8080.');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || err.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

// ──────────────── Auth ────────────────
export async function register(data: {
  name: string; email: string; password: string; phone: string;
  role: string; department?: string; ward?: string;
}) {
  const result = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setToken(result.token);
  setStoredUser(result);
  return result;
}

export async function login(email: string, password: string) {
  const result = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(result.token);
  setStoredUser(result);
  return result;
}

export function logout() {
  removeToken();
  window.location.href = '/login';
}

// ──────────────── Complaints ────────────────
export async function submitComplaint(data: {
  title: string; description: string; category: string;
  latitude: number; longitude: number; address: string;
  images?: string[]; anonymous?: boolean;
}) {
  return apiFetch('/complaints', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getComplaints(params?: {
  status?: string; category?: string; department?: string; ward?: string;
}): Promise<Issue[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status.toUpperCase().replace('-', '_'));
  if (params?.category) query.append('category', params.category.toUpperCase());
  if (params?.department) query.append('department', params.department);
  if (params?.ward) query.append('ward', params.ward);
  const qs = query.toString();
  const results: ComplaintResponse[] = await apiFetch(`/complaints${qs ? '?' + qs : ''}`);
  return (results || []).map(mapComplaintToIssue);
}

export async function getComplaint(id: string): Promise<Issue> {
  const result: ComplaintResponse = await apiFetch(`/complaints/${id}`);
  return mapComplaintToIssue(result);
}

export async function getMyComplaints(): Promise<Issue[]> {
  const results: ComplaintResponse[] = await apiFetch('/complaints/my');
  return (results || []).map(mapComplaintToIssue);
}

export async function getWorkerTasks(): Promise<Issue[]> {
  const results: ComplaintResponse[] = await apiFetch('/complaints/worker/tasks');
  return (results || []).map(mapComplaintToIssue);
}

export async function acknowledgeComplaint(id: string) {
  return apiFetch(`/complaints/${id}/acknowledge`, { method: 'PATCH' });
}

export async function assignComplaint(id: string, workerId: string) {
  return apiFetch(`/complaints/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ workerId }),
  });
}

export async function startWork(id: string) {
  return apiFetch(`/complaints/${id}/start`, { method: 'PATCH' });
}

export async function resolveComplaint(id: string, data: {
  beforeImages?: string[]; afterImages?: string[]; workNotes?: string;
}) {
  return apiFetch(`/complaints/${id}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function rejectComplaint(id: string, reason: string) {
  return apiFetch(`/complaints/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

export async function upvoteComplaint(id: string) {
  return apiFetch(`/complaints/${id}/upvote`, { method: 'POST' });
}

// ──────────────── Notifications ────────────────
export async function getNotifications() {
  return apiFetch('/notifications');
}

export async function getUnreadCount(): Promise<number> {
  const result = await apiFetch('/notifications/unread/count');
  return typeof result === 'number' ? result : (result?.count || 0);
}

export async function markNotificationRead(id: string) {
  return apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
}

// ──────────────── Analytics ────────────────
export async function getDashboardStats() {
  return apiFetch('/analytics/dashboard');
}

// ──────────────── Users ────────────────
export async function getCurrentUser() {
  return apiFetch('/users/me');
}

export async function getWorkers(department?: string): Promise<any[]> {
  const query = department ? `?department=${encodeURIComponent(department)}` : '';
  return apiFetch(`/users/workers${query}`);
}

export async function getLeaderboard() {
  return apiFetch('/users/leaderboard');
}
