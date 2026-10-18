"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  delay?: number;
  className?: string;
  wordClassName?: string;
};

export function SplitText({ text, delay = 0, className, wordClassName }: Props) {
  const reduce = useReducedMotion();

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static word list
            key={`${word}-${i}`}
            className="mr-[0.25em] -my-[0.1em] inline-block overflow-hidden py-[0.1em] align-bottom"
          >
            <motion.span
              className={cn("inline-block", wordClassName)}
              initial={reduce ? false : { y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.6,
                delay: delay + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}