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
      // The clone only exists for the seamless loop: keep it out of
      // the tab order and away from screen readers.
      inert={clone || undefined}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      className={cn(
        "animate-marquee-reverse flex shrink-0 gap-5 pr-5",
        clone && "marquee-clone",
      )}
    >
      {posts.map((post) => (
        <div key={post.slug} className="w-72 shrink-0 sm:w-80">
          <BlogCard post={post} />
        </div>
      ))}
    </div>
  );
}

export function BlogMarquee({ posts }: { posts: BlogPost[] }) {
  // You only have 4 posts, so repeat them until one group fills a wide screen
  const group =
    posts.length >= 6
      ? posts
      : Array.from({ length: Math.ceil(6 / posts.length) }, () => posts).flat();

  const duration = Math.max(posts.length * 8, 32);

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