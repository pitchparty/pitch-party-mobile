// features/auth/store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { signOut } from "./api";
import { UserProfile } from "./types";

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  loggedIn: (user: UserProfile) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      loading: false,
      loggedIn: async (user: UserProfile) => {
        set({ user });
      },
      logout: async () => {
        await signOut();
        set({ user: null, loading: false });
      },
    }),
    { name: "__auth__", storage: createJSONStorage(() => AsyncStorage) }
  )
);

