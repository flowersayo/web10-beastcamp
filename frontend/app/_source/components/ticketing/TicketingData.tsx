import { getLatestPerformance, getSessions } from "@/services/performance";
import { getVenue } from "@/services/venue";
import PerformanceInfo from "./PerformanceInfo";
import TicketingControls from "./TicketingControls";

export const dynamic = "force-dynamic"; // ci 통과용 실제 배포단계에선 필요없음 현재 nextjs api route를 사용하기 때문

export default async function TicketingData() {
  const performance = await getLatestPerformance();
  const sessions = performance
    ? await getSessions(performance.performance_id)
    : [];
  const venueId = sessions.length > 0 ? sessions[0].venueId : 0;
  const venue = venueId ? await getVenue(venueId) : null;

  return (
    <>
      <div className="flex flex-col gap-8 h-full">
        <PerformanceInfo
          performance={performance}
          sessions={sessions}
          venueName={venue?.venueName}
        />
      </div>
      <TicketingControls performance={performance} sessions={sessions} />
    </>
  );
}
