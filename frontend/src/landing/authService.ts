import { useAuthStore } from './useAuthStore';

export const authService = {
  /**
   * Authenticate user with credentials or demo mode.
   */
  async login(email: string, name: string = 'User'): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    useAuthStore.getState().login(email, name);
  },

  /**
   * Demo session login helper.
   */
  async loginAsDemoUser(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    useAuthStore.getState().login('demo@askbase.local', 'Demo User', 'Administrator');
  },

  /**
   * Logout user.
   */
  logout(): void {
    useAuthStore.getState().logout();
  },

  /**
   * Check demo status.
   */
  isDemoMode(): boolean {
    const user = useAuthStore.getState().user;
    return user?.email === 'demo@askbase.local';
  }
};
