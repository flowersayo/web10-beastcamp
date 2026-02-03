import { Injectable } from '@nestjs/common';

export interface ChatMessage {
  id: string;
  nickname: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  private messages: ChatMessage[] = [];

  getAllMessages(): ChatMessage[] {
    return this.messages;
  }

  addMessage(nickname: string, message: string): ChatMessage {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      nickname,
      message,
      timestamp: new Date(),
    };
    this.messages.push(newMessage);

    // 메모리 관리: 최대 100개 메시지만 유지
    if (this.messages.length > 100) {
      this.messages = this.messages.slice(-100);
    }

    return newMessage;
  }

  clearMessages(): void {
    this.messages = [];
  }
}
