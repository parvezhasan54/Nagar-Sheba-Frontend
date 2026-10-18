export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ServiceSuggestion = {
  categoryId: string;
  name: string;
  reason: string;
  source: "ai" | "keyword";
};

export type AiInsights = {
  anomalies: { severity: "high" | "medium"; title: string; detail: string }[];
  summary: string | null;
};

export type SearchSuggestion = {
  id: string;
  name: string;
  department: string;
  fee: string;
};

export type SearchSuggestResult = {
  suggestions: SearchSuggestion[];
  source: "ai" | "keyword";
};