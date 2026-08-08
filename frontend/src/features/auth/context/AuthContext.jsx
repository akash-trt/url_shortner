import { useCallback, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { setAccessToken, setUnauthorizedHandler } from "@/shared/api/httpClient";
import { AuthContext } from "./authContextInstance";// "booting" -> attempting the silent refresh on first load
// "authenticated" | "guest" -> settled states
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("booting");

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setStatus("guest");
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { accessToken } = await authApi.refresh();
        setAccessToken(accessToken);
        const me = await authApi.me();
        if (!cancelled) {
          setUser(me);
          setStatus("authenticated");
        }
      } catch {
        if (!cancelled) setStatus("guest");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload) => {
    const { user: loggedInUser, accessToken } = await authApi.login(payload);
    setAccessToken(accessToken);
    setUser(loggedInUser);
    setStatus("authenticated");
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { user: newUser, accessToken } = await authApi.register(payload);
    setAccessToken(accessToken);
    setUser(newUser);
    setStatus("authenticated");
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
      setStatus("guest");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, status, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
