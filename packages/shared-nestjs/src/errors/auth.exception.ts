import { BaseException } from "./base.exception";

export class AuthException extends BaseException {
  constructor(
    message: string,
    errorCode: string,
    statusCode = 401,
    traceId?: string,
  ) {
    super({ message, errorCode, statusCode, traceId });
  }
}
