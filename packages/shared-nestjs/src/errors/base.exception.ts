import { HttpException } from "@nestjs/common";

export type BaseExceptionOptions = {
  message: string;
  errorCode: string;
  statusCode: number;
  traceId?: string;
  timestamp?: string;
};

export class BaseException extends HttpException {
  readonly message: string;
  readonly errorCode: string;
  readonly statusCode: number;
  readonly timestamp: string;
  readonly traceId?: string;

  constructor(options: BaseExceptionOptions) {
    const timestamp = options.timestamp ?? new Date().toISOString();
    super(
      {
        message: options.message,
        errorCode: options.errorCode,
        statusCode: options.statusCode,
        timestamp,
        traceId: options.traceId,
      },
      options.statusCode,
    );

    this.message = options.message;
    this.errorCode = options.errorCode;
    this.statusCode = options.statusCode;
    this.timestamp = timestamp;
    this.traceId = options.traceId;
  }
}
