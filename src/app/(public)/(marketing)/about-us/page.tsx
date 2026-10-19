import { Eye, HeartHandshake, ShieldCheck, Users, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Nagar Sheba gives citizens one accountable place to report issues and gives city teams the tools to resolve them.",
  openGraph: {
    title: "About Nagar Sheba",
    description: "One accountable place for city services.",
  },
};

const VALUES = [
  {
    icon: Eye,
    title: "Transparency",
    text: "Every status change is recorded, so you always know where your request stands.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
imageAlt: "Printed charts and documents spread across a desk",
  },
  {
    icon: ShieldCheck,
    title: "Accountability",
    text: "Each category has a service-level deadline, and overdue requests are flagged automatically.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
imageAlt: "Person reviewing a project checklist on a laptop",
  },
  {
    icon: HeartHandshake,
    title: "Fairness",
    text: "Fees are shown before you pay, and cancelled paid requests are refunded.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Group of people talking together outdoors", 
  },
];

const ROLES = [
  {
    icon: Users,
    title: "Citizens",
    text: "File requests, upload evidence, pay fees, reopen unresolved issues and rate the outcome.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Person using a laptop to access digital services",
  },
  {
    icon: Wrench,
    title: "Department staff",
    text: "Work the queue for their own department, update progress and attach proof of resolution.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Technical staff working on infrastructure and maintenance tasks",
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    text: "Manage departments and categories, assign work, oversee payments and review the audit trail.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    imageAlt:
      "Team collaborating to coordinate administrative responsibilities",
  },
];
function ImageCard({
  image,
  imageAlt,
  icon: Icon,
  title,
  text,
}: {
  image: string;
  imageAlt: string;
  icon: typeof Eye;
  title: string;
  text: string;
}) {
  return (
    <article className="group h-full overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 flex size-11 items-center justify-center rounded-xl border border-white/30 bg-white/90 text-primary shadow-sm backdrop-blur-sm">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </article>
  );
}

export default function AboutUsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              About Nagar Sheba
            </span>

            <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Better city services start with better follow-through
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              Residents used to report road damage, water leaks and missed
              garbage collection through scattered channels, with no tracking
              and no deadlines. Nagar Sheba replaces that with one platform
              where every request has an owner, a deadline and a visible
              history.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our principles"
            title="What we stand for"
            description="Trustworthy public services begin with transparency, responsibility and fair treatment."
          />
        </Reveal>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <StaggerItem key={value.title} className="h-full">
              <ImageCard {...value} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Who uses it"
              title="Three roles, one workflow"
              description="Each role sees what it needs, with permissions enforced on both the server and the interface."
            />
          </Reveal>

          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {ROLES.map((role) => (
              <StaggerItem key={role.title} className="h-full">
                <ImageCard {...role} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Every request deserves a clear answer
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            From reporting a local issue to reviewing its resolution, Nagar
            Sheba helps citizens and city teams stay informed and accountable.
          </p>
        </Reveal>
      </section>
    </>
  );
}
