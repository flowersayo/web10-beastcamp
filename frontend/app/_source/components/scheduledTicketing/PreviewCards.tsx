import { useScheduledTicketingQuery } from "../../queries/ticketingSchdule";
import { TicketingPreviewCard } from "./TicketingPreviewCard.tsx";

export default function PreviewCards() {
  const { data: scheduledTicketings } = useScheduledTicketingQuery(null, 5);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {scheduledTicketings.map((ticketing, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-purple-200 group cursor-pointer"
        >
          <TicketingPreviewCard
            platform={ticketing.platform}
            performanceName={ticketing.performance_name}
            ticketingDate={ticketing.ticketing_date}
            venueName={ticketing.venue_name}
            simulationDate={ticketing.simulation_date}
          />
        </div>
      ))}
    </div>
  );
}
