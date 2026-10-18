import { Bell, CreditCard, FilePlus, Wrench } from "lucide-react";
import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/shared/SectionHeading";

const STEPS = [
  {
    icon: FilePlus,
    title: "File a request",
    text: "Pick a service, describe the problem, add the location and up to 5 photos.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Smartphone used to submit a civic service request",
  },
  {
    icon: CreditCard,
    title: "Pay if required",
    text: "Paid services are settled securely through SSLCommerz or bKash.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Customer making a digital payment",
  },
  {
    icon: Wrench,
    title: "Department acts",
    text: "Your request is routed to the right department and worked within its SLA.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Maintenance workers carrying out repair work",
  },
  {
    icon: Bell,
    title: "Track and confirm",
    text: "Get notified at every step, then reopen or rate the result.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Person using a digital device to check updates",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From complaint to resolution in four steps"
        />

        <Stagger
          as="ol"
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((step, i) => (
            <StaggerItem
              as="li"
              key={step.title}
              className="group relative overflow-hidden rounded-xl border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full border border-white/30 bg-black/35 text-lg font-bold text-white backdrop-blur-sm">
                  {i + 1}
                </span>
                <div className="absolute bottom-3 left-4 flex size-10 items-center justify-center rounded-xl border border-white/30 bg-white/90 text-primary shadow-sm backdrop-blur-sm">
                  <step.icon className="size-5" aria-hidden="true" />
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {step.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
