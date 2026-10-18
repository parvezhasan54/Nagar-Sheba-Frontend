import { Bell, MapPin, Moon, ScrollText, Timer, Undo2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/shared/SectionHeading";

const FEATURES = [
  {
    icon: Timer,
    title: "Deadlines that are tracked",
    text: "Every service has a resolution time. The clock starts at assignment and overdue requests are flagged for administrators.",
  },
  {
    icon: MapPin,
    title: "Exact location pins",
    text: "Use your device location or enter coordinates, with a live map preview before you submit.",
  },
  {
    icon: ScrollText,
    title: "A full audit trail",
    text: "Every status change and administrative action is recorded with who did it and when.",
  },
  {
    icon: Undo2,
    title: "Reopen and refunds",
    text: "Reopen within 3 days if the fix did not hold. Cancelled paid requests are refunded automatically.",
  },
  {
    icon: Bell,
    title: "Live notifications",
    text: "Get notified when a request is assigned, updated, resolved or paid.",
  },
  {
    icon: Moon,
    title: "Works on every screen",
    text: "Responsive on phones, tablets and desktops, with a dark mode that keeps contrast.",
  },
];

export function Features() {
  return (
    <>
      <Reveal>
        <SectionHeading
          eyebrow="Why Nagar Sheba"
          title="Built for accountability"
          description="Every request has an owner, a deadline and a visible history."
        />
      </Reveal>

      <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <StaggerItem key={f.title} className="h-full">
            <div className="h-full rounded-xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {f.text}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}