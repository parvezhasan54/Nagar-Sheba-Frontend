import type { SearchSuggestResult } from "@/types/ai.type";
import apiClient from "@/lib/apiClient";
import type {
  AiInsights,
  ChatMessage,
  ServiceSuggestion,
} from "@/types/ai.type";
import type { ApiResponse } from "@/types/api.type";

export function aiChat(messages: ChatMessage[]) {
  return apiClient<ApiResponse<{ reply: string }>>("/ai/chat", {
    method: "POST",
    body: { messages },
  });
}

export function aiSuggestCategory(text: string) {
  return apiClient<ApiResponse<ServiceSuggestion>>("/ai/suggest-category", {
    method: "POST",
    body: { text },
  });
}

export function getAiInsights() {
  return apiClient<ApiResponse<AiInsights>>("/ai/admin-insights", {
    method: "GET",
  });
}


export function aiSearchSuggest(q: string) {
  return apiClient<ApiResponse<SearchSuggestResult>>("/ai/search-suggest", {
    method: "GET",
    query: { q },
  });
}