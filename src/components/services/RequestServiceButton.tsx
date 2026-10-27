"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/hook";
import { cn } from "@/lib/utils";

export function RequestServiceButton({ categoryId }: { categoryId: string }) {
  const { data: profile } = useProfile();

  if (profile && profile.role !== "CITIZEN") {
    return (
      <p className="rounded-lg border bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground">
        Only citizen accounts can file requests.
      </p>
    );
  }

  return (
    <Link
      href={`/citizen/requests/new?category=${encodeURIComponent(categoryId)}`}
      className={cn(buttonVariants(), "h-11 w-full text-sm font-semibold")}
    >
      Request this service
    </Link>
  );
}