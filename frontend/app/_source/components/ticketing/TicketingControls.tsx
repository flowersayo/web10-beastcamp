"use client";

import CountdownTimer from "./CountdownTimer";
import type { Performance, Session } from "@/types/performance";
import type { VenueDetail } from "@/types/venue";
import { useTicketingRouting } from "../../hooks/useTicketingRouting";
import { useCountdown } from "../../hooks/useCountdown";
import {
  formatTicketingTime,
  getTicketingStatusText,
} from "../../utils/ticketingUtils";

interface TicketingControlsProps {
  performance?: Performance;
  sessions?: Session[];
  venue: VenueDetail | null;
}

export default function TicketingControls({
  performance,
}: TicketingControlsProps) {
  const { handleBooking } = useTicketingRouting();
  const { timeLeft, status } = useCountdown(performance?.ticketing_date);

  return (
    <div className="bg-white/10 p-3 backdrop-blur-lg rounded-2xl border border-white/20">
      {/* 티켓팅 오픈 시각 */}
      {performance?.ticketing_date && (
        <div className="text-center mb-3">
          <p className="text-lg font-semibold text-white">
            {getTicketingStatusText(status)}
          </p>
          <p className="text-sm text-white/80 mb-1">
            {formatTicketingTime(performance.ticketing_date)}
          </p>
        </div>
      )}

      {/* 카운트다운 타이머 */}
      <CountdownTimer timeLeft={timeLeft} status={status} />

      <button
        onClick={() => handleBooking(performance)}
        className={`w-full py-4 rounded-xl transition-all bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl cursor-pointer`}
      >
        연습하러 가기
      </button>
    </div>
  );
}
