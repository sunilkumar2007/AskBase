import { useState } from 'react'
import { ChatMessage } from '../types'

export type { ChatMessage }

export interface ConversationThread {
  id: string
  title: string
  date: string
  isPinned?: boolean
  messages: ChatMessage[]
}

const getFormattedNow = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const INITIAL_CONVERSATIONS: ConversationThread[] = [
  {
    id: 'conv-1',
    title: 'Company Data RAG Analysis',
    date: 'Today, 10:41 PM',
    isPinned: true,
    messages: [
      {
        role: 'assistant',
        content: `Hello! I am your AskBase RAG AI Assistant for Acme Global Enterprises. All responses are strictly grounded in your company's database and uploaded RAG files.`,
        timestamp: '10:40 PM'
      },
      {
        role: 'user',
        content: 'Show me total sales statistics by product',
        timestamp: '10:41 PM'
      },
      {
        role: 'assistant',
        content: 'Here are the RAG-grounded sales statistics for Acme Global Enterprises based on your uploaded company files and SQLite database.',
        timestamp: '10:41 PM',
        data: {
          columns: ['product', 'total_sales_inr', 'revenue_inr', 'orders'],
          rows: [['Widgets', '₹1,45,000', '₹2,90,000', 420], ['Gadgets', '₹2,89,000', '₹5,78,000', 890], ['Services', '₹3,12,000', '₹6,24,000', 310], ['Components', '₹98,000', '₹1,96,000', 210]],
          row_count: 4
        },
        chart: {
          type: 'bar',
          title: 'Sales & Revenue Statistics by Product (₹)',
          x_data: ['Widgets', 'Gadgets', 'Services', 'Components'],
          series: [{ name: 'sales', data: [145000, 289000, 312000, 98000] }]
        },
        elapsed_ms: 180
      }
    ]
  }
]

export function useChatStore() {
  const [threads, setThreadsState] = useState<ConversationThread[]>(() => {
    const saved = localStorage.getItem('askbase_chat_threads')
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS
  })

  const [activeThreadId, setActiveThreadIdState] = useState<string>(() => {
    const savedId = localStorage.getItem('askbase_active_thread_id')
    return savedId || 'conv-1'
  })

  const updateThreads = (newThreads: ConversationThread[]) => {
    setThreadsState(newThreads)
    localStorage.setItem('askbase_chat_threads', JSON.stringify(newThreads))
  }

  const updateActiveThreadId = (id: string) => {
    setActiveThreadIdState(id)
    localStorage.setItem('askbase_active_thread_id', id)
  }

  return {
    threads,
    activeThreadId,
    setThreads: updateThreads,
    setActiveThreadId: updateActiveThreadId,
    getFormattedNow
  }
}
