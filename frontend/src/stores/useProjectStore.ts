import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  description: string;
  chatsCount: number;
  sourcesCount: number;
  isFavorite: boolean;
  updatedAt: string;
  members?: { id: string, name: string, role: string }[];
  sources?: { id: string, name: string, type: string, status: string }[];
}

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  toggleFavorite: (id: string) => void;
  deleteProject: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'updatedAt'>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [
    {
      id: '1',
      name: 'Q4 Sales Analysis',
      description: 'Enterprise sales data pipeline and revenue forecasting for the upcoming fiscal year.',
      chatsCount: 12,
      sourcesCount: 3,
      isFavorite: true,
      updatedAt: '2h ago'
    },
    {
      id: '2',
      name: 'Customer Retention',
      description: 'Churn prediction, cohort analysis, and LTV optimization across all user segments.',
      chatsCount: 8,
      sourcesCount: 2,
      isFavorite: false,
      updatedAt: '1d ago'
    },
    {
      id: '3',
      name: 'Marketing ROI',
      description: 'Attribution modeling and campaign performance tracking for multi-channel growth.',
      chatsCount: 5,
      sourcesCount: 4,
      isFavorite: false,
      updatedAt: '3d ago'
    },
  ],
  activeProject: null,
  setProjects: (projects) => set({ projects }),
  setActiveProject: (activeProject) => set({ activeProject }),
  toggleFavorite: (id) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),
  addProject: (project) => set((state) => ({
    projects: [...state.projects, {
      ...project,
      id: Math.random().toString(36).substring(2, 11),
      updatedAt: 'Just now'
    }]
  }))
}));
