import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_GRID_CLASS } from "./CategoryCard";

export function CategoryCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-2/3" />
        <Skeleton className="mt-4 h-3.5 w-1/2" />
        <Skeleton className="mt-2 h-3.5 w-2/5" />
        <Skeleton className="mt-4 h-9 w-full" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div aria-busy="true">
      <span className="sr-only">Loading services</span>
      <div className={CATEGORY_GRID_CLASS}>
        {Array.from({ length: count }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
