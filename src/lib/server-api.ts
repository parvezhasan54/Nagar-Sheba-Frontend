import type { ApiResponse } from "@/types/api.type";
import type { Category, CategoryReviews } from "@/types/category.type";
import type { Department } from "@/types/department.type";
import type {
  PublicStats,
  ResolvedIssue,
  Testimonial,
} from "@/types/public.type";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000/api/v1";

async function serverGet<T>(
  path: string,
  revalidate = 30,
  patient = false,
): Promise<T | null> {
  const attempts = patient ? 2 : 1;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${BACKEND_URL}${path}`, {
        next: { revalidate },
        signal: AbortSignal.timeout(patient ? 25_000 : 8_000),
      });
      if (res.status === 404) return null; // a real "not found"
      if (res.ok) return ((await res.json()) as ApiResponse<T>).data;
    } catch {
      /* retry */
    }
  }
  if (patient) throw new Error("Backend unavailable"); // never cache as 404
  return null;
}

export async function getPublicCategories() {
  return (await serverGet<Category[]>("/categories?limit=100")) ?? [];
}

export async function getPublicDepartments() {
  return (await serverGet<Department[]>("/departments?limit=100")) ?? [];
}

export function getPublicStats() {
  return serverGet<PublicStats>("/public/stats");
}

export function getCategoryReviews(id: string) {
  return serverGet<CategoryReviews>(`/categories/${id}/reviews?limit=6`, 60);
}

export function getPublicCategory(id: string) {
  return serverGet<Category>(`/categories/${id}`, 60, true);
}

export async function getResolvedIssues() {
  return (await serverGet<ResolvedIssue[]>("/public/resolved")) ?? [];
}

export async function getTestimonials() {
  return (await serverGet<Testimonial[]>("/public/testimonials")) ?? [];
}

export async function getTrendingCategories() {
  return (
    (await serverGet<Category[]>("/categories/trending?limit=4", 60)) ?? []
  );
}
