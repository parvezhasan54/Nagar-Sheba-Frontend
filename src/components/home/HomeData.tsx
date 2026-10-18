import { Building2, Flame, Tags } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  getPublicCategories,
  getPublicDepartments,
  getPublicStats,
  getResolvedIssues,
  getTestimonials,
  getTrendingCategories,
} from "@/lib/server-api";
import { CATEGORY_GRID_CLASS, CategoryCard } from "./CategoryCard";
import { ResolvedIssues } from "./ResolvedIssues";
import { StatsStrip } from "./StatsStrip";
import { Testimonials } from "./Testimonials";
import { ServiceMarquee } from "./ServiceMarquee";

export async function StatsData() {
  return <StatsStrip stats={await getPublicStats()} />;
}

export async function ResolvedData() {
  return <ResolvedIssues issues={await getResolvedIssues()} />;
}

export async function TestimonialsData() {
  return <Testimonials items={await getTestimonials()} />;
}


export async function ServicesData() {
  const categories = await getPublicCategories();

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="Services are loading"
        description="The service list could not be loaded. Please refresh in a moment."
      />
    );
  }

  return (
    <>
      <ServiceMarquee items={categories.slice(0, 12)} />
      <div className="mt-8 text-center">
        <Link
          href="/services"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View all services
        </Link>
      </div>
    </>
  );
}


export async function DepartmentsData() {
  const departments = await getPublicDepartments();

  if (departments.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="Departments are loading"
        description="Please refresh in a moment."
      />
    );
  }

  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {departments.map((d) => (
        <StaggerItem key={d.id} className="h-full">
          <Link
            href={`/services?department=${encodeURIComponent(d.id)}`}
            className="group relative block aspect-[4/3] overflow-hidden rounded-xl border bg-muted outline-none transition-shadow duration-300 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {d.imageUrl ? (
              <Image
                src={d.imageUrl}
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/10 to-muted"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 text-white transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0 translate-y-6 [@media(hover:none)]:translate-y-0">
              <Building2 className="mb-2 size-5" aria-hidden="true" />
              <h3 className="text-base font-semibold">{d.name}</h3>
              {d.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
                  {d.description}
                </p>
              )}
            </div>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export async function TrendingData() {
  const categories = await getTrendingCategories();

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="No trending services yet"
        description="Popular services will appear here as requests come in."
      />
    );
  }

    return (
    <Stagger className={CATEGORY_GRID_CLASS}>
      {categories.map((category, i) => (
        <StaggerItem key={category.id} className="h-full">
          <div className="relative h-full">
            <span className="absolute top-3 left-3 z-10 flex h-6 items-center gap-1 rounded-full bg-background/90 px-2.5 text-xs font-bold text-primary shadow-sm ring-1 ring-primary/20 backdrop-blur">
              <Flame className="size-3.5" aria-hidden="true" />#{i + 1}
              {category.requestCount ? ` · ${category.requestCount}` : ""}
            </span>
            <CategoryCard category={category} />
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}