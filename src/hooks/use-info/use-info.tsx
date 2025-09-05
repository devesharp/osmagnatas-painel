import { User } from '@/types/user.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InfoState {
  info: User['INFO'] | null;
  setInfo: (info: User['INFO']) => void;
}

export const useInfo = create<InfoState>()(
  persist(
    (set) => ({
      info: null,
      setInfo: (info: User['INFO']) => set({ info }),
    }),
    {
      name: 'info-storage',
    }
  )
);
