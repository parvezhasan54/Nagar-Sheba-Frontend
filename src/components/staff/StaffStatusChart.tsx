"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStaffPerformance } from "@/hook";
import { REQUEST_STATUSES, STATUS_META } from "@/lib/status";

const tick = { fontSize: 11, fill: "var(--muted-foreground)" };
const tooltipStyle = {
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function StaffStatusChart() {
  const { data, isLoading, isError, error, refetch } = useStaffPerformance();

  if (isLoading) return <Skeleton className="mb-6 h-72 w-full rounded-xl" />;

  if (isError || !data) {
    return (
      <div className="mb-6">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  const chartData = REQUEST_STATUSES.map((key) => ({
    name: STATUS_META[key].label,
    value: data.data.byStatus[key] ?? 0,
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>My workload by status</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          role="img"
          aria-label="Bar chart of my requests by status"
          className="h-64 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -16, right: 8 }}>
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="name"
                tick={tick}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} tick={tick} />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              />
              <Bar
                dataKey="value"
                name="Requests"
                fill="var(--chart-4)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
