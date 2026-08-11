import { API_BASE_URL } from '@/config/api';

/**
 * Fetch all reports saved under a specific project.
 */
export async function listReports(projectId: string, token?: string) {
  const url = `${API_BASE_URL}/reports/?project_id=${projectId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }

  return response.json();
}

/**
 * Save a newly constructed report layout.
 */
export async function saveReport(projectId: string, reportData: any, token?: string) {
  const url = `${API_BASE_URL}/reports/?project_id=${projectId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(reportData),
  });

  if (!response.ok) {
    throw new Error('Failed to save report');
  }

  return response.json();
}
