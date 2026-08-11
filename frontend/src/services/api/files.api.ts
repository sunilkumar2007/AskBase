import { API_BASE_URL } from '@/config/api';

/**
 * Upload a staged document, log file, or database export for analysis.
 */
export async function uploadFile(projectId: string, file: File, token?: string) {
  const url = `${API_BASE_URL}/files/upload?project_id=${projectId}`;
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}
