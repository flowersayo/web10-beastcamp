"use client";

import { MAX_ORDER } from "@/app/api/mock/waiting/route";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  maxValue?: number;
}

export default function ProgressBar({
  value,
  maxValue = MAX_ORDER,
}: ProgressBarProps) {
  const progress = ((maxValue - value) / (maxValue - 1)) * 100;

  return <Progress value={Math.round(progress)} className="h-3 rounded-full" />;
}
