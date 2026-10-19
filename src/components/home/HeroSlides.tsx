"use client";

import { Bell, CreditCard, FilePlus, Wrench } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    icon: FilePlus,
    step: "Step 1",
    title: "Report the issue",
    text: "Pick a service, pin the exact location and add up to 5 photos.",
    meta: "Free complaints, no payment needed",
  },
  {
    icon: CreditCard,
    step: "Step 2",
    title: "Pay if it is a permit",
    text: "Settle fees securely through SSLCommerz or bKash and get a PDF receipt.",
    meta: "Automatic refund if you cancel",
  },
  {
    icon: Wrench,
    step: "Step 3",
    title: "The department acts",
    text: "Your request is assigned to staff and the service deadline starts.",
    meta: "Overdue requests are flagged",
  },
  {
    icon: Bell,
    step: "Step 4",
    title: "Track and confirm",
    text: "Get notified at every step, then reopen within 3 days or rate the result.",
    meta: "Full status history",
  },
];

export function HeroSlides() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const slide = SLIDES[index];
  const Icon = slide.icon;

  return (
  <section
  aria-roledescription="carousel"
  aria-label="How Nagar Sheba works"
  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
  onFocus={() => setPaused(true)}
  onBlur={() => setPaused(false)}
  className="rounded-2xl border bg-card/90 p-6 shadow-xl backdrop-blur"
>
      <div className="min-h-44" aria-live={paused ? "polite" : "off"}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.step}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-6" aria-hidden="true" />
            </div>
            <p className="mt-4 text-xs font-semibold tracking-widest text-primary uppercase">
              {slide.step}
            </p>
            <h2 className="mt-1 font-heading text-xl font-semibold">{slide.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{slide.text}</p>
            <p className="mt-3 text-xs font-medium text-foreground/70">{slide.meta}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center gap-2" role="tablist" aria-label="Choose a step">
        {SLIDES.map((s, i) => (
          <button
            key={s.step}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show ${s.step}: ${s.title}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              i === index ? "w-8 bg-primary" : "w-4 bg-muted hover:bg-muted-foreground/40",
            )}
          />
        ))}
      </div>
</section>
  );
}