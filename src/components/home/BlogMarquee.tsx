import type { CSSProperties } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

function Group({
  posts,
  duration,
  clone = false,
}: {
  posts: BlogPost[];
  duration: number;
  clone?: boolean;
}) {
  return (
    <div
      aria-hidden={clone || undefined}
      inert={clone || undefined}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      className={cn(
        "animate-marquee-reverse flex shrink-0 gap-5 pr-5",
        clone && "marquee-clone",
      )}
    >
      {posts.map((post, index) => (
        <div key={`${post.slug}-${index}`} className="w-72 shrink-0 sm:w-80">
          <BlogCard post={post} />
        </div>
      ))}
    </div>
  );
}

export function BlogMarquee({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return null;
  }

  // Repeat posts until the group contains at least 6 cards.
  const group =
    posts.length >= 6
      ? posts
      : Array.from({ length: Math.ceil(6 / posts.length) }, () => posts).flat();

  const duration = Math.max(group.length * 8, 32);

  return (
    <section
      aria-label="Latest articles"
      className="marquee flex overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <Group posts={group} duration={duration} />
      <Group posts={group} duration={duration} clone />
    </section>
  );
}
