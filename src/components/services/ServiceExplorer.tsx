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

export function ServiceExplorer() {
  const { get, getNumber, setParams } = useUrlState();

  const page = getNumber("page", 1);
  const search = get("search").trim();
  const department = get("department", "all");
  const fee = get("fee", "all");
  const sla = get("sla", "all");
  const rawSort = get("sort", DEFAULT_SORT);
  const sort = SORT_OPTIONS.some((o) => o.value === rawSort)
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
    sort !== DEFAULT_SORT;

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
          onChange={(v) => setParams({ fee: v })}
        />
        <FilterSelect
          label="Resolution time"
          value={sla}
          options={SLA_OPTIONS}
          onChange={(v) => setParams({ sla: v })}
        />
        <FilterSelect
          label="Sort by"
          value={sort}
          options={SORT_OPTIONS}
          onChange={(v) => setParams({ sort: v })}
        />
        {hasFilters && (
          <Button
            variant="ghost"
            className="h-9"
            onClick={() =>
              setParams({
                search: null,
                department: null,
                fee: null,
                sla: null,
                sort: null,
              })
            }
          >
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
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
          <Pagination meta={data?.meta} />
        </>
      )}
    </div>
  );
}
