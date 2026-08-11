import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'status' | 'result';
  sql?: string;
  insight?: any;
  steps?: any[];
  data?: any[];
  timestamp: string;
  chips?: string[];
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  isFavorite: boolean;
  lastMessage: string;
}

interface ChatState {
  messages: ChatMessage[];
  history: ChatHistoryItem[];
  isProcessing: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  toggleFavorite: (id: string) => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  setProcessing: (processing: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: "Connected to Sales Production Engine. What metrics shall we explore?",
      type: 'text',
      timestamp: '09:42 AM'
    }
  ],
  history: [
    {
      id: 'chat-1',
      title: 'Q3 Revenue Analysis',
      date: 'Aug 10, 2026',
      isFavorite: true,
      lastMessage: 'Electronics segment revenue grew by 18% YoY...'
    },
    {
      id: 'chat-2',
      title: 'Customer Retention Trend',
      date: 'Aug 09, 2026',
      isFavorite: false,
      lastMessage: 'Average LTV increased across all segments.'
    }
  ],
  isProcessing: false,
  setProcessing: (isProcessing) => set({ isProcessing }),
  addMessage: (message) => set((state) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = { ...message, id: Date.now().toString(), timestamp };
    return { messages: [...state.messages, newMessage] };
  }),
  clearMessages: () => set({ messages: [] }),
  toggleFavorite: (id) => set((state) => ({
    history: state.history.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    )
  })),
  deleteChat: (id) => set((state) => ({
    history: state.history.filter(item => item.id !== id)
  })),
  renameChat: (id, title) => set((state) => ({
    history: state.history.map(item =>
      item.id === id ? { ...item, title } : item
    )
  }))
}));
