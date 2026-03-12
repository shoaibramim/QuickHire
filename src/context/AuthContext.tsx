"use client";

/**
 * AuthContext
 * ──────────────────────────────────────────────────────────────
 * Central auth state for the entire app.
 *
 * Provides:
 *  - user / isLoading
 *  - Modal controls (isAuthModalOpen, authModalTab, open/close)
 *  - signIn / signOut actions
 *
 *  - On signIn success the backend (Express + Passport) issues a JWT
 * */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { login, logout, getMe, tokenStore } from "@/services/authService";
import type {
  AuthContextType,
  AuthModalTab,
  SignInCredentials,
  User,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>("signin");

  // Restore session on mount
  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openAuthModal = useCallback((tab: AuthModalTab = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    document.body.style.overflow = "";
  }, []);

  const signIn = useCallback(
    async (credentials: SignInCredentials) => {
      const u = await login(credentials); // throws ApiError on failure
      setUser(u);
      closeAuthModal();
    },
    [closeAuthModal],
  );

  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Token already expired or server unreachable — clear local state regardless.
      tokenStore.clear();
    } finally {
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((patch: Partial<typeof user>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      signIn,
      signOut,
      updateUser,
    }),
    [
      user,
      isLoading,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      signIn,
      signOut,
      updateUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }
  return ctx;
}
