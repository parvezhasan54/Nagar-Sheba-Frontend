import { Bell, CreditCard, FilePlus, Wrench } from "lucide-react";
import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { DrawLine } from "../motion/DrawLine";
import { CARD_BODY, CARD_MEDIA, CARD_SHELL } from "../shared/card-styles";

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

        <div className="relative mt-10">
          <DrawLine
            origin="left"
            delay={0.3}
            className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-px bg-gradient-to-r from-primary/20 via-primary to-primary/20 lg:block"
          />

          <Stagger as="ol" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <StaggerItem
                as="li"
                key={step.title}
                className="group flex flex-col"
              >
                <div className="relative z-10 mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm ring-4 ring-muted">
                  {i + 1}
                </div>

                <article className={CARD_SHELL}>
                  <div
                    className={cn(
                      CARD_MEDIA,
                      "flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-muted",
                    )}
                  >
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 flex size-10 items-center justify-center rounded-xl border border-white/30 bg-white/90 text-primary shadow-sm backdrop-blur-sm">
                      <step.icon
                        className="size-12 text-primary/70"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className={CARD_BODY}>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
