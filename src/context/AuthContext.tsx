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
 * TODO (backend integration):
 *  - On signIn success the backend (Express + Passport) issues a JWT.
 *  - Production recommendation: use httpOnly cookies (set by the backend)
 *    instead of localStorage to mitigate XSS. When using httpOnly cookies,
 *    remove the tokenStore calls here; the browser sends the cookie automatically.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { login, logout, getMe } from "@/services/authService";
import type {
  AuthContextType,
  AuthModalTab,
  SignInCredentials,
  User,
} from "@/types/auth";

// ── Context ───────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>("signin");

  // Restore session on mount
  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((u) => { if (!cancelled) setUser(u); })
      .catch(() => { if (!cancelled) setUser(null); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ── Modal helpers ─────────────────────────────────────────

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

  // ── Auth actions ──────────────────────────────────────────

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    const u = await login(credentials); // throws ApiError on failure
    setUser(u);
    closeAuthModal();
  }, [closeAuthModal]);

  const signOut = useCallback(async () => {
    await logout();
    setUser(null);
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
    }),
    [user, isLoading, isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Internal hook (use `useAuth` from hooks/useAuth.ts in components) ──

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }
  return ctx;
}
