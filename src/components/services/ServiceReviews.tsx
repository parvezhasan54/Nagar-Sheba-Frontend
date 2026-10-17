import { MessageSquareText } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { StarRating } from "@/components/shared/StarRating";
import { formatDate } from "@/lib/format";
import type { CategoryReviews } from "@/types/category.type";

export function ServiceReviews({ data }: { data: CategoryReviews | null }) {
  if (!data || data.summary.total === 0) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="No reviews yet"
        description="Citizens can rate this service after their request is resolved."
      />
    );
  }

  const { summary, reviews } = data;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="text-center sm:px-6">
          <p className="text-4xl font-bold tabular-nums">
            {Number(summary.average).toFixed(1)}
          </p>
          <div className="mt-1 flex justify-center">
            <StarRating value={Math.round(Number(summary.average))} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.total} review{summary.total === 1 ? "" : "s"}
          </p>
        </div>

        <ul className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((n) => {
            const count = summary.distribution[String(n)] ?? 0;
            const pct = summary.total ? (count / summary.total) * 100 : 0;
            return (
              <li key={n} className="flex items-center gap-3 text-xs">
                <span className="w-8 shrink-0 text-muted-foreground">
                  {n} star
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="divide-y rounded-xl border">
        {reviews.map((r) => (
          <li key={r.id} className="space-y-1.5 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{r.reviewer}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(r.createdAt)}
              </p>
            </div>
            <StarRating value={r.rating} />
            {r.comment && (
              <p className="text-sm leading-6 text-muted-foreground">
                {r.comment}
              </p>
            )}
          </li>
        ))}
      </ul>
      {summary.total > reviews.length && (
        <p className="text-center text-xs text-muted-foreground">
          Showing the latest {reviews.length} of {summary.total} reviews.
        </p>
      )}
    </div>
  );
}
