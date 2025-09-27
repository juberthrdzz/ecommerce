import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FakeAuth, type User } from "@/lib/auth";

type AuthState = {
  user: User | null;
  signIn: (email: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (email) => set({ user: FakeAuth.signIn(email) }),
      signOut: () => {
        FakeAuth.signOut();
        set({ user: null });
      },
    }),
    { name: "auth_store" }
  )
);


