import { TraceService } from "./trace.service";

export type PubSubPayload = {
  userId: string;
  traceId?: string;
};

export const parsePubSubPayload = (message: string): PubSubPayload => {
  try {
    const parsed = JSON.parse(message) as {
      userId?: unknown;
      traceId?: unknown;
    };
    if (parsed && typeof parsed === "object") {
      const userId =
        typeof parsed.userId === "string" ? parsed.userId : undefined;
      const traceId =
        typeof parsed.traceId === "string" ? parsed.traceId : undefined;

      if (userId) {
        return { userId, traceId };
      }
    }
  } catch {
    // fallback handled below
  }

  return { userId: message };
};

export const runWithPubSubContext = async <T>(
  traceService: TraceService,
  message: string,
  handler: (payload: PubSubPayload) => Promise<T> | T,
): Promise<T> => {
  const payload = parsePubSubPayload(message);
  const traceId = payload.traceId || traceService.generateTraceId();

  return traceService.runWithTraceId(traceId, () => handler(payload));
};
