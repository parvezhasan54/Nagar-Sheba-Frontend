"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function WelcomeBanner({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate mb-6 overflow-hidden rounded-xl bg-primary px-6 py-6 text-primary-foreground sm:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="animate-float absolute -top-12 -right-8 size-48 rounded-full bg-white/10 blur-2xl" />
        <div className="animate-float-slow absolute -bottom-16 left-1/3 size-56 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest text-primary-foreground/70 uppercase">
            {today}
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/80">
            {description}
          </p>
        </div>
        {action}
      </div>
    </motion.div>
  );
}
