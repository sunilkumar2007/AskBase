export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
 const token = localStorage.getItem('token')
 return fetch(url, {
 ...options,
 headers: {
 'Content-Type': 'application/json',
 ...(token ? { Authorization: `Bearer ${token}` } : {}),
 ...options.headers,
 },
 })
}
