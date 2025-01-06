import type { AuthState, User } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
    }));