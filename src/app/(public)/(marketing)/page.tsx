
import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogPreview } from "@/components/home/BlogPreview";
import { CategoryCardSkeleton, CategoryGridSkeleton } from "@/components/home/CategoryCardSkeleton";
import { CtaBanner } from "@/components/home/CtaBanner";
import { FaqPreview } from "@/components/home/FaqPreview";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import {
  DepartmentsData,
  ResolvedData,
  ServicesData,
  StatsData,
  TestimonialsData,
  TrendingData,
} from "@/components/home/HomeData";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Newsletter } from "@/components/home/Newsletter";
import { Section } from "@/components/home/Section";
import { StatsStrip } from "@/components/home/StatsStrip";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: {
    absolute: "Nagar Sheba | Smart City Services for Citizens",
  },
  description:
    "Report civic issues, pay service fees and track every request from submission to resolution.",
  openGraph: {
    title: "Nagar Sheba | Smart City Services for Citizens",
    description:
      "Report civic issues, pay service fees and track every request.",
    type: "website",
  },
};

const BlockSkeleton = () => (
  <Skeleton className="h-72 w-full rounded-xl" />
);

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={<StatsStrip stats={null} />}>
        <StatsData />
      </Suspense>

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
          <Suspense
  fallback={
    <div className="flex gap-5 overflow-hidden py-3">
      {Array.from({ length: 4 }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
        <div key={i} className="w-72 shrink-0 sm:w-80">
          <CategoryCardSkeleton />
        </div>
      ))}
    </div>
  }
>
  <ServicesData />
</Suspense>
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Trending"
            title="Trending this month"
            description="The services citizens requested most in the last 30 days."
          />
        </Reveal>
        <div className="mt-10">
          <Suspense fallback={<CategoryGridSkeleton count={4} />}>
            <TrendingData />
          </Suspense>
        </div>
      </Section>

      <Section muted>
        <Suspense fallback={<BlockSkeleton />}>
          <ResolvedData />
        </Suspense>
      </Section>

      <Section>
        <Suspense fallback={<BlockSkeleton />}>
          <TestimonialsData />
        </Suspense>
      </Section>

      <Section muted>
        <Reveal>
          <SectionHeading
            eyebrow="Departments"
            title="Who handles your request"
          />
        </Reveal>
        <div className="mt-10">
          <Suspense fallback={<BlockSkeleton />}>
            <DepartmentsData />
          </Suspense>
        </div>
      </Section>

      <Section>
        <BlogPreview />
      </Section>

      <Section muted>
        <FaqPreview />
      </Section>

      <Section>
        <Newsletter />
      </Section>

      <CtaBanner />
    </>
  );
}
