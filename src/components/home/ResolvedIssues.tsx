import { Building2, CircleCheck, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatSla } from "@/lib/format";
import type { ResolvedIssue } from "@/types/public.type";
import { CATEGORY_GRID_CLASS } from "./CategoryCard";

export function ResolvedIssues({ issues }: { issues: ResolvedIssue[] }) {
  return (
    <>
      <Reveal>
        <SectionHeading
          eyebrow="Real results"
          title="Recently resolved issues"
          description="The latest problems our city teams have fixed."
        />
      </Reveal>

      <div className="mt-10">
        {issues.length === 0 ? (
          <EmptyState
            icon={CircleCheck}
            title="No resolved issues yet"
            description="Fixed issues will be showcased here."
          />
        ) : (
          <Stagger className={CATEGORY_GRID_CLASS}>
            {issues.map((i) => (
              <StaggerItem key={i.id} className="h-full">
                <article className="flex h-full flex-col rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <Badge
                    variant="secondary"
                    className="w-fit gap-1 bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300"
                  >
                    <CircleCheck />
                    Resolved in {formatSla(i.hoursToResolve)}
                  </Badge>
                  <h3 className="mt-3 line-clamp-2 min-h-11 text-base font-semibold leading-snug">
                    {i.title}
                  </h3>
                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <Building2 className="size-3.5 shrink-0" />
                      <span className="truncate">{i.department}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">{i.area}</span>
                    </p>
                  </div>
                  <p className="mt-auto pt-4 text-xs text-muted-foreground">
                    {i.category} · {formatDate(i.resolvedAt)}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </>
  );
}