import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...pages, ...posts];
}
