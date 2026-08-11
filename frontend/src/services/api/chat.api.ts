import { API_BASE_URL } from '@/config/api';

export interface SendMessagePayload {
  message: string;
}

/**
 * Send a chat message to the backend Gemini agent for a specific project.
 */
export async function sendChatMessage(projectId: string, message: string, token?: string) {
  const url = `${API_BASE_URL}/chat/message?project_id=${projectId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to send chat message');
  }

  return response.json();
}

/**
 * Fetch the conversation history of a project from the backend database.
 */
export async function getChatHistory(projectId: string, token?: string) {
  const url = `${API_BASE_URL}/chat/history/${projectId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }

  return response.json();
}
