"use client";

import { Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAiChat } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/ai.type";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I can help you find the right city service, explain fees, deadlines, refunds and reopening.",
};

const QUICK = [
  "Which services are free?",
  "How do refunds work?",
  "How long does a pothole fix take?",
];

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const endRef = useRef<HTMLDivElement>(null);
  const { mutate: ask, isPending } = useAiChat();

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new content
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending, open]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content || isPending) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    // greeting is UI only; the API wants the conversation from the user's first message
    ask(next.filter((m) => m !== GREETING).slice(-10), {
      onSuccess: ({ data }) =>
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]),
      onError: (error) =>
        setMessages((m) => [
          ...m,
          { role: "assistant", content: getApiErrorMessage(error) },
        ]),
    });
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {open && (
        <div className="animate-page-in mb-3 flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border bg-popover shadow-2xl">
          <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4" /> Nagar Sheba Assistant
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded p-1 hover:bg-white/15"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: append-only list
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-6",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted",
                )}
              >
                {m.content}
              </div>
            ))}
            {isPending && (
              <div className="w-fit rounded-lg bg-muted px-3 py-2">
                <Spinner />
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border px-3 py-1 text-xs hover:bg-muted"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a service..."
              maxLength={500}
              aria-label="Message"
              className="h-9"
            />
            <Button type="submit" size="icon-lg" disabled={isPending || !input.trim()} aria-label="Send">
              <Send />
            </Button>
          </form>
        </div>
      )}

      <Button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="ml-auto flex h-12 gap-2 rounded-full px-5 shadow-lg"
      >
        <Sparkles className="size-4" /> Ask AI
      </Button>
    </div>
  );
}