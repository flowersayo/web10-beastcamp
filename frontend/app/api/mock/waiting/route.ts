import { NextResponse } from "next/server";

export const MAX_ORDER = 100;
let currentOrder = MAX_ORDER;

/**
 * 현재 대기 순번을 가져오기 위한 Mock API
 */
export function GET() {
  currentOrder -= 17;
  if (currentOrder <= 0) {
    currentOrder = MAX_ORDER;
  }

  const mockWaitingOrder = {
    order: currentOrder,
  };

  return NextResponse.json(mockWaitingOrder);
}
