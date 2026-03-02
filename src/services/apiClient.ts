/**
 * API Client
 * ──────────────────────────────────────────────────────────────
 * Thin wrapper around `fetch` for JSON API calls.
 *
 * TODO (backend integration):
 *  - Set API_BASE_URL in .env.local as NEXT_PUBLIC_API_URL
 *  - The backend (Express.js) should set httpOnly cookies for the JWT.
 *    If using httpOnly cookies, remove the Authorization header injection
 *    and add `credentials: "include"` instead.
 *  - On 401 responses, auto-refresh the token or redirect to re-auth.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown> | FormData;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  { body, headers, ...options }: RequestOptions = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("qh_token") : null;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: requestHeaders,
    body: body instanceof FormData ? body : JSON.stringify(body),
    credentials: "include", // needed for cross-origin requests to Express (localhost:5000)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      (errorData as { message?: string }).message ?? res.statusText,
      errorData
    );
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions) =>
    request<T>(endpoint, { method: "POST", body, ...options }),

  put: <T>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PUT", body, ...options }),

  patch: <T>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PATCH", body, ...options }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};
