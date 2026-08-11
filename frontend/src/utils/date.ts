import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(date: Date | string): string {
 return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: Date | string): string {
 return format(new Date(date), 'MMM d, yyyy h:mm a')
}

export function formatTime(date: Date | string): string {
 return format(new Date(date), 'h:mm a')
}

export function formatRelativeTime(date: Date | string): string {
 return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getDateRange(days: number): { start: Date; end: Date } {
 const end = new Date()
 const start = new Date()
 start.setDate(start.getDate() - days)
 return { start, end }
}
