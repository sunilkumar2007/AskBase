import { API_BASE_URL } from '@/config/api';

export interface CreateProjectPayload {
  name: string;
  description?: string;
  database_url?: string;
}

/**
 * List all projects for the authenticated user.
 */
export async function listProjects(token?: string) {
  const url = `${API_BASE_URL}/projects/`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to list projects');
  }

  return response.json();
}

/**
 * Create a new workspace project.
 */
export async function createProject(payload: CreateProjectPayload, token?: string) {
  const url = `${API_BASE_URL}/projects/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create project');
  }

  return response.json();
}

/**
 * Get details for a single project.
 */
export async function getProject(projectId: string, token?: string) {
  const url = `${API_BASE_URL}/projects/${projectId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get project');
  }

  return response.json();
}

/**
 * Update project details (name, description, database_url).
 */
export async function updateProject(projectId: string, payload: Partial<CreateProjectPayload>, token?: string) {
  const url = `${API_BASE_URL}/projects/${projectId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update project');
  }

  return response.json();
}

/**
 * Delete a project workspace.
 */
export async function deleteProject(projectId: string, token?: string) {
  const url = `${API_BASE_URL}/projects/${projectId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete project');
  }

  return response.json();
}

/**
 * Test the database connection string.
 */
export async function testConnection(projectId: string, databaseUrl?: string, token?: string) {
  const url = `${API_BASE_URL}/projects/${projectId}/test-connection`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ database_url: databaseUrl }),
  });

  if (!response.ok) {
    throw new Error('Failed to test connection');
  }

  return response.json();
}
