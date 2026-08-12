// Centralized API configurations for frontend integration

/**
 * The base URL for connecting to the backend FastAPI application.
 * Resolved from environment variables with a default fallback to proxying.
 */
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "/api";

/**
 * Client-facing headers helper
 */
export const getHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token ? { "Authorization": `Bearer ${token}` } : {}),
});
