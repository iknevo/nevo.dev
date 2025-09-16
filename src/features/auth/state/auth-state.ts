import { create } from "zustand";

type User = {
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isInitializing: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
};

export const useAuthState = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isInitializing: false,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setToken: (token: string | null) => set({ accessToken: token }),
  clearAuth: () => set({ user: null, accessToken: null }),
  initializeAuth: async () => {
    set({ isInitializing: true });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        set({
          accessToken: data.accessToken,
          user: data.user,
        });
      } else {
        set({ user: null, accessToken: null, isInitializing: false });
      }
    } catch {
      set({ user: null, accessToken: null, isInitializing: false });
    }
  },
}));
