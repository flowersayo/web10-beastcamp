import { TicketPlatform } from "@/types/performance";
import { PLATFORM_DISPLAY_NAME } from "@/constants/performance";

export interface TicketingSite {
  id: TicketPlatform;
  name: string;
  url: string;
}

export const TICKETING_SITES: TicketingSite[] = [
  {
    id: "interpark",
    name: PLATFORM_DISPLAY_NAME["interpark"],
    url: "https://ticket.interpark.com",
  },
  {
    id: "yes24",
    name: PLATFORM_DISPLAY_NAME["yes24"],
    url: "https://ticket.yes24.com",
  },
  {
    id: "melon-ticket",
    name: PLATFORM_DISPLAY_NAME["melon-ticket"],
    url: "https://ticket.melon.com",
  },
];
