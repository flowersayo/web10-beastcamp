import { api } from '@/lib/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface ChatMessage {
  id: string;
  nickname: string;
  message: string;
  timestamp: string;
}

interface GetMessagesResponse {
  messages: ChatMessage[];
}

interface SendMessageRequest {
  userId: string;
  message: string;
}

interface RegisterNicknameRequest {
  userId: string;
  nickname: string;
}

export const useChatMessagesQuery = () => {
  return useQuery<ChatMessage[]>({
    queryKey: ['chat', 'messages'],
    queryFn: async () => {
      const res = await api.get<GetMessagesResponse>('/chat/messages', {
        serverType: 'api',
      });
      return res.messages;
    },
    refetchInterval: 2000, // 2초마다 폴링
    staleTime: 0,
  });
};

export const useRegisterNicknameMutation = () => {
  return useMutation<{ success: boolean }, Error, RegisterNicknameRequest>({
    mutationFn: async (data: RegisterNicknameRequest) => {
      return await api.post<{ success: boolean }>('/chat/nickname', data, {
        serverType: 'api',
      });
    },
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, Error, SendMessageRequest>({
    mutationFn: async (data: SendMessageRequest) => {
      return await api.post<ChatMessage>('/chat/messages', data, {
        serverType: 'api',
      });
    },
    onSuccess: () => {
      // 메시지 전송 성공 시 목록 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] });
    },
  });
};
