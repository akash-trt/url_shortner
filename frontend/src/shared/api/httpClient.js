import axios from "axios";

// The refresh token lives in an httpOnly cookie (set by the backend), so we
// never touch it directly. The access token is kept in memory only — not
// localStorage — so a stray XSS payload can't walk off with a long-lived
// credential. It simply evaporates on a hard refresh, which is what the
// silent-refresh flow below exists to paper over.
let accessToken = null;
let onUnauthorized = () => {};

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

export const http = axios.create({
  baseURL,
  withCredentials: true, // send/receive the refreshToken cookie
});

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    const isAuthRoute =
      config?.url?.includes("/auth/login") ||
      config?.url?.includes("/auth/register") ||
      config?.url?.includes("/auth/refresh");

    if (response?.status !== 401 || isAuthRoute || config._retried) {
      return Promise.reject(error);
    }

    config._retried = true;

    try {
      // Multiple requests can 401 at once — share a single refresh call
      // instead of racing the backend with a burst of refresh attempts.
      refreshPromise ??= http
        .post("/auth/refresh")
        .then((res) => {
          const token = res.data?.data?.accessToken;
          setAccessToken(token);
          return token;
        })
        .finally(() => {
          refreshPromise = null;
        });

      const token = await refreshPromise;
      config.headers.Authorization = `Bearer ${token}`;
      return http(config);
    } catch (refreshError) {
      setAccessToken(null);
      onUnauthorized();
      return Promise.reject(refreshError);
    }
  }
);

/** Unwraps the backend's { success, statusCode, message, data } envelope. */
export function unwrap(response) {
  return response.data?.data;
}

/** Turns backend/network errors into a single readable message. */
export function readError(error) {
  return (
    error?.response?.data?.message ||
    (error?.message === "Network Error"
      ? "Can't reach the server. Check your connection and try again."
      : error?.message) ||
    "Something went wrong. Please try again."
  );
}
