"use client";

import { ChevronDown } from "lucide-react";

export function ScrollCue() {
  const scroll = () =>
    document
      .getElementById("hero")
      ?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={scroll}
      aria-label="Scroll to next section"
      className="absolute bottom-3 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-primary"
    >
      <ChevronDown className="size-5 animate-bounce" />
    </button>
  );
}