"use client";

import { FileText, Wrench } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import cloudinaryLoader from "@/lib/cloudinary-loader";

type Props = { src?: string; alt: string; paid: boolean };

export function CategoryImage({ src, alt, paid }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const Icon = paid ? FileText : Wrench;
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-muted"
      >
        <Icon className="size-10 text-primary/60" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      loader={cloudinaryLoader}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}