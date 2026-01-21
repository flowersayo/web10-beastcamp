'use client';

import { useState } from 'react';

export default function TicketDetailLayout() {
  const [step, setStep] = useState<'idle' | 'select'>('idle');

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-[1.2fr_1fr] gap-12">
        {/* LEFT: Concert Info */}
        <section className="space-y-6">
          <header className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                단독판매
              </span>
              <span className="px-2 py-0.5 rounded bg-gray-100">안심예매</span>
              <span className="px-2 py-0.5 rounded bg-gray-100">예매대기</span>
            </div>
            <h1 className="text-3xl font-bold">wave to earth - 사랑으로 0.3</h1>
            <p className="text-sm text-gray-500">콘서트 주간 2위</p>
          </header>

          <div className="flex gap-8">
            <img
              src="/poster.jpg"
              alt="poster"
              className="w-64 h-auto rounded-lg object-cover"
            />

            <dl className="grid grid-cols-[80px_1fr] gap-y-3 text-sm">
              <dt className="text-gray-500">장소</dt>
              <dd className="font-medium">올림픽공원 올림픽홀</dd>

              <dt className="text-gray-500">공연기간</dt>
              <dd className="font-medium">2026.02.28 ~ 2026.03.01</dd>

              <dt className="text-gray-500">공연시간</dt>
              <dd className="font-medium">120분</dd>

              <dt className="text-gray-500">관람연령</dt>
              <dd className="font-medium">만 11세 이상</dd>

              <dt className="text-gray-500">가격</dt>
              <dd className="font-medium space-y-1">
                <div>스탠딩 132,000원</div>
                <div>지정석 SR 143,000원</div>
                <div>지정석 R 132,000원</div>
              </dd>
            </dl>
          </div>
        </section>

        {/* RIGHT: Reservation Panel */}
        <aside className="bg-white rounded-2xl shadow-sm p-6 min-h-[520px] flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold mb-2">관람일</h2>
              <div className="border rounded-lg p-4 text-center text-gray-400">
                달력 영역 (placeholder)
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">회차</h2>
              <button className="w-full border rounded-lg py-3 text-blue-600 font-medium">
                1회 18:00
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep('select')}
            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
          >
            예매하기
          </button>
        </aside>
      </div>
    </div>
  );
}
