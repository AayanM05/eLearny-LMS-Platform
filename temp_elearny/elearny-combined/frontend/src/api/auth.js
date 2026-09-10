import api from "./client";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  complete2fa: (payload) => api.post("/auth/2fa/challenge", payload),
  setup2fa: () => api.post("/auth/2fa/setup"),
  activate2fa: (code) => api.post("/auth/2fa/activate", { code }),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  logoutAll: () => api.post("/auth/logout-all"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
};
