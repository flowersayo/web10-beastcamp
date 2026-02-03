import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: '사용자 닉네임',
    example: '티켓팅마스터',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  nickname: string;

  @ApiProperty({
    description: '채팅 메시지',
    example: '안녕하세요!',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;
}
