import { create } from 'zustand';

export const useGeneralStore = create(set => ({
  activeVideo: null,
  setActiveVideo: activeVideo => set({ activeVideo }),
  animationLifecycle: 'CLOSED',
  setAnimationLifecycle: animationLifecycle => set({ animationLifecycle }),
  loadingData: true,
  setLoadingData: loadingData => set({ loadingData }),
}));
