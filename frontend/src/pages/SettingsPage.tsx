import { User, Database, Bell, Shield, Palette } from 'lucide-react'

const settingsSections = [
 { icon: User, title: 'Profile', description: 'Manage your account information' },
 { icon: Database, title: 'Database Connections', description: 'Configure database connections' },
 { icon: Bell, title: 'Notifications', description: 'Set up alerts and notifications' },
 { icon: Shield, title: 'Security', description: 'Manage security settings' },
 { icon: Palette, title: 'Appearance', description: 'Customize the interface' },
]

export default function SettingsPage() {
 return (
 <div>
 <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
 <div className="space-y-4">
 {settingsSections.map((section) => {
 const Icon = section.icon
 return (
 <div key={section.title} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-blue-100 rounded-lg">
 <Icon className="text-blue-600" size={24} />
 </div>
 <div>
 <h3 className="font-semibold text-gray-900">{section.title}</h3>
 <p className="text-sm text-gray-600">{section.description}</p>
 </div>
 </div>
 </div>
 )
 })}
 </div>
 </div>
 )
}
