import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type { ContactPayload } from "@/types/public.type";

export function sendContactMessage(payload: ContactPayload) {
  return apiClient<ApiResponse<null>>("/public/contact", {
    method: "POST",
    body: payload,
  });
}

export function subscribeToNewsletter(payload: { email: string }) {
  return apiClient<ApiResponse<null>>("/public/subscribe", {
    method: "POST",
    body: payload,
  });
}
