const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getImageSrc(imageURL?: string | null): string {
  if (!imageURL) return "/placeholder.png";

  // Extract the filename from /uploads/ path (works for both relative and absolute URLs)
  const match = imageURL.match(/\/uploads\/(.+)$/);
  if (match) {
    return `/api/uploads/${match[1]}`;
  }

  // If no /uploads/ pattern found, return as-is or with API_URL
  if (imageURL.startsWith("http")) {
    return imageURL;
  }
  return `${API_URL}${imageURL}`;
}

export function isRemoteImage(src: string): boolean {
  return src.startsWith("http");
}
