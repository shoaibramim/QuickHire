/**
 * Authentication Service
 * ──────────────────────────────────────────────────────────────
 * Handles all auth-related API calls.
 *
 * TODO (backend integration):
 *  - All endpoints map to Express.js + Passport.js routes:
 *    POST /api/auth/login    → Passport LocalStrategy → JWT issue
 *    POST /api/auth/logout   → Invalidate refresh token / clear httpOnly cookie
 *    GET  /api/auth/me       → Verify JWT → return User
 *  - Replace MOCK_USERS with real API calls once backend is running.
 */

import { apiClient, ApiError } from "@/services/apiClient";
import type { User, AuthLoginResponse, SignInCredentials } from "@/types/auth";

// ── Token helpers ─────────────────────────────────────────────
const TOKEN_KEY = "qh_token";
const USER_KEY = "qh_user";

export const tokenStore = {
  get: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const userStore = {
  get: (): User | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? (JSON.parse(raw) as User) : null; } catch { return null; }
  },
  set: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

// ── DEV Credentials ──────────────────────────────────────────
// TODO: Remove once real backend is live. These are seeded in the dev DB.
const MOCK_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: "admin@quickhire.com",
    password: "quickhire2024",
    user: {
      id: "usr_001",
      name: "Maria Silva",
      email: "admin@quickhire.com",
      role: "employer",
      company: "Nomad",
      companyLogo: "nomad",
      avatar: undefined,
    },
  },
];

// ── Service methods ───────────────────────────────────────────

/**
 * POST /api/auth/login
 * Attempts login and stores the returned JWT + user in localStorage.
 */
export async function login(credentials: SignInCredentials): Promise<User> {
  // TODO: replace with real API call ↓
  // const data = await apiClient.post<AuthLoginResponse>("/auth/login", credentials);

  // MOCK implementation:
  await new Promise((r) => setTimeout(r, 600)); // simulate network
  const match = MOCK_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );
  if (!match) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const data: AuthLoginResponse = {
    user: match.user,
    token: `mock_jwt_${match.user.id}_${Date.now()}`,
    expiresIn: 3600,
  };

  tokenStore.set(data.token);
  userStore.set(data.user);
  return data.user;
}

/**
 * POST /api/auth/logout
 * Clears local auth state and notifies the backend.
 */
export async function logout(): Promise<void> {
  try {
    // TODO: Uncomment once backend is ready
    // await apiClient.post("/auth/logout");
  } finally {
    tokenStore.clear();
  }
}

/**
 * GET /api/auth/me
 * Validates the stored token and returns the current user.
 * Returns null if no token or token is invalid.
 */
export async function getMe(): Promise<User | null> {
  const token = tokenStore.get();
  if (!token) return null;

  // Try restoring from localStorage first (avoids an extra network request on load)
  const cached = userStore.get();
  if (cached) return cached;

  try {
    // TODO: Uncomment once backend is ready
    // const user = await apiClient.get<User>("/auth/me");
    // userStore.set(user);
    // return user;
    return null;
  } catch {
    tokenStore.clear();
    return null;
  }
}
