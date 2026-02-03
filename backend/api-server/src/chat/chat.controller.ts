import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import {
  GetMessagesResponseDto,
  ChatMessageResponseDto,
} from './dto/get-messages-response.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
  sendMessage(@Body() sendMessageDto: SendMessageDto): ChatMessageResponseDto {
    return this.chatService.addMessage(
      sendMessageDto.nickname,
      sendMessageDto.message,
    );
  }
}
