import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { linksApi } from "../api/linksApi";

export const linksKeys = {
  all: ["links"],
  list: (params) => [...linksKeys.all, "list", params],
  detail: (shortCode) => [...linksKeys.all, "detail", shortCode],
};

export function useLinks(params = { page: 1, limit: 20 }) {
  return useQuery({
    queryKey: linksKeys.list(params),
    queryFn: () => linksApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useLink(shortCode) {
  return useQuery({
    queryKey: linksKeys.detail(shortCode),
    queryFn: () => linksApi.getByShortCode(shortCode),
    enabled: Boolean(shortCode),
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksKeys.all });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ shortCode, payload }) => linksApi.update(shortCode, payload),
    onSuccess: (_, { shortCode }) => {
      queryClient.invalidateQueries({ queryKey: linksKeys.all });
      queryClient.invalidateQueries({ queryKey: linksKeys.detail(shortCode) });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linksApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksKeys.all });
    },
  });
}
