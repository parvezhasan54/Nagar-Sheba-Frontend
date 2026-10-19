import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { POSTS } from "@/lib/blog";
import { BlogMarquee } from "./BlogMarquee";

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

      <div className="mt-10">
        <BlogMarquee posts={POSTS} />
      </div>

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