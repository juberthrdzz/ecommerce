export type User = { id: string; email: string };

const STORAGE_KEY = "fake_user";

export const FakeAuth = {
  signIn(email: string): User {
    const user = { id: "local", email };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  },
  signOut(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
};

/*
// TODO: NextAuth integration example (not implemented here)
// import NextAuth from "next-auth";
// providers: [GoogleProvider({ clientId, clientSecret }), AppleProvider({ ... })]
// callbacks: { session, jwt }
// Replace FakeAuth with NextAuth session hooks in stores/pages.
*/


