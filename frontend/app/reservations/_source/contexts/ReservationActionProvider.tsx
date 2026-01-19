"use client";

import { createContext, ReactNode, use, useState } from "react";
import { useRouter } from "next/navigation";
import useSelection from "@/hooks/useSelector";
import { RESERVATION_LIMIT } from "../constants/reservationConstants";
import { Seat } from "../types/reservationType";

interface ReservationActionContextValue {
  selectedSeats: ReadonlyMap<string, Seat>;
  handleToggleSeat: (seatId: string, seat: Seat) => void;
  handleRemoveSeat: (seatId: string) => void;
  handleResetSeats: () => void;
  handleClickReserve: () => void;
  area: string | null;
  isShowArea: boolean;
  handleSelectArea: (areaId: string) => void;
  handleDeselectArea: () => void;
}

export const ReservationActionContext =
  createContext<ReservationActionContextValue | null>(null);

interface ReservationActionProviderProps {
  children: ReactNode;
}

export function ReservationActionProvider({
  children,
}: ReservationActionProviderProps) {
  const {
    selected: selectedSeats,
    toggle: handleToggleSeat,
    remove: handleRemoveSeat,
    reset: handleResetSeats,
  } = useSelection<string, Seat>(new Map(), { max: RESERVATION_LIMIT });

  const [area, setArea] = useState<string | null>(null);
  const isShowArea = !!area;

  const handleSelectArea = (areaId: string) => {
    setArea(areaId);
  };

  const handleDeselectArea = () => {
    setArea(null);
  };

  const router = useRouter();

  const handleClickReserve = () => {
    try {
      // throw new Error("예매 실패");
      router.push("/result");
    } catch (e) {
      console.error(e);
      alert("예매에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const actionValue: ReservationActionContextValue = {
    selectedSeats,
    handleToggleSeat,
    handleRemoveSeat,
    handleResetSeats,
    handleClickReserve,
    area,
    isShowArea,
    handleSelectArea,
    handleDeselectArea,
  };

  return (
    <ReservationActionContext.Provider value={actionValue}>
      {children}
    </ReservationActionContext.Provider>
  );
}

export function useReservationAction() {
  const context = use(ReservationActionContext);
  if (!context) {
    throw new Error("ReservationActionProvider가 필요합니다.");
  }
  return context;
}
