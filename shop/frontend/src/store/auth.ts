import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin } from '../api/client';

interface AuthState {
  token: string | null;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (email: string, password: string) => {
        try {
          const response = await apiLogin({ username: email, password });
          const token = response.data.access_token;
          localStorage.setItem('token', token);
          set({ token, user: { email } });
        } catch (error) {
          throw new Error('Login failed');
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);