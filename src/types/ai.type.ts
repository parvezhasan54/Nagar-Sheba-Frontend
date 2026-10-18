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