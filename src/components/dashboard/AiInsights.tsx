"use client";

import { CircleCheck, Sparkles, TriangleAlert } from "lucide-react";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiInsights } from "@/hook";

export function AiInsights() {
  const { data, isLoading, isError, error, refetch } = useAiInsights();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" /> AI insights and anomalies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : isError || !data ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : (
          <>
            {data.data.summary && (
              <p className="text-sm leading-6">{data.data.summary}</p>
            )}
            {data.data.anomalies.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CircleCheck className="size-4 text-green-600" /> No anomalies detected.
              </p>
            ) : (
              <ul className="divide-y rounded-lg border">
                {data.data.anomalies.map((a) => (
                  <li key={a.title} className="flex items-start gap-3 p-3">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.detail}</p>
                    </div>
                    <Badge variant={a.severity === "high" ? "destructive" : "secondary"}>
                      {a.severity}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}