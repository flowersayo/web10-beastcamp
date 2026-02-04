import { TicketPlatform } from "@/types/performance";

export interface TicketingSite {
  id: TicketPlatform;
  name: string;
  url: string; // 외부 서버 시간 URL
  path: string; // 내부 라우팅 경로
}

export const TICKETING_SITES: TicketingSite[] = [
  {
    id: "nol-ticket",
    name: "NOL티켓",
    url: "https://nol.interpark.com",
    path: "/nol-ticket",
  },
  {
    id: "yes24",
    name: "YES24",
    url: "https://ticket.yes24.com",
    path: "/yes24",
  },
  {
    id: "melon-ticket",
    name: "멜론티켓",
    url: "https://ticket.melon.com",
    path: "/yes24", // 멜론티켓 페이지 미구현으로 yes24로 임시 라우팅
  },
];
