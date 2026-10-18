"use client";

import dynamic from "next/dynamic";

// The assistant is only useful after hydration and most visitors never open it,
// so keep it out of the initial bundle.
const ChatAssistant = dynamic(
  () => import("./ChatAssistant").then((m) => m.ChatAssistant),
  { ssr: false },
);

export function ChatAssistantLoader() {
  return <ChatAssistant />;
}
