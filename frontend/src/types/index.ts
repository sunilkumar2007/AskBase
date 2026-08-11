export type Role = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  type?: 'text' | 'status' | 'result' | 'error';
  sql?: string;
  insight?: string;
  steps?: { name: string; status: 'complete' | 'processing' | 'pending' | 'error' }[];
  data?: any[];
  chartConfig?: any;
  diagram?: string;
}

export interface Chat {
  id: string;
  title: string;
  timestamp: number;
  isFavorite: boolean;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  isFavorite: boolean;
}
