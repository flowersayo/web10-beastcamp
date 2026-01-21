'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Session } from '@/types/performance';

interface Yes24CalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  sessions: Session[];
}

export default function Yes24Calendar({
  selectedDate,
  onDateSelect,
  sessions,
}: Yes24CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // 2026년 1월

  // 해당 월의 세션 날짜들을 Set으로 변환
  const sessionDates = new Set(
    sessions
      .filter((session) => {
        const sessionDate = new Date(session.sessionDate);
        return (
          sessionDate.getMonth() === currentMonth.getMonth() &&
          sessionDate.getFullYear() === currentMonth.getFullYear()
        );
      })
      .map((session) => new Date(session.sessionDate).getDate()),
  );

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  // 달력 생성
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 월의 첫 날 요일 (0: 일요일)
    const lastDate = new Date(year, month + 1, 0).getDate(); // 월의 마지막 날짜

    const calendar: (number | null)[] = [];

    // 첫 주의 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }

    // 날짜 추가
    for (let date = 1; date <= lastDate; date++) {
      calendar.push(date);
    }

    return calendar;
  };

  const calendar = generateCalendar();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 클릭 핸들러
  const handleDateClick = (date: number | null) => {
    if (date === null) return;
    if (!sessionDates.has(date)) return;

    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      date,
    );

    // 같은 날짜를 다시 클릭하면 선택 해제
    if (
      selectedDate &&
      selectedDate.getFullYear() === newDate.getFullYear() &&
      selectedDate.getMonth() === newDate.getMonth() &&
      selectedDate.getDate() === newDate.getDate()
    ) {
      onDateSelect(undefined);
    } else {
      onDateSelect(newDate);
    }
  };

  // 선택된 날짜인지 확인
  const isSelectedDate = (date: number | null) => {
    if (!selectedDate || date === null) return false;
    return (
      selectedDate.getFullYear() === currentMonth.getFullYear() &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getDate() === date
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="이전 달"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-lg font-bold text-gray-900">
          {currentMonth.getFullYear()}. {String(currentMonth.getMonth() + 1).padStart(2, '0')}
        </div>

        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="다음 달"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 회차 정보 */}
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded">
          1회 오후 6시 00분
        </span>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-2 ${
              index === 0
                ? 'text-red-600'
                : index === 6
                  ? 'text-blue-600'
                  : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((date, index) => {
          const dayOfWeek = index % 7;
          const hasSession = date !== null && sessionDates.has(date);
          const isSelected = isSelectedDate(date);
          const isToday =
            date !== null &&
            new Date().getDate() === date &&
            new Date().getMonth() === currentMonth.getMonth() &&
            new Date().getFullYear() === currentMonth.getFullYear();

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!hasSession}
              className={`
                aspect-square flex items-center justify-center text-sm rounded transition-colors
                ${date === null ? 'invisible' : ''}
                ${
                  hasSession
                    ? 'cursor-pointer hover:bg-gray-100'
                    : 'cursor-not-allowed text-gray-300'
                }
                ${isSelected ? 'bg-orange-500 text-white font-bold hover:bg-orange-600' : ''}
                ${!isSelected && hasSession && dayOfWeek === 0 ? 'text-red-600' : ''}
                ${!isSelected && hasSession && dayOfWeek === 6 ? 'text-blue-600' : ''}
                ${!isSelected && hasSession && dayOfWeek !== 0 && dayOfWeek !== 6 ? 'text-gray-900' : ''}
                ${isToday && !isSelected ? 'border-2 border-orange-500' : ''}
              `}
            >
              {date}
            </button>
          );
        })}
      </div>
    </div>
  );
}
