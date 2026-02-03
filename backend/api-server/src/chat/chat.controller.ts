import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { RegisterNicknameDto } from './dto/register-nickname.dto';
import {
  GetMessagesResponseDto,
  ChatMessageResponseDto,
} from './dto/get-messages-response.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('nickname')
  @ApiOperation({ summary: '닉네임 등록/변경' })
  @ApiResponse({
    status: 201,
    description: '닉네임이 성공적으로 등록됨',
    schema: { example: { success: true } },
  })
  @ApiResponse({
    status: 400,
    description: '이미 사용 중인 닉네임',
  })
  registerNickname(@Body() registerNicknameDto: RegisterNicknameDto): {
    success: boolean;
  } {
    this.chatService.registerNickname(
      registerNicknameDto.userId,
      registerNicknameDto.nickname,
    );
    return { success: true };
  }

  @Get('messages')
  @ApiOperation({ summary: '모든 채팅 메시지 조회' })
  @ApiResponse({
    status: 200,
    description: '채팅 메시지 목록',
    type: GetMessagesResponseDto,
  })
  getMessages(): GetMessagesResponseDto {
    const messages = this.chatService.getAllMessages();
    return { messages };
  }

  @Post('messages')
  @ApiOperation({ summary: '채팅 메시지 전송' })
  @ApiResponse({
    status: 201,
    description: '메시지가 성공적으로 전송됨',
    type: ChatMessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '닉네임을 먼저 설정해주세요',
  })
  sendMessage(@Body() sendMessageDto: SendMessageDto): ChatMessageResponseDto {
    return this.chatService.addMessage(
      sendMessageDto.userId,
      sendMessageDto.message,
    );
  }
}
