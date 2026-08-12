export interface ChatMessage {
 id: string
 role: 'user' | 'assistant'
 content: string
 metadata?: Record<string, any>
 timestamp: string
}
