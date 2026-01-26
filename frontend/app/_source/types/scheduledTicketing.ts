import { TicketPlatform } from "@/types/performance";

export interface ScheduledTicketingResponse {
  performance_name: string;
  ticketing_date: string;
  platform: TicketPlatform;
  venue_name: string;
  simulation_date: string;
}
