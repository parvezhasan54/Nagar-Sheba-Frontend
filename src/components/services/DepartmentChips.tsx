"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { useDepartments, useUrlState } from "@/hook";
import { cn } from "@/lib/utils";

export function DepartmentChips() {
  const { get, setParams } = useUrlState();
  const pillId = useId();
  const { data } = useDepartments({ limit: 100 });
  const active = get("department", "all");

  const options = [
    { value: "all", label: "All services" },
    ...(data?.data ?? []).map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <div
      role="group"
      aria-label="Filter by department"
      className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((o) => {
        const selected = o.value === active;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected}
            onClick={() => setParams({ department: o.value })}
            className={cn(
              "relative isolate shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
              selected
                ? "border-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {selected && (
              <motion.span
                layoutId={`dept-pill-${pillId}`}
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}