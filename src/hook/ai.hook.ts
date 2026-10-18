import { useMutation, useQuery } from "@tanstack/react-query";
import { aiChat, aiSuggestCategory, getAiInsights } from "@/api";

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
