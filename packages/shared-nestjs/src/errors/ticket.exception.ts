import { BaseException } from "./base.exception";

export class TicketException extends BaseException {
  constructor(
    message: string,
    errorCode: string,
    statusCode = 400,
    traceId?: string,
  ) {
    super({ message, errorCode, statusCode, traceId });
  }
}
