import { MessageSquareText } from "lucide-react";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StarRating } from "@/components/shared/StarRating";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/public.type";

const MIN_CARDS_PER_GROUP = 6;

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-56 w-80 shrink-0 flex-col rounded-xl border bg-background p-6 sm:w-96">
      <StarRating value={t.rating} />

      <blockquote className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-muted-foreground">
        “{t.comment}”
      </blockquote>

      <figcaption className="mt-4 border-t pt-3 text-xs">
        <span className="font-medium text-foreground">{t.reviewer}</span>
        <span className="text-muted-foreground">
          {" "}
          · {t.service} · {formatDate(t.createdAt)}
        </span>
      </figcaption>
    </figure>
  );
}

function MarqueeGroup({
  items,
  duration,
  clone = false,
}: {
  items: Testimonial[];
  duration: number;
  clone?: boolean;
}) {
  return (
    <div
      aria-hidden={clone || undefined}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      className={cn(
        "animate-marquee flex shrink-0 gap-5 pr-5",
        clone && "marquee-clone",
      )}
    >
      {items.map((t, i) => (
        <TestimonialCard key={`${t.id}-${i}`} t={t} />
      ))}
    </div>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  // Repeat short lists so one group always fills the screen
  const group =
    items.length === 0 || items.length >= MIN_CARDS_PER_GROUP
      ? items
      : Array.from(
          { length: Math.ceil(MIN_CARDS_PER_GROUP / items.length) },
          () => items,
        ).flat();

  const duration = Math.max(group.length * 8, 30);

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
          <div className="marquee flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <MarqueeGroup items={group} duration={duration} />
            <MarqueeGroup items={group} duration={duration} clone />
          </div>
        )}
      </section>
    </>
  );
}
