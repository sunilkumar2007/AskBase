import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
 { name: 'Jan', value: 4000 },
 { name: 'Feb', value: 3000 },
 { name: 'Mar', value: 5000 },
 { name: 'Apr', value: 4500 },
 { name: 'May', value: 6000 },
 { name: 'Jun', value: 5500 },
]

export default function ChartsPage() {
 return (
 <div>
 <h1 className="text-3xl font-bold text-gray-900 mb-6">Charts</h1>
 <div className="bg-white rounded-lg shadow p-6">
 <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
 <ResponsiveContainer width="100%" height={400}>
 <LineChart data={data}>
 <CartesianGrid strokeDasharray="3 3" />
 <XAxis dataKey="name" />
 <YAxis />
 <Tooltip />
 <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </div>
 )
}
