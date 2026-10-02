import axios from "axios";

/**
 * Central Axios instance. Base URL is relative ("/api") by design: in dev, Vite's proxy
 * (vite.config.js) transparently forwards anything starting with /api to the Spring Boot
 * server at localhost:8080, so the browser only ever talks to localhost:5173 and there's no
 * cross-origin request involved for normal API calls. In production (a built bundle served
 * from somewhere), "/api" simply resolves against whatever origin is serving the app.
 * Override with VITE_API_BASE_URL only if you need to point at a different backend entirely
 * (e.g. hitting a deployed API from a separate frontend deployment).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("elearny_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("elearny_refresh_token");
      if (!refreshToken) {
        clearSession();
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject, original });
        });
      }
      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );
        localStorage.setItem("elearny_access_token", data.accessToken);
        localStorage.setItem("elearny_refresh_token", data.refreshToken);
        queue.forEach(({ resolve, original: o }) => {
          o.headers.Authorization = `Bearer ${data.accessToken}`;
          resolve(api(o));
        });
        queue = [];
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshError) {
        clearSession();
        queue.forEach(({ reject }) => reject(refreshError));
        queue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

function clearSession() {
  localStorage.removeItem("elearny_access_token");
  localStorage.removeItem("elearny_refresh_token");
  localStorage.removeItem("elearny_user");
  window.location.href = "/login";
}

export default api;
