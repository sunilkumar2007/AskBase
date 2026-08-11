import { Bell, Search, User } from 'lucide-react'

export default function Header() {
 return (
 <header className="bg-white border-b border-gray-200 px-6 py-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center flex-1">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
 <input
 type="text"
 placeholder="Search..."
 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
 />
 </div>
 </div>
 <div className="flex items-center gap-4">
 <button className="relative p-2 text-gray-600 hover:text-gray-900">
 <Bell size={20} />
 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
 </button>
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
 <User size={16} />
 </div>
 <span className="text-sm font-medium">User</span>
 </div>
 </div>
 </div>
 </header>
 )
}
