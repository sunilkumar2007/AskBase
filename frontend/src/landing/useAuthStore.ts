import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  avatar: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name: string, role?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, name, role = 'User') =>
        set({
          isAuthenticated: true,
          user: {
            name,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
            role,
          },
        }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'ddiff-auth-storage' }
  )
);
