import { Injectable, BadRequestException } from '@nestjs/common';

export interface ChatMessage {
  id: string;
  nickname: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  private messages: ChatMessage[] = [];
  private userNicknames: Map<string, string> = new Map(); // UUID -> nickname 매핑

  getAllMessages(): ChatMessage[] {
    return this.messages;
  }

  registerNickname(userId: string, nickname: string): void {
    // 이미 등록된 닉네임인지 확인
    const existingUser = Array.from(this.userNicknames.entries()).find(
      ([uid, nick]) => nick === nickname && uid !== userId,
    );

    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 닉네임입니다.');
    }

    this.userNicknames.set(userId, nickname);
  }

  getNickname(userId: string): string | undefined {
    return this.userNicknames.get(userId);
  }

  addMessage(userId: string, message: string): ChatMessage {
    const nickname = this.userNicknames.get(userId);

    if (!nickname) {
      throw new BadRequestException('닉네임을 먼저 설정해주세요.');
    }

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
