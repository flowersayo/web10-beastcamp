'use client';

import { useCountdown } from '../../hooks/useCountdown';
import CountdownTimer from './CountdownTimer';
import type { Performance, Session } from '@/types/performance';
import type { VenueDetail } from '@/types/venue';
import { useRouter } from 'next/navigation';

interface TicketingControlsProps {
  performance?: Performance;
  sessions?: Session[];
  venue: VenueDetail | null;
}

export default function TicketingControls({
  performance,
}: TicketingControlsProps) {
  const router = useRouter();

  const { timeLeft, isActive } = useCountdown(performance?.ticketing_date);

  const handleBooking = () => {
    if (!performance?.platform) {
      router.push('/nol-ticket');
      return;
    }

    const platformRoutes = {
      'nol-ticket': '/nol-ticket',
      yes24: '/yes24',
      'melon-ticket': '/melon-ticket',
    };

    const route =
      platformRoutes[performance.platform as keyof typeof platformRoutes];
    router.push(route || '/nol-ticket');
  };

  // 티켓팅 오픈 시각 포맷팅
  const formatTicketingTime = () => {
    if (!performance?.ticketing_date) return '';

    const date = new Date(performance.ticketing_date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <div className="bg-white/10 p-3 backdrop-blur-lg rounded-2xl border border-white/20">
      {/* 티켓팅 오픈 시각 */}
      {performance?.ticketing_date && (
        <div className="text-center mb-3">
          <p className="text-lg font-semibold text-white">티켓팅 오픈</p>
          <p className="text-sm text-white/80 mb-1">{formatTicketingTime()}</p>
        </div>
      )}

      {/* 카운트다운 타이머 */}
      <CountdownTimer timeLeft={timeLeft} />

      <button
        onClick={handleBooking}
        className={`w-full py-4 rounded-xl transition-all bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl`}
      >
        연습하러 가기
      </button>

      {!isActive && (
        <p className="text-center text-sm text-white/60 mt-3">
          티켓팅 시작 시간에 활성화됩니다
        </p>
      )}
    </div>
  );
}
