import { TICKETING_SITES } from "@/constants/ticketingSites";

// 각 사이트의 호스트(도메인)만 추출하여 Set으로 관리 (검색 효율 O(1))
export const ALLOWED_HOSTS = new Set(
  TICKETING_SITES.map((site) => {
    try {
      return new URL(site.url).host;
    } catch {
      return "";
    }
  }).filter(Boolean),
);
