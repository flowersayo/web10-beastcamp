"use client";

import { createContext, ReactNode, use, useEffect } from "react";
import { BlockGrade, VenueDetail, Grade } from "@/types/venue";
import { Performance, Session } from "@/types/performance";
import { useTicketContext } from "@/app/_source/contexts/TicketContext";
import { useRouter } from "next/navigation";

interface ReservationDataContextValue {
  venue: VenueDetail | null;
  performance: Performance;
  session: Session;
  blockGrades: BlockGrade[];
  grades: Grade[];
}

export const ReservationDataContext =
  createContext<ReservationDataContextValue | null>(null);

interface ReservationDataProviderProps {
  children: ReactNode;
  blockGrades: BlockGrade[];
  grades: Grade[];
}

export function ReservationDataProvider({
  children,
  blockGrades,
  grades,
}: ReservationDataProviderProps) {
  const router = useRouter();
  const { performance, venue, selectedSession } = useTicketContext();

  // Context 데이터가 없으면 정상적인 접근이 아닌 url 주소를 치고 들어온것과 같기에 메인으로 리다이렉트 시키게 했습니다.
  useEffect(() => {
    if (!performance || !selectedSession) {
      alert("정상적이지 않은 접근입니다.");
      router.replace("/");
    }
  }, [performance, selectedSession, router]);

  if (!performance || !selectedSession) {
    return null;
  }

  const dataValue: ReservationDataContextValue = {
    venue,
    performance,
    session: selectedSession,
    blockGrades,
    grades,
  };

  return (
    <ReservationDataContext.Provider value={dataValue}>
      {children}
    </ReservationDataContext.Provider>
  );
}

export function useReservationData() {
  const context = use(ReservationDataContext);
  if (!context) {
    throw new Error("ReservationDataProvider가 필요합니다.");
  }
  return context;
}
