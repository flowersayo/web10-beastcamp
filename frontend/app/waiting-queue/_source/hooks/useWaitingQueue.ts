import { useEffect } from "react";
import { useCurrentQueue, useEnterQueue } from "../queries/position";

export const useWaitingQueue = () => {
  // 1. 대기열 진입 (Mutation)
  const {
    mutate,
    data: entryData, // ⭐️ 여기에 "최초 진입 순번"이 들어있습니다.
    isSuccess: isEntrySuccess,
    isError,
  } = useEnterQueue();

  const { data: currentData } = useCurrentQueue(isEntrySuccess);

  // 3. 마운트 시 자동 진입 시도
  useEffect(() => {
    mutate();
  }, [mutate]);

  return {
    // 상태값들
    isLoading: !isEntrySuccess && !isError, // 진입 중
    isError, // 에러 발생

    // 데이터들
    initialOrder: entryData?.position, // ⭐️ 최초 순번 (ProgressBar의 max)
    currentOrder: currentData?.position, // ⭐️ 현재 순번 (ProgressBar의 value)

    // 완료 여부 (순번이 0이거나 완료 상태)
    isFinished: currentData?.position === 0,
  };
};
