import type { AuthState } from '@/types/types';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
const initialState = {
  user: null,
  token: null,
  isHydrated: false,
};

const secureStorage = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => {
        try {
          useAuth.persist.clearStorage();
          set(initialState);
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },
      setIsHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    }
  )
);