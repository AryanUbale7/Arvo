import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setTokens: (token, refreshToken) => 
        set({ token, refreshToken, isAuthenticated: true }),
        
      setUser: (user) => set({ user }),
      
      login: (user, token, refreshToken) => 
        set({ user, token, refreshToken, isAuthenticated: true }),
        
      logout: () => 
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false }),
        
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'arvo-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
export default useAuthStore;
