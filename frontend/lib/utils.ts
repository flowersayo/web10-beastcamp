import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}초`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}분`;
  }

  return `${minutes}분 ${Math.floor(remainingSeconds)}초`;
}

export const formatDateTime = (iso: string) =>
  format(new Date(iso), "yyyy.MM.dd HH:mm");
