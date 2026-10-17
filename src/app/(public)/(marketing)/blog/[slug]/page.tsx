import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { CATEGORY_GRID_CLASS } from "@/components/home/CategoryCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPost, POSTS } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Nagar Sheba`,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> All articles
        </Link>

        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">
          {post.title}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {formatDate(post.date)} · {post.readMinutes} min read
        </p>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-8 space-y-8">
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg font-semibold">{s.heading}</h2>
              {s.body.map((p) => (
                <p
                  key={p}
                  className="mt-2 text-sm leading-7 text-muted-foreground"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-xl border bg-card p-6 text-center">
          <p className="text-sm font-medium">Ready to report an issue?</p>
          <Link
            href="/services"
            className={cn(
              buttonVariants(),
              "mt-3 h-10 px-5 text-sm font-semibold",
            )}
          >
            Browse services
          </Link>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more" className="mt-14">
          <h2 id="more" className="mb-5 text-lg font-semibold">
            More articles
          </h2>
          <div className={CATEGORY_GRID_CLASS}>
            {more.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
