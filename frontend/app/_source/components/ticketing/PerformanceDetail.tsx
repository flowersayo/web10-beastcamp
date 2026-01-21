"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ChevronRight } from "lucide-react";
import { Performance, Session } from "@/types/performance";
import DetailDateSelector from "./DetailDateSelector";
import DetailRoundSelector from "./DetailRoundSelector";
import { useRouter } from "next/navigation";

interface PerformanceDetailProps {
  performance: Performance;
  sessions: Session[];
  venueName?: string;
}

export default function PerformanceDetail({
  performance,
  sessions,
  venueName,
}: PerformanceDetailProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(2076);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedRound) {
      router.push("/waiting-queue");
      console.log("예매 확정:", { selectedDate, selectedRound });
    }
  };

  const onDateSelect = (date: Date | undefined) => {
    if (date === selectedDate) return;
    if (!date) return;
    setSelectedDate(date);
    setSelectedRound(null);
  };

  // 날짜 범위 계산
  let dateRange = "";
  if (sessions && sessions.length > 0) {
    const dates = sessions.map((s) => new Date(s.sessionDate).getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const formatDate = (d: Date) =>
      d.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).replace(/\. /g, ".").replace(/\.$/, "");

    if (minDate.getTime() === maxDate.getTime()) {
      dateRange = formatDate(minDate);
    } else {
      dateRange = `${formatDate(minDate)} ~ ${formatDate(maxDate)}`;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 네비게이션 */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium border-b-2 border-purple-600 text-purple-600">
              단독판매
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              일상예매
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              예매대기
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 좌측: 포스터 이미지 */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="relative aspect-3/4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/poster.png"
                  alt={performance.performance_name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* 좋아요 버튼 */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span className="text-sm">티켓캐스트</span>
                  <span className="font-semibold">{likeCount}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 중앙: 공연 정보 */}
          <div className="lg:col-span-6 space-y-6">
            {/* 제목 */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {performance.performance_name}
              </h1>
              <p className="text-gray-600">콘서트 주간 2회</p>
            </div>

            {/* 기본 정보 */}
            <div className="space-y-4 pb-6 border-b border-gray-200">
              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">장소</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-gray-900">
                    <span>{venueName || "올림픽공원 올림픽홀"}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">공연기간</div>
                <div className="flex-1 text-gray-900">{dateRange}</div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">공연시간</div>
                <div className="flex-1 text-gray-900">120분</div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-600 font-medium">관람연령</div>
                <div className="flex-1 text-gray-900">만 11세이상</div>
              </div>
            </div>

            {/* 가격 정보 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">가격</h2>
                <button className="text-sm text-purple-600 font-medium flex items-center gap-1">
                  전체가격보기
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">스탠딩</span>
                  <span className="font-semibold text-gray-900">132,000원</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">지정석 SR</span>
                  <span className="font-semibold text-gray-900">143,000원</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">지정석 R</span>
                  <span className="font-semibold text-gray-900">132,000원</span>
                </div>
              </div>
            </div>

            {/* 혜택 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">혜택</h2>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    NOL카드
                  </span>
                  <span className="text-sm text-gray-700">
                    NOL 카드 티켓 10만원 할인쿠폰
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                    taping
                  </span>
                  <span className="text-sm text-gray-700">
                    기입하고 증폭할인! 쿠폰받기
                  </span>
                </div>
              </div>
            </div>

            {/* 프로모션 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">프로모션</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-block px-2 py-1 bg-yellow-400 text-gray-900 font-bold rounded">
                  ●pay
                </span>
                <span className="text-gray-700">
                  카카오머니 결제 시 4천원 즉시할인(일 선착순)
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* 배송 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">배송</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>2026년 02월 04일 일괄 배송되는 상품입니다.</p>
                <p>2월 4일(수) ~ 6일(금), 3일간</p>
                <button className="text-purple-600 font-medium flex items-center gap-1">
                  배송주소 확인
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 유의사항 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">유의사항</h2>
              <p className="text-sm text-gray-700">
                2026년 01월 20일 00시 00분~2026년 01월 27일 18시 00분까지
                무통장입금 결제가 불가능합니다.
              </p>
            </div>
          </div>

          {/* 우측: 예약 패널 */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">관람일</h2>

                <DetailDateSelector
                  selectedDate={selectedDate}
                  onDateSelect={onDateSelect}
                  sessions={sessions}
                />

                <div className="mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">회차</h2>
                  <DetailRoundSelector
                    selectedRound={selectedRound}
                    onRoundSelect={setSelectedRound}
                    sessions={sessions}
                    selectedDate={selectedDate}
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedDate || !selectedRound}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      selectedDate && selectedRound
                        ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    예매하기
                  </button>

                  <button className="w-full mt-3 py-3 rounded-xl bg-white border-2 border-purple-600 text-purple-600 font-bold hover:bg-purple-50 transition-all">
                    BOOKING / 차량팀
                  </button>

                  <button className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
                    NOL 카드 쓸 때마다 10% 적립
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
                    이 공연이 더 궁금하다면
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
