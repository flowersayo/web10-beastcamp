import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getWinstonLogger } from '@beastcamp/shared-nestjs/config/logger.config';
import { GlobalExceptionFilter } from '@beastcamp/shared-nestjs/errors/global-exception.filter';
import { TraceMiddleware } from '@beastcamp/shared-nestjs/trace/trace.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getWinstonLogger('api-server'),
  });

  const traceMiddleware = app.get<TraceMiddleware>(TraceMiddleware);
  app.use(traceMiddleware.use.bind(traceMiddleware));

  app.useGlobalFilters(app.get<GlobalExceptionFilter>(GlobalExceptionFilter));

  if (process.env.NODE_ENV !== 'production') {
    // CORS 설정
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://www.web10.site',
        'https://web10-beastcamp.vercel.app',
      ], // 프론트엔드 URL
      credentials: true,
    });
  }

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('일반 API Server')
    .setDescription('공연, 공연장 정보를 제공합니다.')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3002);
}
void bootstrap();
