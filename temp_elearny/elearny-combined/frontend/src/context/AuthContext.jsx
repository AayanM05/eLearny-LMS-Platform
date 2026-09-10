import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("elearny_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistSession = useCallback((data) => {
    if (data.accessToken) localStorage.setItem("elearny_access_token", data.accessToken);
    if (data.refreshToken) localStorage.setItem("elearny_refresh_token", data.refreshToken);
    if (data.user) {
      localStorage.setItem("elearny_user", JSON.stringify(data.user));
      setUser(data.user);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const { data } = await authApi.login({ email, password });
        // Both OK and 2FA_SETUP_REQUIRED come back with real tokens now (see AuthService.login) —
        // 2FA_SETUP_REQUIRED still needs an authenticated session to call /2fa/setup + /2fa/activate.
        if (data.status === "OK" || data.status === "2FA_SETUP_REQUIRED") {
          persistSession(data);
        }
        return data; // caller inspects status: OK | 2FA_REQUIRED | 2FA_SETUP_REQUIRED
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const complete2fa = useCallback(
    async (challengeToken, code) => {
      const { data } = await authApi.complete2fa({ challengeToken, code });
      if (data.status === "OK") persistSession(data);
      return data;
    },
    [persistSession]
  );

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("elearny_access_token");
    localStorage.removeItem("elearny_refresh_token");
    localStorage.removeItem("elearny_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, complete2fa, register, logout, persistSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
