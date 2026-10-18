import { ArrowRight,  ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { ScrollCue } from "./ScrollCue";
import { HeroSearch } from "./HeroSearch";
import { SplitText } from "../motion/SplitText";
import { Magnetic } from "../motion/Magnetic";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[60svh] items-center overflow-visible border-b bg-gradient-to-b from-primary/10 via-background to-background md:max-h-[70svh]"
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-float absolute -top-24 left-[10%] size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="animate-float-slow absolute top-32 right-[8%] size-80 rounded-full bg-chart-1/30 blur-3xl" />
      </div>

      <Stagger
        gap={0.12}
        className="mx-auto w-full max-w-7xl px-4 pt-10 pb-14 text-center sm:px-6 sm:pt-12 lg:px-8"
      >
        <StaggerItem>
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <ShieldCheck className="size-3.5 text-primary" />
            One platform for every city service
          </span>
        </StaggerItem>

        <StaggerItem>
  <h1 className="mx-auto mt-5 max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
    <SplitText text="Report it. Track it." />
    <SplitText
      text="See it fixed."
      delay={0.35}
      wordClassName="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent"
    />
  </h1>
</StaggerItem>

        <StaggerItem>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Nagar Sheba connects citizens with city departments. File a
            complaint, pay service fees securely and follow every status update
            until your issue is resolved.
          </p>
        </StaggerItem>

<StaggerItem>
  <search className="mx-auto mt-6 w-full max-w-xl">
    <StaggerItem>
  <HeroSearch />
</StaggerItem>
  </search>
</StaggerItem>

        <StaggerItem>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
  <Magnetic>
    <Link href="/citizen/requests/new" className={cn(buttonVariants(), "group h-11 gap-2 px-6 text-sm font-semibold shadow-lg shadow-primary/25")}>
      Report an issue
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </Magnetic>
  <Magnetic>
    <Link href="/services" className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6 text-sm font-semibold")}>
      Browse services
    </Link>
  </Magnetic>
</div>
        </StaggerItem>
      </Stagger>

      <ScrollCue />
    </section>
  );
}