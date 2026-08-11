import { useState } from 'react'

interface AuthState {
 user: { id: string; email: string; name: string } | null
 isAuthenticated: boolean
 login: (email: string, password: string) => Promise<void>
 logout: () => void
}

export default function useAuth(): AuthState {
 const [user, setUser] = useState<AuthState['user']>(null)

 const login = async (email: string, password: string) => {
 }

 const logout = () => {
 setUser(null)
 }

 return { user, isAuthenticated: !!user, login, logout }
}
