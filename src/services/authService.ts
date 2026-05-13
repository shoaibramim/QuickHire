/**
 * Authentication Service
 * ──────────────────────────────────────────────────────────────
 * All auth API calls → Express.js + Passport.js backend:
 *   POST /api/auth/login   → Passport LocalStrategy → JWT
 *   POST /api/auth/logout  → Clear token
 *   GET  /api/auth/me      → Verify JWT → return User
 */

import { apiClient } from "@/services/apiClient";
import type {
  User,
  AuthLoginResponse,
  SignInCredentials,
  SignUpCredentials,
  RegisterResponse,
  VerifyEmailCredentials,
  VerifyEmailResponse,
  ResendVerificationResponse,
} from "@/types/auth";
const TOKEN_KEY = "qh_token";
const USER_KEY = "qh_user";

export function getDashboardPathForRole(role: User["role"] | null | undefined) {
  return role === "jobseeker" ? "/dashboard/seeker" : "/dashboard";
}

export const tokenStore = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_KEY, token);
    // Sync to a non-httpOnly cookie so Next.js middleware can detect auth state.
    // The cookie is JS-readable (same XSS scope as localStorage) — its sole purpose
    // is presence detection at the edge; the real token lives in localStorage.
    document.cookie = `qh_token=${token}; path=/; SameSite=Strict; max-age=900`;
  },
  clear: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Expire the cookie immediately
    document.cookie = "qh_token=; path=/; SameSite=Strict; max-age=0";
  },
};

export const userStore = {
  get: (): User | null => {
    if (typeof window === "undefined") return null;
    const raw =
      sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    try {
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
  set: (user: User) => {
    const payload = JSON.stringify(user);
    sessionStorage.setItem(USER_KEY, payload);
    localStorage.setItem(USER_KEY, payload);
  },
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

export async function register(
  credentials: SignUpCredentials,
): Promise<RegisterResponse> {
  return apiClient.post<RegisterResponse>(
    "/auth/register",
    credentials as unknown as Record<string, unknown>,
  );
}

export async function verifyEmail(
  credentials: VerifyEmailCredentials,
): Promise<User> {
  const data = await apiClient.post<VerifyEmailResponse>(
    "/auth/verify-email",
    credentials as unknown as Record<string, unknown>,
  );
  tokenStore.set(data.token);
  userStore.set(data.user);
  return data.user;
}

export async function resendVerification(
  email: string,
): Promise<ResendVerificationResponse> {
  return apiClient.post<ResendVerificationResponse>(
    "/auth/resend-verification",
    { email },
  );
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
