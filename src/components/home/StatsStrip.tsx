import { Building2, CircleCheck, ClipboardList, Star } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { PublicStats } from "@/types/public.type";

export function StatsStrip({ stats }: { stats: PublicStats | null }) {
  const count = (value?: number) =>
    value === undefined ? "—" : <CountUp value={value} />;

  const items = [
    { icon: ClipboardList, label: "Requests filed", value: count(stats?.totalRequests) },
    { icon: CircleCheck, label: "Issues resolved", value: count(stats?.resolvedRequests) },
    { icon: Building2, label: "City departments", value: count(stats?.departments) },
    {
      icon: Star,
      label: "Citizen rating",
      value: !stats ? (
        "—"
      ) : stats.averageRating ? (
        <CountUp value={stats.averageRating} decimals={1} suffix=" / 5" />
      ) : (
        "New"
      ),
    },
  ];

  return (
    <section className="bg-primary text-primary-foreground">
      <Stagger className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-primary-foreground/20 lg:px-8">
        {items.map((item) => (
          <StaggerItem key={item.label} className="flex flex-col items-center text-center">
            <item.icon className="mb-2 size-6 opacity-80" aria-hidden="true" />
            <p className="text-3xl font-bold tabular-nums sm:text-4xl">{item.value}</p>
            <p className="mt-1 text-sm text-primary-foreground/80">{item.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}