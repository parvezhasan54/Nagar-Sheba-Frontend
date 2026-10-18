import { Building2, CircleCheck, ClipboardList, Star } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { StatCard } from "@/components/shared/StatCard";
import type { PublicStats } from "@/types/public.type";

export function StatsStrip({ stats }: { stats: PublicStats | null }) {
  const count = (value?: number) =>
    value === undefined ? "—" : <CountUp value={value} />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <StatCard
            title="Requests filed"
            value={count(stats?.totalRequests)}
            icon={ClipboardList}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="Issues resolved"
            value={count(stats?.resolvedRequests)}
            icon={CircleCheck}
            tone="success"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="City departments"
            value={count(stats?.departments)}
            icon={Building2}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="Citizen rating"
            value={
              !stats ? (
                "—"
              ) : stats.averageRating ? (
                <CountUp
                  value={stats.averageRating}
                  decimals={1}
                  suffix=" / 5"
                />
              ) : (
                "New"
              )
            }
            icon={Star}
            tone="warning"
          />
        </StaggerItem>
      </Stagger>
    </section>
  );
}
