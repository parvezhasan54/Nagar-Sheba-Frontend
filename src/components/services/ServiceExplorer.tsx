"use client";

import { SearchX, Tags } from "lucide-react";
import type { getCategories } from "@/api";
import {
  CATEGORY_GRID_CLASS,
  CategoryCard,
} from "@/components/home/CategoryCard";
import { CategoryGridSkeleton } from "@/components/home/CategoryCardSkeleton";
import { DepartmentFilter } from "@/components/request/DepartmentFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { useCategories, useUrlState } from "@/hook";
import { cn } from "@/lib/utils";

type CategoryParams = NonNullable<Parameters<typeof getCategories>[0]>;
type SortBy = NonNullable<CategoryParams["sortBy"]>;

const PAGE_SIZE = 8;
const DEFAULT_SORT = "createdAt:desc";

const FEE_OPTIONS = [
  { value: "all", label: "Free and paid" },
  { value: "FREE", label: "Free only" },
  { value: "PAID", label: "Paid only" },
];

const SLA_OPTIONS = [
  { value: "all", label: "Any time" },
  { value: "24", label: "Within 24 hours" },
  { value: "72", label: "Within 3 days" },
  { value: "168", label: "Within 7 days" },
];

const SORT_OPTIONS = [
  { value: DEFAULT_SORT, label: "Newest first" },
  { value: "name:asc", label: "Name A-Z" },
  { value: "name:desc", label: "Name Z-A" },
  { value: "slaHours:asc", label: "Fastest resolution" },
  { value: "feeAmount:asc", label: "Fee: low to high" },
  { value: "feeAmount:desc", label: "Fee: high to low" },
];

const RATING_OPTIONS = [
  { value: "all", label: "Any rating" },
  { value: "4", label: "4 stars and up" },
  { value: "3", label: "3 stars and up" },
];

export function ServiceExplorer() {
  const { get, getNumber, setParams } = useUrlState();

  const page = getNumber("page", 1);
  const search = get("search").trim();
  const department = get("department", "all");
  const fee = get("fee", "all");
  const sla = get("sla", "all");
  const rating = get("rating", "all");
  const rawSort = get("sort", DEFAULT_SORT);
  const sort = SORT_OPTIONS.some((option) => option.value === rawSort)
    ? rawSort
    : DEFAULT_SORT;

  const [sortBy, sortOrder] = sort.split(":") as [SortBy, "asc" | "desc"];
  const maxSla = Number(sla);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useCategories({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      departmentId: department === "all" ? undefined : department,
      feeType: fee === "FREE" || fee === "PAID" ? fee : undefined,
      maxSla: Number.isFinite(maxSla) && maxSla > 0 ? maxSla : undefined,
      minRating: rating === "all" ? undefined : Number(rating),
      sortBy,
      sortOrder,
    });

  const categories = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const hasFilters =
    !!search ||
    department !== "all" ||
    fee !== "all" ||
    sla !== "all" ||
    rating !== "all" ||
    sort !== DEFAULT_SORT;

  const clearFilters = () => {
    setParams({
      search: null,
      department: null,
      fee: null,
      sla: null,
      rating: null,
      sort: null,
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <SearchInput
          paramKey="search"
          placeholder="Search services or departments..."
        />

        <DepartmentFilter />

        <FilterSelect
          label="Fee"
          value={fee}
          options={FEE_OPTIONS}
          onChange={(value) => setParams({ fee: value })}
        />

        <FilterSelect
          label="Resolution time"
          value={sla}
          options={SLA_OPTIONS}
          onChange={(value) => setParams({ sla: value })}
        />

        <FilterSelect
          label="Rating"
          value={rating}
          options={RATING_OPTIONS}
          onChange={(value) => setParams({ rating: value })}
        />

        <FilterSelect
          label="Sort by"
          value={sort}
          options={SORT_OPTIONS}
          onChange={(value) => setParams({ sort: value })}
        />

        {hasFilters && (
          <Button variant="ghost" className="h-9" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <CategoryGridSkeleton count={PAGE_SIZE} />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={hasFilters ? SearchX : Tags}
          title={
            hasFilters ? "No services match your filters" : "No services yet"
          }
          description={
            hasFilters
              ? "Try a different search term or clear a filter."
              : "Services will appear here once they are published."
          }
        />
      ) : (
        <>
          <p className="mb-3 text-xs text-muted-foreground" aria-live="polite">
            {total} service{total === 1 ? "" : "s"} found
          </p>

          <div
            aria-busy={isFetching}
            className={cn(
              CATEGORY_GRID_CLASS,
              "transition-opacity",
              isFetching && "opacity-60",
            )}
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <Pagination meta={data?.meta} />
        </>
      )}
    </div>
  );
}
