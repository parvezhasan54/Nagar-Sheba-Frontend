"use client";

import {
  Bot,
  Check,
  Copy,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAiChat } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";

type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
  error?: boolean;
};

const STORAGE_KEY = "ns-chat";
const MAX_LENGTH = 500;

const QUICK = [
  "Which services are free?",
  "How do refunds work?",
  "How long does a pothole fix take?",
  "How do I reopen a request?",
];

const uid = () => Math.random().toString(36).slice(2);

const formatTime = (at: number) =>
  new Date(at).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

function loadMessages(): UiMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UiMessage[]) : [];
  } catch {
    return [];
  }
}

/** The API needs: no error bubbles, max 10 messages, first one from the user. */
function toHistory(list: UiMessage[]) {
  const clean = list.filter((m) => !m.error).slice(-10);
  while (clean.length > 0 && clean[0].role !== "user") clean.shift();
  return clean.map(({ role, content }) => ({ role, content }));
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2">
      <Avatar />
      <output
        className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3"
        aria-label="Assistant is typing"
      >
                <span
          key="typing-dot-1"
          aria-hidden="true"
          className="typing-dot size-1.5 rounded-full bg-muted-foreground"
        />
        <span
          key="typing-dot-2"
          aria-hidden="true"
          className="typing-dot size-1.5 rounded-full bg-muted-foreground"
        />
        <span
          key="typing-dot-3"
          aria-hidden="true"
          className="typing-dot size-1.5 rounded-full bg-muted-foreground"
        />
      </output>
    </div>
  );
}

function Avatar() {
  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Bot className="size-4" aria-hidden="true" />
    </div>
  );
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UiMessage[]>(loadMessages);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: ask, isPending } = useAiChat();

  // Keep the conversation across page navigation (this tab only)
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // storage can be blocked; the chat still works
    }
  }, [messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new content
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isPending, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const run = (history: UiMessage[]) => {
    ask(toHistory(history), {
      onSuccess: ({ data }) =>
        setMessages((m) => [
          ...m,
          { id: uid(), role: "assistant", content: data.reply, at: Date.now() },
        ]),
      onError: (error) =>
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "assistant",
            content: getApiErrorMessage(
              error,
              "I couldn't reach the server. Please try again.",
            ),
            at: Date.now(),
            error: true,
          },
        ]),
    });
  };

  const send = (text: string) => {
    const content = text.trim();
    if (!content || isPending) return;

    const next: UiMessage[] = [
      ...messages,
      { id: uid(), role: "user", content, at: Date.now() },
    ];
    setMessages(next);
    setInput("");
    run(next);
  };

  const retry = () => {
    if (isPending || !messages.at(-1)?.error) return;
    const base = messages.slice(0, -1);
    setMessages(base);
    run(base);
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  const copy = async (m: UiMessage) => {
    try {
      await navigator.clipboard.writeText(m.content);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard blocked; nothing to do
    }
  };

  const lastId = messages.at(-1)?.id;

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Nagar Sheba assistant"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className="animate-page-in fixed inset-0 z-50 flex flex-col overflow-hidden bg-popover text-popover-foreground sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[36rem] sm:max-h-[calc(100dvh-3rem)] sm:w-[24rem] sm:rounded-2xl sm:border sm:shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex size-9 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-sm font-semibold">Nagar Sheba Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                <span className="size-1.5 rounded-full bg-green-400" />
                Ask about services, fees and deadlines
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                aria-label="Start a new chat"
                title="New chat"
                className="rounded-md p-1.5 outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded-md p-1.5 outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 space-y-4 overflow-y-auto p-4"
            aria-live="polite"
          >
            {messages.length === 0 && !isPending && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-7" aria-hidden="true" />
                </div>
                <h2 className="text-base font-semibold">How can I help?</h2>
                <p className="mt-1 max-w-64 text-sm text-muted-foreground">
                  I can find the right city service and explain fees, deadlines,
                  refunds and reopening.
                </p>
                <div className="mt-5 flex w-full flex-col gap-2">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="rounded-lg border bg-background px-3 py-2 text-left text-sm outline-none transition-colors hover:border-primary/40 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const mine = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex items-end gap-2",
                    mine && "flex-row-reverse",
                  )}
                >
                  {!mine && <Avatar />}
                  <div
                    className={cn(
                      "group max-w-[80%]",
                      mine && "flex flex-col items-end",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2 text-sm leading-6 break-words whitespace-pre-wrap",
                        mine
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : m.error
                            ? "rounded-bl-sm bg-destructive/10 text-destructive"
                            : "rounded-bl-sm bg-muted",
                      )}
                    >
                      {m.content}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{formatTime(m.at)}</span>

                      {!mine && !m.error && (
                        <button
                          type="button"
                          onClick={() => copy(m)}
                          aria-label="Copy reply"
                          className="flex items-center gap-1 rounded opacity-0 outline-none transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="size-3" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="size-3" /> Copy
                            </>
                          )}
                        </button>
                      )}

                      {m.error && m.id === lastId && (
                        <button
                          type="button"
                          onClick={retry}
                          disabled={isPending}
                          className="flex items-center gap-1 rounded font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          <RotateCcw className="size-3" /> Retry
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isPending && <TypingBubble />}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <form
            className="border-t bg-background p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                rows={1}
                maxLength={MAX_LENGTH}
                aria-label="Message"
                placeholder="Ask about a service..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                className="max-h-28 min-h-10 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none [field-sizing:content] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
              <Button
                type="submit"
                size="icon-lg"
                disabled={isPending || !input.trim()}
                aria-label="Send message"
              >
                <Send />
              </Button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>AI can make mistakes. Check fees on the service page.</span>
              {input.length > MAX_LENGTH - 100 && (
                <span>
                  {input.length}/{MAX_LENGTH}
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Launcher (hidden on phones while the full-screen chat is open) */}
      <Button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        className={cn(
          "fixed right-4 bottom-4 z-40 h-12 gap-2 rounded-full px-4 shadow-lg sm:right-6 sm:bottom-6 sm:px-5",
          open && "max-sm:hidden",
        )}
      >
        {open ? <X className="size-5" /> : <Sparkles className="size-5" />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask AI"}</span>
      </Button>
    </>
  );
}