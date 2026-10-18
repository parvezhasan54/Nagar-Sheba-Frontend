import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";
import { getPublicCategories } from "@/lib/server-api";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Re-generate hourly so newly created services appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [
    "",
    "/services",
    "/about-us",
    "/faq",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));

  const posts = POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  // Fail-soft: getPublicCategories() returns [] if the backend is unreachable.
  const categories = await getPublicCategories();
  const services = categories.map((c) => ({
    url: `${base}/services/${c.id}`,
    lastModified: new Date(c.createdAt),
  }));

  return [...pages, ...posts, ...services];
}
