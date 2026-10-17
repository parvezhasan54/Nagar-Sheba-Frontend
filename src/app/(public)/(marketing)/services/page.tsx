import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryGridSkeleton } from "@/components/home/CategoryCardSkeleton";
import { ServiceExplorer } from "@/components/services/ServiceExplorer";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Search every city service by department, fee and resolution time.",
  openGraph: {
    title: "City Services | Nagar Sheba",
    description: "Browse every city service with fees and resolution times.",
  },
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="City services"
        description="Search and filter services. Fees and resolution times are shown up front."
      />
      <Suspense fallback={<CategoryGridSkeleton />}>
        <ServiceExplorer />
      </Suspense>
    </div>
  );
}
