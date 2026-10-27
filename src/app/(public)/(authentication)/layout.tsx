import { ArrowLeft, Bell, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const POINTS = [
  {
    icon: MapPin,
    title: "Pin the exact location",
    text: "Report potholes, leaks and outages with a map pin and photos.",
  },
  {
    icon: CreditCard,
    title: "Pay permit fees online",
    text: "SSLCommerz and bKash, with instant receipts and automatic refunds.",
  },
  {
    icon: Bell,
    title: "Track every update",
    text: "Get notified when your request is assigned, resolved or paid.",
  },
];

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <ShieldCheck className="size-5" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span className="block text-base font-bold tracking-tight">
          Nagar Sheba
        </span>
        <span className="mt-1 block text-[10px] font-medium tracking-widest uppercase opacity-70">
          Smart City Services
        </span>
      </span>
    </Link>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel (desktop only) */}
      <aside className="relative isolate hidden min-h-screen overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/images/nagar-sheba-auth.png"
          alt="Smart city services, location tracking, and city infrastructure"
          fill
          priority
          sizes="52vw"
          className="object-cover"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/5 to-slate-950/80"
        />

        <div className="relative z-10 p-8 xl:p-12">
          <Logo />
        </div>

        <div className="relative z-10 mt-auto max-w-2xl p-8 xl:p-12">
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Your city, your voice
            </span>

            <h2 className="font-heading max-w-xl text-4xl leading-tight font-bold tracking-tight text-white xl:text-5xl">
              A better city starts with you.
            </h2>

            <p className="mt-4 max-w-lg text-base leading-7 text-white/85">
              Report local issues, track service requests, and help build a
              cleaner, smarter community.
            </p>
          </Reveal>

          <Stagger as="ul" className="mt-8 grid gap-3 sm:grid-cols-3" gap={0.1}>
            {POINTS.map((point) => (
              <StaggerItem as="li" key={point.title}>
                <div className="h-full rounded-xl border border-white/20 bg-slate-950/25 p-3 backdrop-blur-md">
                  <point.icon
                    className="mb-3 size-5 text-white"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-white">
                    {point.title}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <p className="mt-8 text-xs text-white/70">
            © {new Date().getFullYear()} Nagar Sheba. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Form side */}
      <div className="flex min-h-screen flex-col bg-muted/40">
        <header className="flex items-center justify-between px-4 py-4 sm:px-8">
          <Logo className="lg:invisible" />
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> Home
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-8">
          <div id="main" className="w-full max-w-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
