"use client";

import { ScrollText, SearchX } from "lucide-react";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuditLogs, useUrlState } from "@/hook";
import { formatDateTime, toEnumLabel } from "@/lib/format";

const ENTITY_OPTIONS = [
  { value: "all", label: "All entities" },
  ...["User", "Department", "Category", "ServiceRequest", "Payment"].map(
    (entity) => ({ value: entity, label: entity }),
  ),
];

const hasValue = (value: unknown) => value !== null && value !== undefined;

export function AuditLogList() {
  const { get, getNumber, setParams } = useUrlState();
  const page = getNumber("page", 1);
  const entityType = get("entityType", "all");
  const action = get("action");
  const from = get("from");
  const to = get("to");

  const hasFilters =
    entityType !== "all" || Boolean(action) || Boolean(from) || Boolean(to);

  const { data, isLoading, isError, error, refetch } = useAuditLogs({
    page,
    limit: 15,
    entityType: entityType === "all" ? undefined : entityType,
    action: action || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  const logs = data?.data ?? [];

  const clearFilters = () =>
    setParams({
      entityType: null,
      action: null,
      from: null,
      to: null,
      page: null,
    });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <FilterSelect
          label="Entity"
          value={entityType}
          options={ENTITY_OPTIONS}
          onChange={(value) =>
            setParams({
              entityType: value === "all" ? null : value,
              page: null,
            })
          }
        />

        <SearchInput
          paramKey="action"
          placeholder="Action, e.g. USER_BLOCKED"
        />

        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          From
          <input
            type="date"
            value={from}
            onChange={(event) =>
              setParams({ from: event.target.value || null, page: null })
            }
            className="h-9 rounded-md border border-input bg-background px-2 text-xs text-foreground"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          To
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(event) =>
              setParams({ to: event.target.value || null, page: null })
            }
            className="h-9 rounded-md border border-input bg-background px-2 text-xs text-foreground"
          />
        </label>

        {hasFilters && (
          <Button variant="ghost" className="h-9" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <RequestListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={hasFilters ? SearchX : ScrollText}
          title="No audit entries"
          description="Administrative changes are recorded here."
        />
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">When</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead className="pr-4">Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="align-top">
                    <TableCell className="px-4">
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                    <TableCell>{log.actor.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {toEnumLabel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.entityType}
                      <p className="font-mono text-xs text-muted-foreground">
                        {log.entityId.slice(0, 8)}
                      </p>
                    </TableCell>
                    <TableCell className="pr-4">
                      {hasValue(log.previousValue) || hasValue(log.newValue) ? (
                        <details>
                          <summary className="cursor-pointer text-primary">
                            View
                          </summary>
                          <pre className="mt-2 max-w-72 overflow-x-auto rounded-md bg-muted p-2 text-xs whitespace-pre-wrap">
                            {JSON.stringify(
                              {
                                before: log.previousValue,
                                after: log.newValue,
                              },
                              null,
                              2,
                            )}
                          </pre>
                        </details>
                      ) : (
                        "—"
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
    </div>
  );
}
