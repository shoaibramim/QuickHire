// Auth-related TypeScript types
// Designed for Express.js + Passport.js + JWT backend compatibility

export interface User {
  id: string;
  name: string;
  email: string;
  role: "employer" | "jobseeker" | "admin";
  emailVerifiedAt?: string | null;
  avatar?: string;
  /** Company name — populated for employer accounts */
  company?: string;
  /** Company logo URL / base64 — populated for employer accounts */
  companyLogo?: string;
  // Extended employer profile
  industry?: string;
  website?: string;
  location?: string;
  companySize?: string;
  about?: string;
  phone?: string;
  resumeLink?: string;
  coverLetterTemplate?: string;
  /** ISO date string */
  createdAt?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  role: "employer" | "jobseeker";
}

export interface VerifyEmailCredentials {
  email: string;
  token?: string;
  otp?: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  role: "employer" | "jobseeker";
  verificationRequired: true;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
  token: string;
  expiresIn: number;
}

export interface ResendVerificationResponse {
  message: string;
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
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  openAuthModal: (tab?: AuthModalTab) => void;
  closeAuthModal: () => void;
  /** Replace the current user in context after OTP/link verification. */
  setAuthenticatedUser: (user: User | null) => void;
  /** Throws AuthError on failure and returns the authenticated user on success. */
  signIn: (credentials: SignInCredentials) => Promise<User>;
  signOut: () => Promise<void>;
  /** Merge partial user fields into the in-memory user (e.g. after profile save) */
  updateUser: (patch: Partial<User>) => void;
}
