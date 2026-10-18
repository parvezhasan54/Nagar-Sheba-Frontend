import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal scale={0.96}>
        <div className="relative isolate overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="animate-float absolute -top-16 -left-10 size-56 rounded-full bg-white/10 blur-2xl" />
            <div className="animate-float-slow absolute -right-10 -bottom-16 size-72 rounded-full bg-white/10 blur-2xl" />
          </div>

          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Help make your city work better
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80 sm:text-base">
            Create a free citizen account and start tracking your requests today.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "secondary" }), "h-11 px-6 text-sm font-semibold")}
              >
                Create free account
              </Link>
            </Magnetic>
            <Link
              href="/contact"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}