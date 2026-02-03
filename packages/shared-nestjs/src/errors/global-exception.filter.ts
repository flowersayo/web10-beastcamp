import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { BaseException } from "./base.exception";
import { TraceService } from "../trace/trace.service";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly traceService: TraceService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<any>();

    const traceId = this.traceService.getOrCreateTraceId();
    const timestamp = new Date().toISOString();

    let statusCode = 500;
    let message = "Internal Server Error";
    let errorCode = "INTERNAL_ERROR";

    if (exception instanceof BaseException) {
      statusCode = exception.statusCode;
      message = exception.message;
      errorCode = exception.errorCode;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseBody = exception.getResponse();
      if (typeof responseBody === "string") {
        message = responseBody;
      } else if (
        responseBody &&
        typeof responseBody === "object" &&
        "message" in responseBody
      ) {
        const responseMessage = (responseBody as { message?: unknown }).message;
        if (Array.isArray(responseMessage)) {
          message = responseMessage.join(", ");
        } else if (typeof responseMessage === "string") {
          message = responseMessage;
        }
      }
      errorCode = "HTTP_EXCEPTION";
    }

    const errorDetail = {
      traceId,
      statusCode,
      errorCode,
      message,
      path: request?.url,
      method: request?.method,
      exception:
        exception instanceof Error
          ? {
              name: exception.name,
              message: exception.message,
              stack: exception.stack,
            }
          : exception,
    };

    this.logger.error(
      `[GlobalException] ${message}`,
      JSON.stringify(errorDetail),
    );

    response.status(statusCode).json({
      success: false,
      message,
      errorCode,
      traceId,
      timestamp,
    });
  }
}
