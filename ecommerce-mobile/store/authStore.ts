import type { AuthState, User } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const queryClient = new QueryClient();

const initialState: Omit<AuthState, 'setUser' | 'setToken' | 'logout'> = {
  user: null,
  token: null,
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      logout: async () => {
        try {
          await queryClient.resetQueries();
          set(initialState);
          await AsyncStorage.clear();
        } catch (error) {
          console.error('Error during logout:', error);
          throw error;
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export { queryClient };

