import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { POSTS } from "@/lib/blog";
import { CATEGORY_GRID_CLASS } from "./CategoryCard";

export function BlogPreview() {
  return (
    <>
      <Reveal>
        <SectionHeading
          eyebrow="From the blog"
          title="Guides to get things resolved"
          description="Practical tips on requests, deadlines, payments and reopening."
        />
      </Reveal>

      <Stagger className={`mt-10 ${CATEGORY_GRID_CLASS}`}>
        {POSTS.slice(0, 4).map((post) => (
          <StaggerItem key={post.slug} className="h-full">
            <BlogCard post={post} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Read all articles
        </Link>
      </div>
    </>
  );
}