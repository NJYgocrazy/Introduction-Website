import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

type ErrorBody = {
  ok: false;
  error: {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
  };
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request & { url?: string }>();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception);

    if (statusCode >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(message, stack);
    }

    const body: ErrorBody = {
      ok: false,
      error: {
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: request?.url ?? ""
      }
    };

    httpAdapter.reply(response, body, statusCode);
  }

  private extractMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      if (typeof res === "string") return res;
      if (res && typeof res === "object") {
        const msg = res.message;
        if (Array.isArray(msg)) return msg.join("; ");
        if (typeof msg === "string") return msg;
      }
      return exception.message || "Request failed";
    }

    if (exception instanceof Error) return exception.message || "Internal server error";
    return "Internal server error";
  }
}

