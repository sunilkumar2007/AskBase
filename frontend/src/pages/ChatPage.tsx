import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'

const mockMessages = [
 { role: 'assistant', content: 'Hello! I\'m AskBase, your data analytics assistant. How can I help you today?' },
 { role: 'user', content: 'Show me the top 10 customers by revenue' },
 { role: 'assistant', content: 'Here are the top 10 customers by revenue:\n\n| Customer | Revenue |\n|----------|--------|\n| Acme Corp | $1,234,500 |\n| Globex | $987,000 |\n| Initech | $876,000 |\n\nWould you like me to generate a chart for this data?' },
]

export default function ChatPage() {
 const [messages, setMessages] = useState(mockMessages)
 const [input, setInput] = useState('')

 const handleSend = () => {
 if (!input.trim()) return
 setMessages([...messages, { role: 'user', content: input }])
 setInput('')
 }

 return (
 <div className="h-full flex flex-col">
 <div className="flex-1 overflow-y-auto space-y-4 mb-4">
 {messages.map((message, i) => (
 <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
 <div className={`max-w-2xl rounded-lg p-4 ${
 message.role === 'user'
 ? 'bg-blue-600 text-white'
 : 'bg-white border border-gray-200 text-gray-900'
 }`}>
 {message.role === 'assistant' && (
 <div className="flex items-center gap-2 mb-2">
 <Sparkles size={16} className="text-blue-600" />
 <span className="text-sm font-semibold text-blue-600">AskBase</span>
 </div>
 )}
 <p className="whitespace-pre-wrap">{message.content}</p>
 </div>
 </div>
 ))}
 </div>
 <div className="flex gap-2">
 <input
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
 placeholder="Ask a question about your data..."
 className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
 />
 <button
 onClick={handleSend}
 className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
 >
 <Send size={20} />
 </button>
 </div>
 </div>
 )
}
