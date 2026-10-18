import type { ReactNode } from "react";

export function Section({
  muted,
  children,
}: {
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={muted ? "border-y bg-muted/40" : undefined}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
