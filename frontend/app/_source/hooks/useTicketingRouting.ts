import { useRouter } from "next/navigation";
import { Performance } from "@/types/performance";

import { TICKETING_SITES } from "@/constants/ticketingSites";

export function useTicketingRouting() {
  const router = useRouter();

  // 내부 모의 티켓팅(연습) 페이지로 이동
  const navigateToPractice = (performance?: Performance) => {
    if (!performance?.platform) {
      router.push("/nol-ticket");
      return;
    }

    const site = TICKETING_SITES.find((s) => s.id === performance.platform);
    router.push(site?.path || "/nol-ticket");
  };

  // 외부 예매 사이트(새 탭)로 이동
  const navigateToExternal = (performance: Performance) => {
    if (performance.platform_ticketing_url) {
      window.open(performance.platform_ticketing_url, "_blank");
    } else {
      return;
    }
  };

  return { navigateToPractice, navigateToExternal };
}
