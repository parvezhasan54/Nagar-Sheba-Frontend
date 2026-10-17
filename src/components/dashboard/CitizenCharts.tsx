"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCitizenSummary } from "@/hook";
import { formatCurrency } from "@/lib/format";
import { REQUEST_STATUSES, STATUS_META } from "@/lib/status";

const tick = { fontSize: 11, fill: "var(--muted-foreground)" };
const tooltipStyle = {
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function CitizenCharts() {
  const { data, isLoading, isError, error, refetch } = useCitizenSummary();

  if (isLoading) {
    return <Skeleton className="mb-6 h-80 w-full rounded-xl" />;
  }
  if (isError || !data) {
    return (
      <div className="mb-6">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  const s = data.data;
  if (s.total === 0) return null; // the overview already shows an empty state

  const statusData = REQUEST_STATUSES.map((key) => ({
    name: STATUS_META[key].label,
    value: s.byStatus[key] ?? 0,
  }));

  return (
    <div className="mb-6 grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>My requests by status</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            role="img"
            aria-label="Bar chart of my requests by status"
            className="h-72 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ left: -16, right: 8 }}>
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

      <Card>
        <CardHeader>
          <CardTitle>Requests in the last 6 months</CardTitle>
          <p className="text-xs text-muted-foreground">
            Total fees paid: {formatCurrency(s.totalSpent)}
          </p>
        </CardHeader>
        <CardContent>
          <div
            role="img"
            aria-label="Line chart of requests filed per month"
            className="h-72 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.byMonth} margin={{ left: -16, right: 8 }}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="label" tick={tick} />
                <YAxis allowDecimals={false} tick={tick} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Requests"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
