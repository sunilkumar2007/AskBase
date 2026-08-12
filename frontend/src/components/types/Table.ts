import { JSX } from 'react'

export interface TableProps<T> {
 data: T[]
 columns: {
 header: string
 accessorKey: keyof T
 cell?: (row: T) => JSX.Element
 }[]
}
