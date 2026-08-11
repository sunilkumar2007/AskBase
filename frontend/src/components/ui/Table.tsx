interface Column<T> {
 header: string
 accessorKey: keyof T
 cell?: (info: { getValue: () => any }) => React.ReactNode
}

interface TableProps<T> {
 columns: Column<T>[]
 data: T[]
}

export default function Table<T>({ columns, data }: TableProps<T>) {
 return (
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="border-b border-gray-200">
 {columns.map((col) => (
 <th key={String(col.accessorKey)} className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
 {col.header}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {data.map((row, i) => (
 <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
 {columns.map((col) => (
 <td key={String(col.accessorKey)} className="py-3 px-4 text-sm text-gray-700">
 {col.cell ? col.cell({ getValue: () => row[col.accessorKey] }) : String(row[col.accessorKey] ?? '')}
 </td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )
}
