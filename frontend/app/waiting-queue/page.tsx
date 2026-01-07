"use client";

import { usePreventRefresh } from "@/hooks/usePreventRefresh";
import { useWaitingQueue } from "./hooks/useWaitingQueue";
import ProgressBar from "./_source/components/ProgressBar";

export default function WaitingQueuePage() {
  const { data, isError } = useWaitingQueue();
  usePreventRefresh();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-center">
      <span>나의 대기 순서</span>
      <span>
        {isError ? "오류가 발생했습니다. 다시 시도해주세요." : data?.order}
      </span>
      <div className="w-50 my-4">
        <ProgressBar value={data?.order ?? 0} />
      </div>
      <span>
        ⚠️ 새로고침 하거나 재접속 하시면
        <br />
        대기순서가 초기화되어 대기시간이 더 길어집니다.
      </span>
    </div>
  );
}
