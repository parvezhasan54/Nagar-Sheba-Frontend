import type { ImageLoaderProps } from "next/image";

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) {
    return src;
  }
  return src.replace(
    "/upload/",
    `/upload/f_auto,q_${quality ?? "auto"},w_${width}/`,
  );
}
