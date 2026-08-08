import { http, unwrap } from "@/shared/api/httpClient";

export const linksApi = {
  list: (params) => http.get("/urls", { params }).then(unwrap),

  create: (payload) => http.post("/urls", payload).then(unwrap),

  getByShortCode: (shortCode) => http.get(`/urls/${shortCode}`).then(unwrap),

  update: (shortCode, payload) => http.patch(`/urls/${shortCode}`, payload).then(unwrap),

  remove: (shortCode) => http.delete(`/urls/${shortCode}`).then(unwrap),

  qrCodeUrl: (shortCode) => {
    // Rendered directly as an <img src>; the browser attaches the auth
    // header via the shared axios instance is not possible for <img>, so we
    // fetch as a blob and hand back an object URL instead.
    return http
      .get(`/urls/${shortCode}/qr`, { responseType: "blob" })
      .then((res) => URL.createObjectURL(res.data));
  },
};
