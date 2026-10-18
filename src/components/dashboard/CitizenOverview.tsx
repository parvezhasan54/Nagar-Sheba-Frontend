"use client";

import {
  CircleCheck,
  ClipboardList,
  CreditCard,
  FilePlus,
  Hourglass,
  Inbox,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCitizenSummary, useProfile, useRequests } from "@/hook";
import { formatDate } from "@/lib/format";
import { getDisplayName } from "@/lib/user";
import { cn } from "@/lib/utils";
import { RecommendedServices } from "./RecommendedServices";

const CitizenCharts = dynamic(
  () => import("./CitizenCharts").then((m) => m.CitizenCharts),
  { loading: () => <Skeleton className="mb-6 h-80 w-full rounded-xl" /> },
);

export function CitizenOverview() {
  const { data: profile } = useProfile();

  // One summary request (shared with CitizenCharts) replaces five count queries.
  const summary = useCitizenSummary();
  const recent = useRequests({ limit: 5 });

  const byStatus = summary.data?.data.byStatus ?? {};
  const count = (value: number | undefined) =>
    summary.isLoading ? "…" : summary.isError ? "—" : (value ?? 0);

  const pendingCount = byStatus.PENDING_PAYMENT ?? 0;
  const name = getDisplayName(profile);

  return (
    <div>
      <PageHeader
        title={name ? `Welcome, ${name}` : "Welcome"}
        description="Here is where your requests stand."
        actions={
          <Link
            href="/citizen/requests/new"
            className={cn(buttonVariants(), "h-9 gap-2 px-4")}
          >
            <FilePlus className="size-4" /> New request
          </Link>
        }
      />

      {pendingCount > 0 && (
        <Link
          href="/citizen/requests?status=PENDING_PAYMENT"
          className="mb-6 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground hover:bg-primary/10"
        >
          <CreditCard className="size-4 shrink-0" />
          {pendingCount} request{pendingCount === 1 ? " is" : "s are"} waiting
          for payment. Review now
        </Link>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total requests"
          value={count(summary.data?.data.total)}
          icon={ClipboardList}
        />
        <StatCard
          title="Awaiting payment"
          value={count(byStatus.PENDING_PAYMENT)}
          icon={CreditCard}
          tone="warning"
        />
        <StatCard
          title="In progress"
          value={count(byStatus.IN_PROGRESS)}
          icon={Hourglass}
        />
        <StatCard
          title="Resolved"
          value={count(byStatus.RESOLVED)}
          icon={CircleCheck}
          tone="success"
        />
      </div>
      <CitizenCharts />
      <RecommendedServices />
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent requests</CardTitle>
          <Link
            href="/citizen/requests"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recent.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recent.isError ? (
            <ErrorState error={recent.error} onRetry={() => recent.refetch()} />
          ) : (recent.data?.data ?? []).length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No requests yet"
              description="Report an issue and it will show up here."
            />
          ) : (
            <ul className="divide-y">
              {recent.data?.data.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/citizen/requests/${r.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {r.trackingRef} · {formatDate(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
