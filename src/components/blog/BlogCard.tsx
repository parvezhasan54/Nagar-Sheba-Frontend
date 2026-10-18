import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function BlogCard({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <Link
        href={href}
        aria-label={`Read ${post.title}`}
        className="relative block aspect-video overflow-hidden bg-muted"
      >
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 h-6 px-2.5 text-xs shadow-sm"
        >
          {post.category}
        </Badge>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-11 text-base font-semibold leading-snug">
          <Link href={href} className="transition-colors hover:text-primary">
            {post.title}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {post.excerpt}
        </p>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5 shrink-0" aria-hidden="true" />
          {formatDate(post.date)} · {post.readMinutes} min read
        </p>

        <div className="mt-auto pt-4">
          <Link
            href={href}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9 w-full text-sm font-medium",
            )}
          >
            Read article
          </Link>
        </div>
      </div>
    </article>
  );
}
