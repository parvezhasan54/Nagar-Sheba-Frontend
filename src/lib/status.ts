export type StatusMeta = { label: string; className: string };

const primary =
  "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary";
const green =
  "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300";
const gray = "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300";
const red = "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300";

export const STATUS_META: Record<string, StatusMeta> = {
  PENDING_PAYMENT: { label: "Pending Payment", className: gray },
  SUBMITTED: { label: "Submitted", className: primary },
  ASSIGNED: { label: "Assigned", className: primary },
  IN_PROGRESS: { label: "In Progress", className: primary },
  RESOLVED: { label: "Resolved", className: green },
  CLOSED: { label: "Closed", className: gray },
  CANCELLED: { label: "Cancelled", className: red },
  PENDING: { label: "Pending", className: gray },
  COMPLETED: { label: "Completed", className: green },
  FAILED: { label: "Failed", className: red },
  REFUNDED: { label: "Refunded", className: gray },
  ACTIVE: { label: "Active", className: green },
  BLOCKED: { label: "Blocked", className: red },
  DELETED: { label: "Deleted", className: red },
};

export const REQUEST_STATUSES = [
  "PENDING_PAYMENT",
  "SUBMITTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
] as const;
