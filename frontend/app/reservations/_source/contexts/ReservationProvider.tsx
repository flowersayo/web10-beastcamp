"use client";

import { ReactNode } from "react";
import { BlockGrade, VenueDetail, Grade } from "@/types/venue";
import { Performance, Session } from "@/types/performance";
import {
  ReservationDataProvider,
  useReservationData,
} from "./ReservationDataProvider";
import {
  ReservationActionProvider,
  useReservationAction,
} from "./ReservationActionProvider";

export { useReservationData, useReservationAction };

interface ReservationProviderProps {
  children: ReactNode;
  venue: VenueDetail | null;
  performance: Performance;
  sessions: Session[];
  blockGrades: BlockGrade[];
  grades: Grade[];
}

export function ReservationProvider({
  children,
  venue,
  performance,
  sessions,
  blockGrades,
  grades,
}: ReservationProviderProps) {
  return (
    <ReservationDataProvider
      venue={venue}
      performance={performance}
      sessions={sessions}
      blockGrades={blockGrades}
      grades={grades}
    >
      <ReservationActionProvider>{children}</ReservationActionProvider>
    </ReservationDataProvider>
  );
}

export function useReservation() {
  const data = useReservationData();
  const action = useReservationAction();
  return { ...data, ...action };
}
