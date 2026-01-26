import { api } from "@/lib/api/api";
import { ScheduledTicketingResponse } from "../types/scheduledTicketing";
import { useSuspenseQuery } from "@tanstack/react-query";

const getSimulationCacheTime = (data?: ScheduledTicketingResponse[]) => {
  if (!data?.[0]) return 0;

  const simulationTime = new Date(data[0].simulation_date).getTime();
  const now = new Date().getTime();
  const diff = simulationTime - now;

  return Math.max(0, diff);
};

export const useScheduledTicketingQuery = (
  ticketingAfter: Date | null,
  limit: number | null,
) => {
  return useSuspenseQuery<ScheduledTicketingResponse[]>({
    queryKey: ["performances", ticketingAfter, limit],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (ticketingAfter) {
        params.ticketing_after = ticketingAfter.toISOString();
      }
      if (limit) {
        params.limit = limit;
      }

      const res = await api.get<{ performances: ScheduledTicketingResponse[] }>(
        "/performances",
        {
          serverType: "api",
          params,
        },
      );

      if (res.performances.length === 0) {
        throw new Error("공연 정보를 찾을 수 없습니다.");
      }
      return res.performances;
    },
    staleTime: (query) =>
      getSimulationCacheTime(
        query.state.data as ScheduledTicketingResponse[] | undefined,
      ),
    gcTime: 1000 * 60 * 60 * 24, // 24시간
  });
};
