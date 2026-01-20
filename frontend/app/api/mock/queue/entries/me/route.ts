import { NextResponse } from "next/server";
import { MAX_ORDER } from "../route";

const DECREASE_GAP = 17;
let currentOrder = MAX_ORDER;

/**
 * 현재 대기 순번을 가져오기 위한 Mock API
 */
export function GET() {
  currentOrder -= DECREASE_GAP;

  const mockWaitingOrder = {
    position: currentOrder,
  };

  if (currentOrder <= 0) {
    currentOrder = MAX_ORDER;
  }

  return NextResponse.json(mockWaitingOrder);
}
