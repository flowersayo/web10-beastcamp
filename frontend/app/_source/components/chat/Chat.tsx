'use client';

import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  id: string;
  nickname: string;
  message: string;
  timestamp: string;
}

export default function Chat() {
  const { nickname } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

  // 메시지 목록 가져오기
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('메시지 가져오기 실패:', error);
    }
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!nickname) {
      alert('닉네임을 먼저 설정해주세요!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname,
          message: inputValue.trim(),
        }),
      });

      if (response.ok) {
        setInputValue('');
        await fetchMessages();
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 초기 메시지 로드 및 폴링
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // 2초마다 새 메시지 체크
    return () => clearInterval(interval);
  }, []);

  // 새 메시지 시 스크롤 하단으로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[600px]">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-white" />
          <div>
            <h2 className="text-xl font-bold text-white">실시간 채팅</h2>
            <p className="text-sm text-purple-100">
              다른 사용자들과 대화해보세요
            </p>
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>아직 메시지가 없습니다.</p>
              <p className="text-sm">첫 메시지를 남겨보세요!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.nickname === nickname ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.nickname === nickname
                    ? 'bg-purple-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className={`text-sm font-semibold ${
                      msg.nickname === nickname
                        ? 'text-purple-100'
                        : 'text-purple-600'
                    }`}
                  >
                    {msg.nickname}
                  </span>
                  <span
                    className={`text-xs ${
                      msg.nickname === nickname
                        ? 'text-purple-200'
                        : 'text-gray-400'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p
                  className={`text-sm break-words ${
                    msg.nickname === nickname ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {!nickname ? (
          <div className="text-center text-gray-500 text-sm py-2">
            채팅을 시작하려면 오른쪽 상단에서 닉네임을 설정해주세요
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              maxLength={500}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>전송</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
