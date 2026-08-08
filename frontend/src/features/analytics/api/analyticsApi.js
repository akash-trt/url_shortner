import { http, unwrap } from "@/shared/api/httpClient";

export const analyticsApi = {
  totalClicks: (shortCode) =>
    http.get(`/urls/${shortCode}/clicks/count`).then(unwrap),

  recentClicks: (shortCode, limit = 100) =>
    http.get(`/urls/${shortCode}/clicks`, { params: { limit } }).then(unwrap),

  summary: (shortCode) => http.get(`/urls/${shortCode}/analytics`).then(unwrap),
};
