import { useState } from 'react'

interface AuthState {
  user: { id: string; email: string; name: string } | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export default function useAuth(): AuthState {
  const [user, setUser] = useState<AuthState['user']>({
    id: 'user-1',
    email: 'admin@askbase.ai',
    name: 'AskBase Admin',
  })

  const login = async (email: string, _password: string) => {
    setUser({ id: 'user-1', email, name: email.split('@')[0] })
  }

  const logout = () => {
    setUser(null)
  }

  return { user, isAuthenticated: !!user, login, logout }
}
