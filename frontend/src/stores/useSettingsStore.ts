import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  showReportPanel: boolean;
  toggleReportPanel: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  showSQL: boolean;
  setShowSQL: (show: boolean) => void;
  toggleSQL: () => void;
  autoVisualization: boolean;
  setAutoVisualization: (auto: boolean) => void;
  toggleAutoVisualize: () => void;
  voiceEnabled: boolean;
  toggleVoice: () => void;
  showAgentProgress: boolean;
  setShowAgentProgress: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  showReportPanel: false,
  toggleReportPanel: () => set((state) => ({ showReportPanel: !state.showReportPanel })),
  theme: 'light',
  setTheme: (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    }
    set({ theme });
  },
  showSQL: true,
  setShowSQL: (showSQL) => set({ showSQL }),
  toggleSQL: () => set((state) => ({ showSQL: !state.showSQL })),
  autoVisualization: true,
  setAutoVisualization: (autoVisualization) => set({ autoVisualization }),
  toggleAutoVisualize: () => set((state) => ({ autoVisualization: !state.autoVisualization })),
  voiceEnabled: true,
  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
  showAgentProgress: true,
  setShowAgentProgress: (showAgentProgress) => set({ showAgentProgress }),
}));
