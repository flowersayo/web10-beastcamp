import { ServerTimeContainer } from "@/app/server-time/_source/components/ServerTimeContainer";
import { Clock } from "lucide-react";

export default function ServerTimePage() {
  return (
    <main className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Clock className="w-8 h-8 text-purple-600" />
            서버 시간 확인
          </h1>
          <p className="text-gray-500">티켓팅을 위한 서버 시간 모니터링</p>
        </div>

        <ServerTimeContainer />

        <div className="text-center mt-12 px-4">
          <div className="bg-orange-50/50 w-full border border-orange-100 rounded-lg p-4 inline-block max-w-2xl">
            <p className="text-xs text-orange-800 leading-relaxed font-medium">
              ※ 본 시간은 예매 사이트 서버 시간을 추정한 값이며,
              <br /> 네트워크 및 서버 응답 환경에 따라 소량의 오차가 발생할 수
              있으므로 참고용으로만 활용해 주세요.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
