"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAiSuggestCategory } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ServiceSuggestion } from "@/types/ai.type";

type Props = { onPick: (categoryId: string) => void };

export function AiServicePicker({ onPick }: Props) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ServiceSuggestion | null>(null);
  const { mutate: suggest, isPending } = useAiSuggestCategory();

  const run = () =>
    suggest(text, {
      onSuccess: ({ data }) => setResult(data),
      onError: (error) => {
        setResult(null);
        toast.error("No suggestion", { description: getApiErrorMessage(error) });
      },
    });

  return (
    <div className="space-y-3 rounded-lg border bg-primary/5 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="size-4 text-primary" /> Not sure which service?
      </p>
      <Textarea
        rows={2}
        value={text}
        maxLength={1000}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the problem, e.g. the street lamp near my house is dark every night"
        aria-label="Describe your problem"
      />
      <Button
        type="button"
        variant="outline"
        className="h-9 gap-2"
        disabled={isPending || text.trim().length < 10}
        onClick={run}
      >
        {isPending ? <Spinner data-icon="inline-start" /> : <Sparkles className="size-4" />}
        Suggest a service
      </Button>

      {result && (
        <div className="flex flex-col gap-2 rounded-md border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">{result.name}</p>
            <p className="text-xs text-muted-foreground">{result.reason}</p>
          </div>
          <Button
            type="button"
            className="h-8"
            onClick={() => {
              onPick(result.categoryId);
              toast.success(`Selected ${result.name}`);
            }}
          >
            Use this service
          </Button>
        </div>
      )}
    </div>
  );
}