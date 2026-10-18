import type { ApiResponse } from "@/types/api.type";
import type { Category, CategoryReviews } from "@/types/category.type";
import type { Department } from "@/types/department.type";
import type {
  PublicStats,
  ResolvedIssue,
  Testimonial,
} from "@/types/public.type";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000/api/v1";

async function serverGet<T>(path: string, revalidate = 30): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse<T>;
    return json.data;
  } catch {
    return null;
  }
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
  return serverGet<Category>(`/categories/${id}`, 60);
}

export async function getResolvedIssues() {
  return (await serverGet<ResolvedIssue[]>("/public/resolved")) ?? [];
}

export async function getTestimonials() {
  return (await serverGet<Testimonial[]>("/public/testimonials")) ?? [];
}
