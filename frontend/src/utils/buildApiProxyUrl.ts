import { PaginationType } from "@/types";

export default function buildApiProxyUrl(url: string, meta?: PaginationType): string {
  const query = meta?.page ? `?page=${meta.page}` : "";
  return `/api/proxy/${url}${query}`;
}
