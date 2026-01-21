"use client";

import { useResult } from "../../contexts/ResultProvider";

export default function UserRank() {
  const { rank } = useResult();
  const userRank = rank ? parseInt(rank, 10) : null;

  if (userRank === null || isNaN(userRank)) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 text-center">
        <p className="text-gray-600">순위 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 text-center">
      <p className="text-gray-600 mb-2">전체 사용자 중</p>
      <p className="text-3xl text-purple-600 mb-2">{userRank}위</p>
      <p className="text-sm text-gray-500">
        상위 {((userRank / 10000) * 100).toFixed(1)}%
      </p>
    </div>
  );
}
