// Auth-related TypeScript types
// Designed for Express.js + Passport.js + JWT backend compatibility

export interface User {
  id: string;
  name: string;
  email: string;
  role: "employer" | "jobseeker" | "admin";
  avatar?: string;
  /** Company name — populated for employer accounts */
  company?: string;
  /** Company logo URL key — populated for employer accounts */
  companyLogo?: string;
  /** ISO date string */
  createdAt?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

/** Shape of the JWT payload returned from POST /api/auth/login */
export interface AuthLoginResponse {
  user: User;
  /** JWT access token */
  token: string;
  /** Token expiry in seconds */
  expiresIn: number;
}

export interface AuthError {
  message: string;
  field?: "email" | "password" | "general";
}

export type AuthModalTab = "signin" | "signup";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  // ── Modal controls ───────────────────────────────────────────
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  openAuthModal: (tab?: AuthModalTab) => void;
  closeAuthModal: () => void;
  // ── Auth actions ─────────────────────────────────────────────
  /** Throws AuthError on failure */
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}
