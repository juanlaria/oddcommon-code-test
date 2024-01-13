import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useVotesStore = create(
  persist(
    (set, get) => ({
      votes: {},
      setVote: data =>
        set(state => {
          state.votes[data.key] = data.vote;
          return state;
        }),
    }),
    {
      name: 'odd-challenge-votes-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
