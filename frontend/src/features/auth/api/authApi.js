import { http, unwrap } from "@/shared/api/httpClient";

export const authApi = {
  register: (payload) =>
    http.post("/auth/register", payload).then(unwrap),

  login: (payload) => http.post("/auth/login", payload).then(unwrap),

  me: () => http.get("/auth/me").then(unwrap),

  logout: () => http.post("/auth/logout").then(unwrap),

  refresh: () => http.post("/auth/refresh").then(unwrap),
};
