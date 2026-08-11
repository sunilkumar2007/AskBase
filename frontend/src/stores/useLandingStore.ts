import { create } from 'zustand';

export type ScrollStage =
  | 'hero'
  | 'ask'
  | 'understanding'
  | 'features'
  | 'about';

interface LandingStore {
  scrollProgress: number; // 0 to 1
  activeStage: ScrollStage;
  setScrollProgress: (progress: number) => void;
  setActiveStage: (stage: ScrollStage) => void;
}

const STAGES: { stage: ScrollStage; start: number; end: number }[] = [
  { stage: 'hero', start: 0, end: 0.15 },
  { stage: 'ask', start: 0.15, end: 0.4 },
  { stage: 'understanding', start: 0.4, end: 0.65 },
  { stage: 'features', start: 0.65, end: 0.85 },
  { stage: 'about', start: 0.85, end: 1 },
];

export const useLandingStore = create<LandingStore>((set) => ({
  scrollProgress: 0,
  activeStage: 'hero',
  setScrollProgress: (progress) => {
    const stage = STAGES.find(s => progress >= s.start && progress <= s.end)?.stage || 'hero';
    set({ scrollProgress: progress, activeStage: stage });
  },
  setActiveStage: (stage) => set({ activeStage: stage }),
}));
