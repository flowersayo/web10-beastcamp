"use client";

import { usePreventRefresh } from "@/hooks/usePreventRefresh";
import WaitingQueue from "./_source/WaitingQueue";

export default function WaitingQueuePage() {
  usePreventRefresh();

  return <WaitingQueue />;
}
