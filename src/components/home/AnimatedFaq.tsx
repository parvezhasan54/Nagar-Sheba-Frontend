"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string };

export function AnimatedFaq({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y rounded-xl border bg-card">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-btn-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {item.q}
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown
                    className={cn("size-4 shrink-0", isOpen ? "text-primary" : "text-muted-foreground")}
                    aria-hidden="true"
                  />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-6 text-muted-foreground">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}