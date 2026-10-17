import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";
import { CATEGORY_GRID_CLASS } from "@/components/home/CategoryCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides on filing requests, service deadlines, payments, refunds and reopening.",
  openGraph: {
    title: "Blog | Nagar Sheba",
    description: "Practical guides for using city services.",
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Blog"
        description="Practical guides to getting your city requests resolved."
      />
      <div className={CATEGORY_GRID_CLASS}>
        {POSTS.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
