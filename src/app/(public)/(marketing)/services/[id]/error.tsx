"use client";
import { ErrorState } from "@/components/shared/ErrorState";

export default function ServiceError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <ErrorState
        error={
          new Error("The server is waking up. Please try again in a moment.")
        }
        onRetry={reset}
      />
    </div>
  );
}
