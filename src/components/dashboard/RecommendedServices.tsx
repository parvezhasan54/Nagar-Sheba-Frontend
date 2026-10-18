"use client";

import { Sparkles } from "lucide-react";
import { CategoryCard } from "@/components/home/CategoryCard";
import { CategoryGridSkeleton } from "@/components/home/CategoryCardSkeleton";
import { useRecommendedCategories } from "@/hook";

const GRID = "grid gap-5 sm:grid-cols-2 xl:grid-cols-4";

export function RecommendedServices() {
  const { data, isLoading, isError } = useRecommendedCategories();

  // Recommendations are a bonus: never show an error box for them.
  if (isError) return null;

  const items = data?.data.items ?? [];
  if (!isLoading && items.length === 0) return null;

  return (
    <section aria-labelledby="recommended" className="mb-6">
      <div className="mb-4">
        <h2
          id="recommended"
          className="flex items-center gap-2 font-heading text-lg font-semibold"
        >
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          Recommended for you
        </h2>
        {data && (
          <p className="text-sm text-muted-foreground">{data.data.reason}</p>
        )}
      </div>

      {isLoading ? (
        <CategoryGridSkeleton count={4} />
      ) : (
        <div className={GRID}>
          {items.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}