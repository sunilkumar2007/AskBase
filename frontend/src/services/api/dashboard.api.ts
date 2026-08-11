import { API_BASE_URL } from '@/config/api';

/**
 * Fetch analytics aggregates and KPI counters for the dashboard workspace.
 */
export async function getDashboardMetrics(projectId: string, token?: string) {
  const url = `${API_BASE_URL}/dashboards/?project_id=${projectId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard metrics');
  }

  return response.json();
}
