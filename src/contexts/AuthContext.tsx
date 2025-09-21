import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Plan = "starter" | "pro";
export interface AuthUser {
  name: string;
  email: string;
  plan: Plan;
  paid: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: Omit<AuthUser, "paid"> & { paid?: boolean }) => void;
  logout: () => void;
  setPlan: (plan: Plan, paid?: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_KEY = "mm_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(LS_KEY, JSON.stringify(user));
    else localStorage.removeItem(LS_KEY);
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login: (u) => setUser({ ...u, paid: u.paid ?? (u.plan === "pro" ? false : true) }),
    logout: () => setUser(null),
    setPlan: (plan, paid = false) => setUser((prev) => (prev ? { ...prev, plan, paid } : prev)),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
