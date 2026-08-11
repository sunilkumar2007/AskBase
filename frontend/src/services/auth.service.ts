import { useAuthStore } from '@/stores/useAuthStore';

/**
 * A reusable authentication adapter to isolate UI from implementation details.
 * This currently implements a DEVELOPMENT-ONLY "Demo Mode" flow.
 */
export const authService = {
  /**
   * Immediately creates a temporary frontend-only demo session.
   * [DEVELOPMENT ONLY] - This will eventually be replaced by backend JWT session auth.
   */
  async loginAsDemoUser(): Promise<void> {
    // Simulate a short, smooth authentication transition
    await new Promise((resolve) => setTimeout(resolve, 800));

    const demoUser = {
      name: "AskBase User",
      email: "demo@askbase.local",
      role: "Demo"
    };

    // useAuthStore is persisted locally by default in this template
    const login = useAuthStore.getState().login;
    login(demoUser.email, demoUser.name);

    console.log("[AuthService] Demo session created:", demoUser);
  },

  /**
   * Logs out the current user.
   */
  logout(): void {
    useAuthStore.getState().logout();
  },

  /**
   * Checks if the current user is in demo mode.
   */
  isDemoMode(): boolean {
    const user = useAuthStore.getState().user;
    return user?.email === "demo@askbase.local";
  }
};
