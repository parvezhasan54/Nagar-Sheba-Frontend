import { useMutation, useQuery } from "@tanstack/react-query";
import { aiChat, aiSuggestCategory, getAiInsights } from "@/api";
import { keepPreviousData } from "@tanstack/react-query";
import { aiSearchSuggest } from "@/api";

export function useSearchSuggest(q: string) {
  return useQuery({
    queryKey: ["search-suggest", q],
    queryFn: () => aiSearchSuggest(q),
    enabled: q.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
export function useAiChat() {
  return useMutation({ mutationFn: aiChat });
}

export function useAiSuggestCategory() {
  return useMutation({ mutationFn: aiSuggestCategory });
}

export function useAiInsights() {
  return useQuery({
    queryKey: ["ai-insights"],
    queryFn: getAiInsights,
    staleTime: 5 * 60 * 1000,
  });
}
