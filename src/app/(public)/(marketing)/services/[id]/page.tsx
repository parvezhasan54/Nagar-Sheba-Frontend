import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_GRID_CLASS,
  CategoryCard,
} from "@/components/home/CategoryCard";
import { ServiceGallery } from "@/components/services/ServiceGallery";
import { ServiceReviews } from "@/components/services/ServiceReviews";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatSla } from "@/lib/format";
import {
  getCategoryReviews,
  getPublicCategories,
  getPublicCategory,
} from "@/lib/server-api";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getPublicCategories();
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await getPublicCategory(id);
  if (!category) return { title: "Service not found" };

  const description =
    category.description?.trim() ||
    `${category.name} (${category.department?.name ?? "City service"}). Resolved within ${formatSla(category.slaHours)}.`;
  const image = category.images?.[0];

  return {
    title: category.name,
    description,
    openGraph: {
      title: `${category.name} | Nagar Sheba`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

const STEPS = [
  "File the request with details, location and photos.",
  "Pay the fee online if the service is paid.",
  "The department assigns a staff member and the deadline starts.",
  "Track every update, then reopen within 3 days or rate the result.",
];

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const category = await getPublicCategory(id);
  if (!category) notFound();

  const [reviews, all] = await Promise.all([
    getCategoryReviews(id),
    getPublicCategories(),
  ]);

  const related = all
    .filter((c) => c.id !== category.id)
    .sort(
      (a, b) =>
        Number(b.departmentId === category.departmentId) -
        Number(a.departmentId === category.departmentId),
    )
    .slice(0, 4);

  const paid = category.feeType === "PAID";
  const department = category.department?.name ?? "City service";
  const overview =
    category.description?.trim() ||
    `Request this service from the ${department} department and track it until it is resolved.`;

  const info: [string, string][] = [
    ["Department", department],
    ["Service type", paid ? "Paid permit" : "Free complaint"],
    ["Fee", paid ? formatCurrency(category.feeAmount) : "No fee"],
    ["Resolution time", formatSla(category.slaHours)],
    ["Reopen window", "3 days after resolution"],
    [
      "Cancellation",
      paid ? "Until work starts, with refund" : "Until work starts",
    ],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All services
      </Link>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <ServiceGallery
            images={category.images ?? []}
            name={category.name}
            paid={paid}
          />

          <section aria-labelledby="overview">
            <h2 id="overview" className="mb-3 text-lg font-semibold">
              Overview
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {overview}
            </p>
            <ol className="mt-5 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-start gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="reviews">
            <h2 id="reviews" className="mb-3 text-lg font-semibold">
              Ratings and reviews
            </h2>
            <ServiceReviews data={reviews} />
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                {department}
              </p>
              <CardTitle className="text-xl">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={paid ? "default" : "secondary"}
                  className="h-6 px-2.5 text-xs"
                >
                  {paid ? formatCurrency(category.feeAmount) : "Free"}
                </Badge>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> {formatSla(category.slaHours)}
                </span>
              </div>
              <Link
                href={`/citizen/requests/new?category=${category.id}`}
                className={cn(
                  buttonVariants(),
                  "h-11 w-full text-sm font-semibold",
                )}
              >
                Request this service
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y text-sm">
                {info.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 py-2.5"
                  >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-14">
          <h2 id="related" className="mb-5 text-lg font-semibold">
            Related services
          </h2>
          <div className={CATEGORY_GRID_CLASS}>
            {related.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
