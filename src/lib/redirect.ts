/** Only same-site relative paths are allowed (prevents open redirects). */
export function getSafeRedirect(value: string | null) {
  if (!value) return null;
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return null;
  }
  return value;
}
