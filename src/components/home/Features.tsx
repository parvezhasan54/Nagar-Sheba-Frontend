import { Bell, MapPin, Moon, ScrollText, Timer, Undo2 } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Tilt } from "../motion/Tilt";

const FEATURES = [
  {
    icon: Timer,
    title: "Deadlines that are tracked",
    text: "Every service has a resolution time. The clock starts at assignment and overdue requests are flagged for administrators.",
    image:
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Clock representing deadlines and time tracking",
  },
  {
    icon: MapPin,
    title: "Exact location pins",
    text: "Use your device location or enter coordinates, with a live map preview before you submit.",
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Map used to identify a location",
  },
  {
    icon: ScrollText,
    title: "A full audit trail",
    text: "Every status change and administrative action is recorded with who did it and when.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Documents and records for accountability",
  },
  {
    icon: Undo2,
    title: "Reopen and refunds",
    text: "Reopen within 3 days if the fix did not hold. Cancelled paid requests are refunded automatically.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Customer handling a digital payment",
  },
  {
    icon: Bell,
    title: "Live notifications",
    text: "Get notified when a request is assigned, updated, resolved or paid.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Smartphone representing live notifications",
  },
  {
    icon: Moon,
    title: "Works on every screen",
    text: "Responsive on phones, tablets and desktops, with a dark mode that keeps contrast.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Modern devices and web development workspace",
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
        {FEATURES.map((feature) => (
          <StaggerItem key={feature.title} className="h-full [perspective:1000px]">
  <Tilt>
    <article className="group h-full overflow-hidden rounded-xl border bg-card transition-shadow duration-300 hover:border-primary/40 hover:shadow-lg">
    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 flex size-11 items-center justify-center rounded-xl border border-white/30 bg-white/90 text-primary shadow-sm backdrop-blur-sm">
                  <feature.icon className="size-5" aria-hidden="true" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            </article>
                  </Tilt>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}
