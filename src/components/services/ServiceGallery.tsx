"use client";

import { useState } from "react";
import { CategoryImage } from "@/components/home/CategoryImage";
import { cn } from "@/lib/utils";

type Props = { images: string[]; name: string; paid: boolean };

export function ServiceGallery({ images, name, paid }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
        <CategoryImage
          key={current ?? "none"}
          src={current}
          alt={name}
          paid={paid}
        />
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2" aria-label="Service images">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-pressed={i === active}
                className={cn(
                  "relative block aspect-video w-full overflow-hidden rounded-lg border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  i === active
                    ? "ring-2 ring-primary"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <CategoryImage src={src} alt={`${name} ${i + 1}`} paid={paid} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
