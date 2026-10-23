import {
  User,
  Workspace,
  Submission,
  Finding,
  ReviewDecisionRequest,
  SourceDocument,
  BrandRule,
  AuditLog,
  DashboardStats
} from '../types';

const BASE_URL = '/api';

function getHeaders(isMultipart = false): HeadersInit {
  const token = localStorage.getItem('inkloom_token');
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
      else if (errJson.details) errorMsg = JSON.stringify(errJson.details);
    } catch {
      const text = await response.text();
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Authentication
export async function apiLogin(email: string, password: string): Promise<{ token: string; user: User; defaultWorkspace: Workspace }> {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegister(email: string, password: string, fullName: string, role = 'CREATOR'): Promise<string> {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, role }),
  });
}

export async function apiGetMe(): Promise<User> {
  return request('/auth/me', {
    headers: getHeaders(),
  });
}

// Workspaces
export async function apiGetWorkspaces(): Promise<Workspace[]> {
  return request('/workspaces', {
    headers: getHeaders(),
  });
}

// Submissions
export async function apiGetSubmissions(workspaceId: number): Promise<Submission[]> {
  return request(`/submissions?workspaceId=${workspaceId}`, {
    headers: getHeaders(),
  });
}

export async function apiGetSubmissionById(id: number): Promise<Submission> {
  return request(`/submissions/${id}`, {
    headers: getHeaders(),
  });
}

export async function apiCreateSubmissionText(workspaceId: number, title: string, rawContent: string): Promise<Submission> {
  return request('/submissions', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      workspaceId,
      title,
      contentType: 'TEXT_PASTE',
      rawContent,
    }),
  });
}

export async function apiCreateSubmissionPdf(workspaceId: number, title: string, file: File): Promise<Submission> {
  const formData = new FormData();
  formData.append('workspaceId', workspaceId.toString());
  formData.append('title', title);
  formData.append('file', file);

  return request('/submissions', {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
}

// Findings
export async function apiGetFindingsBySubmission(submissionId: number): Promise<Finding[]> {
  return request(`/submissions/${submissionId}/findings`, {
    headers: getHeaders(),
  });
}

export async function apiGetAllFindings(workspaceId: number): Promise<Finding[]> {
  return request(`/findings?workspaceId=${workspaceId}`, {
    headers: getHeaders(),
  });
}

export async function apiGetFindingById(id: number): Promise<Finding> {
  return request(`/findings/${id}`, {
    headers: getHeaders(),
  });
}

// Review Decision
export async function apiReviewFinding(findingId: number, decision: ReviewDecisionRequest): Promise<Finding> {
  return request(`/findings/${findingId}/review`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(decision),
  });
}

// Sources
export async function apiGetSources(workspaceId: number): Promise<SourceDocument[]> {
  return request(`/sources?workspaceId=${workspaceId}`, {
    headers: getHeaders(),
  });
}

export async function apiCreateSource(source: SourceDocument): Promise<SourceDocument> {
  return request('/sources', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(source),
  });
}

export async function apiUpdateSource(id: number, source: SourceDocument): Promise<SourceDocument> {
  return request(`/sources/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(source),
  });
}

export async function apiArchiveSource(id: number): Promise<void> {
  return request(`/sources/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
}

// Brand Rules
export async function apiGetRules(workspaceId: number): Promise<BrandRule[]> {
  return request(`/rules?workspaceId=${workspaceId}`, {
    headers: getHeaders(),
  });
}

export async function apiCreateRule(rule: BrandRule): Promise<BrandRule> {
  return request('/rules', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(rule),
  });
}

export async function apiUpdateRule(id: number, rule: BrandRule): Promise<BrandRule> {
  return request(`/rules/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(rule),
  });
}

export async function apiDeleteRule(id: number): Promise<void> {
  return request(`/rules/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
}

// Audit Logs
export async function apiGetAuditLogs(workspaceId: number): Promise<AuditLog[]> {
  return request(`/audit?workspaceId=${workspaceId}`, {
    headers: getHeaders(),
  });
}

// Dashboard
export async function apiGetDashboardStats(workspaceId: number): Promise<DashboardStats> {
  return request(`/dashboard/stats?workspaceId=${workspaceId}`, {
    headers: getHeaders(),
  });
}

// Health Check
export async function apiGetHealth(): Promise<{ status: string; system: string }> {
  return request('/health');
}
