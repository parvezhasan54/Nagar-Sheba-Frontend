import { Building2, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency, formatSla } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category.type";
import { CategoryImage } from "./CategoryImage";

/** One grid definition for cards and skeletons: 4 per row on desktop. */
export const CATEGORY_GRID_CLASS = "grid gap-5 sm:grid-cols-2 lg:grid-cols-4";

export function CategoryCard({ category }: { category: Category }) {
  const isPaid = category.feeType === "PAID";
  const department = category.department?.name ?? "City service";
  const description =
    category.description?.trim() || `Handled by the ${department} department.`;
  const href = `/services/${category.id}`;
  const image = category.images?.[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <CategoryImage
          key={image ?? "none"}
          src={image}
          alt={category.name}
          paid={isPaid}
        />
        <Badge
          variant={isPaid ? "default" : "secondary"}
          className="absolute top-3 right-3 h-6 px-2.5 text-xs shadow-sm"
        >
          {isPaid ? formatCurrency(category.feeAmount) : "Free"}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-semibold leading-snug">
          <Link href={href} className="hover:text-primary">
            {category.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 h-10 text-sm leading-5 text-muted-foreground">
          {description}
        </p>

        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Building2 className="size-3.5 shrink-0" />
            <span className="truncate">{department}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" />
            Resolved within {formatSla(category.slaHours)}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={href}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9 w-full text-sm font-medium",
            )}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
