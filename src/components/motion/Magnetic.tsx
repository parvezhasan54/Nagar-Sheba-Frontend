"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import type { MouseEvent, ReactNode } from "react";

export function Magnetic({
  children,
  strength = 0.25,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 16 });
  const y = useSpring(0, { stiffness: 220, damping: 16 });

  if (reduce) return <div className="inline-block">{children}</div>;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}