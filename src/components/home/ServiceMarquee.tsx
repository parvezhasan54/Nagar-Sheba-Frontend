
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category.type";
import { CategoryCard } from "./CategoryCard";

function Group({
  items,
  duration,
  clone = false,
}: {
  items: Category[];
  duration: number;
  clone?: boolean;
}) {
  return (
    <div
      aria-hidden={clone || undefined}
      inert={clone || undefined}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      className={cn(
        "animate-marquee flex shrink-0 gap-5 pr-5",
        clone && "marquee-clone",
      )}
    >
      {items.map((category) => (
        <div key={category.id} className="w-72 shrink-0 sm:w-80">
          <CategoryCard category={category} />
        </div>
      ))}
    </div>
  );
}

export function ServiceMarquee({ items }: { items: Category[] }) {
  // Keep scrolling speed readable regardless of the number of services.
  const duration = Math.max(items.length * 6, 30);

  return (
    <section
      aria-label="Popular city services"
      className="marquee flex overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <Group items={items} duration={duration} />
      <Group items={items} duration={duration} clone />
    </section>
  );
}
