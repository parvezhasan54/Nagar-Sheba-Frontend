import { Building2, Tags } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BlogPreview } from "@/components/home/BlogPreview";
import {
  CATEGORY_GRID_CLASS,
  CategoryCard,
} from "@/components/home/CategoryCard";
import { CtaBanner } from "@/components/home/CtaBanner";
import { FaqPreview } from "@/components/home/FaqPreview";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Newsletter } from "@/components/home/Newsletter";
import { ResolvedIssues } from "@/components/home/ResolvedIssues";
import { StatsStrip } from "@/components/home/StatsStrip";
import { Testimonials } from "@/components/home/Testimonials";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  getPublicCategories,
  getPublicDepartments,
  getPublicStats,
  getResolvedIssues,
  getTestimonials,
} from "@/lib/server-api";

export const metadata: Metadata = {
  title: { absolute: "Nagar Sheba | Smart City Services for Citizens" },
  description:
    "Report civic issues, pay service fees and track every request from submission to resolution.",
  openGraph: {
    title: "Nagar Sheba | Smart City Services for Citizens",
    description:
      "Report civic issues, pay service fees and track every request.",
    type: "website",
  },
};

function Section({
  muted,
  children,
}: {
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={muted ? "border-y bg-muted/40" : undefined}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [stats, categories, departments, resolved, testimonials] =
    await Promise.all([
      getPublicStats(),
      getPublicCategories(),
      getPublicDepartments(),
      getResolvedIssues(),
      getTestimonials(),
    ]);

  return (
    <>
      <Hero />
      <StatsStrip stats={stats} />
      <HowItWorks />

      <Section>
        <Features />
      </Section>

      <Section muted>
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Popular city services"
            description="Free complaints and paid permits, each with a clear resolution time."
          />
        </Reveal>

        <div className="mt-10">
          {categories.length === 0 ? (
            <EmptyState
              icon={Tags}
              title="Services are loading"
              description="The service list could not be loaded. Please refresh in a moment."
            />
          ) : (
            <>
              <Stagger className={CATEGORY_GRID_CLASS}>
                {categories.slice(0, 8).map((category) => (
                  <StaggerItem key={category.id} className="h-full">
                    <CategoryCard category={category} />
                  </StaggerItem>
                ))}
              </Stagger>

              <div className="mt-8 text-center">
                <Link
                  href="/services"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View all services
                </Link>
              </div>
            </>
          )}
        </div>
      </Section>

      <Section>
        <ResolvedIssues issues={resolved} />
      </Section>

      <Section muted>
        <Testimonials items={testimonials} />
      </Section>

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Departments"
            title="Who handles your request"
          />
        </Reveal>

        <div className="mt-10">
          {departments.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="Departments are loading"
              description="Please refresh in a moment."
            />
          ) : (
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {departments.map((department) => {
                return (
                  <StaggerItem key={department.id} className="h-full">
                    <Link
                      href={`/services?department=${encodeURIComponent(department.id)}`}
                      className="group block h-full overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                        <Image
                          src={department.imageUrl ?? ""}
                          alt={department.name}
                          fill
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                        <div className="absolute bottom-3 left-4 flex size-10 items-center justify-center rounded-lg border border-white/30 bg-white/90 text-primary shadow-sm backdrop-blur-sm">
                          <Building2 className="size-5" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-sm font-semibold">
                          {department.name}
                        </h3>

                        {department.description && (
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {department.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </div>
      </Section>

      <Section muted>
        <BlogPreview />
      </Section>

      <Section>
        <FaqPreview />
      </Section>

      <Section muted>
        <Newsletter />
      </Section>

      <CtaBanner />
    </>
  );
}
