"use client";

import { Children, type ReactNode } from "react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export function StatGrid({
  children,
  className = "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Stagger className={className} gap={0.07}>
      {Children.map(children, (child) => (
        <StaggerItem className="h-full">{child}</StaggerItem>
      ))}
    </Stagger>
  );
}