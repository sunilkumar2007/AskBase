import { useState } from 'react'
import { Lock, User } from 'lucide-react'

export default function LoginPage() {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault()
 }

 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50">
 <div className="max-w-md w-full space-y-8">
 <div className="text-center">
 <h1 className="text-4xl font-bold text-gray-900">AskBase</h1>
 <p className="mt-2 text-gray-600">Sign in to your account</p>
 </div>
 <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700">Email</label>
 <div className="mt-1 relative">
 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
 placeholder="you@example.com"
 />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700">Password</label>
 <div className="mt-1 relative">
 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
 placeholder="••••••••"
 />
 </div>
 </div>
 </div>
 <button
 type="submit"
 className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
 >
 Sign in
 </button>
 </form>
 </div>
 </div>
 )
}
