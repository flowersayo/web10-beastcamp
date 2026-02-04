import { useReservationData } from "../../contexts/ReservationDataProvider";

export default function PerformanceDate() {
  const { session } = useReservationData();
  const date = new Date(session.sessionDate);
  const formattedDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">공연일</span>
        <span>{formattedDate}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">시간</span>
        <span>{formattedTime}</span>
      </div>
    </>
  );
}
