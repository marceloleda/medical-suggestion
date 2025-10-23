import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true, // Inicialmente true até hidratar do localStorage
      _hasHydrated: false,
      setAuth: (user) => {
        set({ user, isAuthenticated: true, loading: false });
      },
      clearAuth: () => {
        set({ user: null, isAuthenticated: false, loading: false });
      },
      setLoading: (loading) => set({ loading }),
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Quando terminar de hidratar, marca como pronto e remove loading
        state?.setHasHydrated(true);
        state?.setLoading(false);
      },
    }
  )
);
