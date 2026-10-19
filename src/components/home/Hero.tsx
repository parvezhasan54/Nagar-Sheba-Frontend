import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Magnetic } from "../motion/Magnetic";
import { SplitText } from "../motion/SplitText";
import { HeroSearch } from "./HeroSearch";
import { HeroSlides } from "./HeroSlides";
import { ScrollCue } from "./ScrollCue";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[60svh] items-center border-b bg-gradient-to-b from-primary/10 via-background to-background lg:max-h-[70svh]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-float absolute -top-24 left-[10%] size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="animate-float-slow absolute top-32 right-[8%] size-80 rounded-full bg-chart-1/30 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <Stagger gap={0.12} className="text-center lg:text-left">
          <StaggerItem>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <ShieldCheck className="size-3.5 text-primary" />
              One platform for every city service
            </span>
          </StaggerItem>

          <StaggerItem>
            <h1 className="mt-5 max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-5xl lg:text-5xl xl:text-6xl">
              <SplitText text="Report it. Track it." />
              <SplitText
                text="See it fixed."
                delay={0.35}
                wordClassName="text-primary"
              />
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground lg:mx-0 lg:text-lg">
              File a complaint, pay service fees securely and follow every status
              update until your issue is resolved.
            </p>
          </StaggerItem>

          <StaggerItem>
            <HeroSearch />
          </StaggerItem>

          <StaggerItem>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row lg:justify-start justify-center">
              <Magnetic>
                <Link
                  href="/citizen/requests/new"
                  className={cn(buttonVariants(), "group h-11 gap-2 px-6 text-sm font-semibold shadow-lg shadow-primary/25")}
                >
                  Report an issue
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/services"
                  className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6 text-sm font-semibold")}
                >
                  Browse services
                </Link>
              </Magnetic>
            </div>
          </StaggerItem>
        </Stagger>

        <div className="hidden lg:block">
          <HeroSlides />
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}