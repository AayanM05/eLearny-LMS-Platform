// Simple localStorage-based token storage. No broader state management
// exists yet in this project — this is the minimum needed to make
// authenticated requests work, not a long-term auth architecture. Revisit
// if/when the app grows enough to need proper session state (e.g. a React
// context, or a real auth library) rather than direct localStorage reads.

const ACCESS_TOKEN_KEY = "elearny_access_token";
const REFRESH_TOKEN_KEY = "elearny_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return getAccessToken() !== null;
}
