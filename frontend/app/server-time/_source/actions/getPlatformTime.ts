"use server";

interface ServerTimeResponse {
  serverDate: number; // 타겟 서버(인터파크)의 Date 헤더 시간
  fetchedAt: number; // 위 데이터를 가져왔을 때의 우리 서버 시간 (캐시 생성 시점)
  serverNow: number; // 현재 요청을 처리하는 시점의 우리 서버 시간 (Age 계산용)
}

// Global In-Memory Cache
// { [url]: { data: { serverDate, fetchedAt }, expiresAt } }
const globalCache: Record<
  string,
  { serverDate: number; fetchedAt: number; expiresAt: number }
> = {};
const CACHE_TTL = 1000; // 1초 유지

import { TICKETING_SITES } from "@/constants/ticketingSites";

const ALLOWED_ORIGINS = TICKETING_SITES.map((site) => site.url);

export async function getPlatformTime(
  baseUrl: string,
): Promise<ServerTimeResponse | null> {
  const isAllowed = ALLOWED_ORIGINS.some((origin) =>
    baseUrl.startsWith(origin),
  );

  if (!isAllowed) {
    return null;
  }

  const now = Date.now();

  const cached = globalCache[baseUrl];
  if (cached && cached.expiresAt > now) {
    return {
      serverDate: cached.serverDate,
      fetchedAt: cached.fetchedAt,
      serverNow: now,
    };
  }

  try {
    const cleanUrl = baseUrl.replace(/\/$/, "");
    const targetUrl = `${cleanUrl}/favicon.ico`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
        headers: {
          "User-Agent": "Server-Time-Proxy",
        },
      });

      if (!response.ok) {
        console.warn(
          `[ServerTime] Fetch failed status: ${response.status} for ${baseUrl}`,
        );
        return null;
      }

      const dateHeader = response.headers.get("date");
      if (!dateHeader) {
        return null;
      }

      const serverDate = new Date(dateHeader).getTime();
      const fetchedAt = Date.now();

      globalCache[baseUrl] = {
        serverDate,
        fetchedAt,
        expiresAt: fetchedAt + CACHE_TTL,
      };

      return {
        serverDate,
        fetchedAt,
        serverNow: fetchedAt,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(`[ServerTime] Fetch timeout for ${baseUrl}`);
    } else {
      console.error(`Server Time Fetch Error (${baseUrl}):`, error);
    }
    return null;
  }
}
