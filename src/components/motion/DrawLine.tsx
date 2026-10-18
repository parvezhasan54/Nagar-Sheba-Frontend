"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  origin?: "left" | "center" | "right";
  delay?: number;
};

export function DrawLine({ className, origin = "center", delay = 0 }: Props) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block", className)}
      style={{ transformOrigin: origin }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}