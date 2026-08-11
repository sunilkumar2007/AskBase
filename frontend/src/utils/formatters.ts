export function formatNumber(num: number): string {
 return new Intl.NumberFormat('en-US').format(num)
}

export function formatCurrency(amount: number): string {
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency: 'USD',
 }).format(amount)
}

export function formatDate(date: string | Date): string {
 return new Intl.DateTimeFormat('en-US').format(new Date(date))
}
