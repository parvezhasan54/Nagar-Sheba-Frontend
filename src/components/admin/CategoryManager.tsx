"use client";

import { useForm } from "@tanstack/react-form";
import { Pencil, Plus, Power, Tags, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DepartmentFilter } from "@/components/request/DepartmentFilter";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useDepartments,
  useUpdateCategory,
  useUrlState,
} from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrency, formatSla } from "@/lib/format";
import type { Category, FeeType } from "@/types/category.type";
import { CategoryZodSchema } from "@/validation";
import { Textarea } from "../ui/textarea";

type Editing = Category | "new" | null;

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "deleted", label: "Deleted" },
];

const FEE_FILTER = [
  { value: "all", label: "Free and paid" },
  { value: "FREE", label: "Free only" },
  { value: "PAID", label: "Paid only" },
];

const FEE_OPTIONS = [
  { value: "FREE", label: "Free" },
  { value: "PAID", label: "Paid" },
];

function CategoryForm({
  category,
  onDone,
}: {
  category?: Category;
  onDone: () => void;
}) {
  const { data: depts } = useDepartments({ limit: 100 });
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const isPending = create.isPending || update.isPending;

  const handlers = {
    onSuccess: () => {
      toast.success(category ? "Category updated" : "Category created");
      onDone();
    },
    onError: (error: unknown) =>
      toast.error("Could not save category", {
        description: getApiErrorMessage(error),
      }),
  };

  const form = useForm({
    defaultValues: {
      departmentId: category?.departmentId ?? "",
      name: category?.name ?? "",
      description: category?.description ?? "",
      images: category?.images?.join("\n") ?? "",
      feeType: (category?.feeType ?? "FREE") as FeeType,
      feeAmount: category?.feeAmount ? String(Number(category.feeAmount)) : "",
      slaHours: category ? String(category.slaHours) : "",
    },
    validators: { onChange: CategoryZodSchema, onSubmit: CategoryZodSchema },
    onSubmit: ({ value }) => {
      const paid = value.feeType === "PAID";
      const base = {
        name: value.name.trim(),
        description: value.description.trim() || undefined,
        images: value.images
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        feeType: value.feeType,
        feeAmount: paid ? Number(value.feeAmount) : undefined,
        slaHours: Number(value.slaHours),
      };

      if (category) {
        update.mutate(
          {
            id: category.id,
            payload: { ...base, description: value.description.trim() },
          },
          handlers,
        );
      } else {
        create.mutate({ departmentId: value.departmentId, ...base }, handlers);
      }
    },
  });

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {!category && (
        <form.Field name="departmentId">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <FieldLabel htmlFor={field.name}>Department</FieldLabel>
                <SelectField
                  id={field.name}
                  value={field.state.value}
                  placeholder="Choose department"
                  aria-invalid={isInvalid}
                  options={(depts?.data ?? []).map((d) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                  onValueChange={field.handleChange}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      )}

      <form.Field name="name">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>Service name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-10"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="description">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                id={field.name}
                rows={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="images">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>
                Image URLs (one per line)
              </FieldLabel>
              <Textarea
                id={field.name}
                rows={3}
                placeholder="https://res.cloudinary.com/..."
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="feeType">
          {(field) => (
            <Field className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>Fee type</FieldLabel>
              <SelectField
                id={field.name}
                value={field.state.value}
                options={FEE_OPTIONS}
                onValueChange={(v) => field.handleChange(v as FeeType)}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="slaHours">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <FieldLabel htmlFor={field.name}>SLA (hours)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  inputMode="numeric"
                  placeholder="72"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-10"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </div>

      <form.Subscribe selector={(s) => s.values.feeType}>
        {(feeType) =>
          feeType === "PAID" && (
            <form.Field name="feeAmount">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name}>Fee (BDT)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      inputMode="decimal"
                      placeholder="1500"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          )
        }
      </form.Subscribe>

      <Button type="submit" disabled={isPending} className="h-10 w-full">
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" /> Saving...
          </>
        ) : category ? (
          "Save changes"
        ) : (
          "Create category"
        )}
      </Button>
    </form>
  );
}

export function CategoryManager() {
  const { get, getNumber, setParams } = useUrlState();
  const page = getNumber("page", 1);
  const department = get("department", "all");
  const search = get("search").trim();
  const status = get("status", "all");
  const fee = get("fee", "all");

  const hasFilters =
    !!search || status !== "all" || fee !== "all" || department !== "all";

  const { data, isLoading, isError, error, refetch } = useCategories({
    page,
    limit: 10,
    departmentId: department === "all" ? undefined : department,
    includeInactive: true,
    search: search || undefined,
    status:
      status === "all"
        ? undefined
        : (status as "active" | "inactive" | "deleted"),
    feeType: fee === "all" ? undefined : (fee as FeeType),
  });
  const { mutate: toggle, isPending: toggling } = useUpdateCategory();
  const { mutate: remove, isPending: deleting } = useDeleteCategory();

  const [editing, setEditing] = useState<Editing>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const categories = data?.data ?? [];

  const toggleActive = (c: Category) =>
    toggle(
      { id: c.id, payload: { isActive: !c.isActive } },
      {
        onSuccess: () =>
          toast.success(
            c.isActive ? "Category deactivated" : "Category activated",
          ),
        onError: (err) =>
          toast.error("Could not update category", {
            description: getApiErrorMessage(err),
          }),
      },
    );

  const confirmDelete = () => {
    if (!toDelete) return;
    remove(toDelete.id, {
      onSuccess: () => {
        toast.success("Category deleted");
        setToDelete(null);
      },
      onError: (err) =>
        toast.error("Could not delete category", {
          description: getApiErrorMessage(err),
        }),
    });
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <SearchInput placeholder="Search services..." paramKey="search" />
        <DepartmentFilter />
        <FilterSelect
          label="Fee"
          value={fee}
          options={FEE_FILTER}
          onChange={(v) => setParams({ fee: v })}
        />
        <FilterSelect
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(v) => setParams({ status: v })}
        />
        {hasFilters && (
          <Button
            variant="ghost"
            className="h-9"
            onClick={() =>
              setParams({
                search: null,
                status: null,
                fee: null,
                department: null,
                page: null,
              })
            }
          >
            Clear
          </Button>
        )}
        <Button
          className="h-9 gap-2 sm:ml-auto"
          onClick={() => setEditing("new")}
        >
          <Plus className="size-4" />
          New category
        </Button>
      </div>
      {isLoading ? (
        <RequestListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title={
            hasFilters
              ? "No categories match your filters"
              : "No categories found"
          }
          description={
            hasFilters
              ? "Try changing your search or filter criteria."
              : "Create a category so citizens can file requests."
          }
        />
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Service</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="px-4 font-medium">{c.name}</TableCell>
                    <TableCell>{c.department?.name ?? "—"}</TableCell>
                    <TableCell>
                      {c.feeType === "PAID"
                        ? formatCurrency(c.feeAmount)
                        : "Free"}
                    </TableCell>
                    <TableCell>{formatSla(c.slaHours)}</TableCell>
                    <TableCell>
                      {c.deletedAt ? (
                        <Badge variant="destructive">Deleted</Badge>
                      ) : c.isActive ? (
                        <Badge variant="secondary">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      {!c.deletedAt && (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${c.name}`}
                            onClick={() => setEditing(c)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={toggling}
                            aria-label={
                              c.isActive
                                ? `Deactivate ${c.name}`
                                : `Activate ${c.name}`
                            }
                            onClick={() => toggleActive(c)}
                          >
                            <Power />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete ${c.name}`}
                            onClick={() => setToDelete(c)}
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination meta={data?.meta} />
        </>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing === "new" ? "New category" : "Edit category"}
            </DialogTitle>
            <DialogDescription>
              Fee and SLA are shown to citizens before they file.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <CategoryForm
              category={editing === "new" ? undefined : editing}
              onDone={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete?.name}?`}
        description="The category is hidden from citizens. Existing requests keep their history."
        confirmLabel="Delete"
        destructive
        pending={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
