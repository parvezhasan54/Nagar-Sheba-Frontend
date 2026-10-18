
import { MessageSquareText } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StarRating } from "@/components/shared/StarRating";
import { formatDate } from "@/lib/format";
import type { Testimonial } from "@/types/public.type";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <>
      <Reveal>
        <SectionHeading
          eyebrow="Citizen voices"
          title="What residents say"
          description="Ratings and comments left after a request was resolved."
        />
      </Reveal>

      <section aria-label="Citizen reviews" className="mt-10">
        {items.length === 0 ? (
          <EmptyState
            icon={MessageSquareText}
            title="No reviews yet"
            description="Citizens can rate a request once it is resolved."
          />
        ) : (
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
            {items.map((t) => (
              <figure
                key={t.id}
                className="flex w-[85%] shrink-0 snap-start flex-col rounded-xl border bg-background p-6 sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]"
              >
                <StarRating value={t.rating} />

                <blockquote className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                  “{t.comment}”
                </blockquote>

                <figcaption className="mt-4 border-t pt-3 text-xs">
                  <span className="font-medium text-foreground">
                    {t.reviewer}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {t.service} · {formatDate(t.createdAt)}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
