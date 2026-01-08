/* eslint-disable @next/next/no-img-element */

import { gradeInfo } from "../../data/seat";
import {
  useBlockSeatQuery,
  useReservedSeatQuery,
  useSeatMetaQuery,
} from "../../queries/seat";
import { Seat } from "../../types/reservationType";

interface StageMapProps {
  contentRef: React.Ref<HTMLDivElement>;
  containerRef: React.Ref<HTMLDivElement>;
  isMinScale: boolean;
  selectedSeats: ReadonlyMap<string, Seat>;
  handleToggleSeat: (seatId: string, data: Seat) => void;
  handleWheel: (e: React.WheelEvent, rect?: DOMRect) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
}

export default function StageMap({
  contentRef,
  containerRef,
  isMinScale,
  selectedSeats,
  handleToggleSeat,
  handleWheel,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}: StageMapProps) {
  const { data: reservedSeats } = useReservedSeatQuery();
  const { data: blocks } = useBlockSeatQuery();
  const { data: seats } = useSeatMetaQuery();

  const releasedSeatSet = new Set(
    reservedSeats
      .map((b) =>
        b.seats
          .filter((s) => s.statusInfo === "RELEASED")
          .map((s) => s.seatInfoId)
      )
      .flat()
  );

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative  flex-1 bg-[#EDEFF3] rounded-lg overflow-hidden flex items-center justify-center"
    >
      <div
        ref={contentRef}
        className="relative w-full h-full"
        style={{
          transformOrigin: "0 0",
        }}
      >
        <div className="flex justify-center items-center absolute w-full h-full p-16">
          {isMinScale ? (
            <img
              className="w-full h-full select-none pointer-events-none z-30"
              src="494b5ac0ae674853956bb73037051895.svg"
              alt=""
            />
          ) : (
            <img
              className="w-full h-full select-none pointer-events-none"
              src={"/7079e87b843d4852a5ee78d9fd346c19.svg"}
              alt="좌석배치도"
            />
          )}
          <svg
            className={`absolute inset-0 w-full h-full p-16 ${
              isMinScale ? " pointer-events-none" : " pointer-event-auto"
            }`}
            viewBox="0 0 510 435"
          >
            {seats?.map((b) => (
              <g key={b.blockKey} id={b.blockKey}>
                {b.seats.map((seat) => {
                  const isSelected = selectedSeats.has(seat.seatInfoId);

                  return (
                    <circle
                      key={seat.seatInfoId}
                      cx={seat.posLeft}
                      cy={seat.posTop}
                      r={1}
                      fill={
                        isSelected
                          ? "#FF0000"
                          : releasedSeatSet.has(seat.seatInfoId)
                          ? gradeInfo[seat.seatGrade]?.fillColor || "#7c68ee"
                          : "#EDEFF3"
                      }
                      stroke={
                        isSelected
                          ? "#FF0000"
                          : releasedSeatSet.has(seat.seatInfoId)
                          ? "#000"
                          : "#EDEFF3"
                      }
                      strokeWidth={isSelected ? 0.3 : 0.1}
                      className={
                        releasedSeatSet.has(seat.seatInfoId)
                          ? "cursor-pointer hover:r-2"
                          : ""
                      }
                      style={{ pointerEvents: "auto" }}
                      onClick={() => {
                        if (!releasedSeatSet.has(seat.seatInfoId)) return;
                        handleToggleSeat(seat.seatInfoId, seat);
                      }}
                    />
                  );
                })}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
