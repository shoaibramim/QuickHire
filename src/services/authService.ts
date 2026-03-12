/**
 * Authentication Service
 * ──────────────────────────────────────────────────────────────
 * All auth API calls → Express.js + Passport.js backend:
 *   POST /api/auth/login   → Passport LocalStrategy → JWT
 *   POST /api/auth/logout  → Clear token
 *   GET  /api/auth/me      → Verify JWT → return User
 */

import { apiClient } from "@/services/apiClient";
import type { User, AuthLoginResponse, SignInCredentials } from "@/types/auth";
const TOKEN_KEY = "qh_token";
const USER_KEY = "qh_user";

export const tokenStore = {
  get: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  set: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    // Sync to a non-httpOnly cookie so Next.js middleware can detect auth state.
    // The cookie is JS-readable (same XSS scope as localStorage) — its sole purpose
    // is presence detection at the edge; the real token lives in localStorage.
    document.cookie = `qh_token=${token}; path=/; SameSite=Strict; max-age=900`;
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Expire the cookie immediately
    document.cookie = "qh_token=; path=/; SameSite=Strict; max-age=0";
  },
};

export const userStore = {
  get: (): User | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
  set: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

/**
 * POST /api/auth/login
 * Sends credentials to Express → Passport LocalStrategy.
 * Stores the returned JWT + user in localStorage.
 */
export async function login(credentials: SignInCredentials): Promise<User> {
  const data = await apiClient.post<AuthLoginResponse>(
    "/auth/login",
    credentials as unknown as Record<string, unknown>,
  );
  tokenStore.set(data.token);
  userStore.set(data.user);
  return data.user;
}

/**
 * POST /api/auth/logout
 * Notifies backend (stateless JWT — server-side audit log) then clears client state.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    tokenStore.clear();
  }
}

/**
 * GET /api/auth/me
 * Validates stored JWT against the backend and returns the current user.
 * Returns null if no token or token is invalid/expired.
 *
 * NOTE: Always calls the backend — never short-circuits on cached user.
 * A cached user in localStorage alone is not proof the token is still valid.
 */
export async function getMe(): Promise<User | null> {
  const token = tokenStore.get();
  if (!token) return null;

  // Check token expiry client-side before hitting the network.
  // JWT payload.exp is in seconds; Date.now() is in ms.
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
      tokenStore.clear();
      return null;
    }
  } catch {
    tokenStore.clear();
    return null;
  }

  try {
    const user = await apiClient.get<User>("/auth/me");
    userStore.set(user);
    return user;
  } catch {
    tokenStore.clear();
    return null;
  }
}
