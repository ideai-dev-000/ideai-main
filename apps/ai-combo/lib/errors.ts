import { NextResponse } from "next/server";

export type ErrorType = "rate_limit" | "auth" | "invalid_request" | "server";

export type Surface = "chat" | "suggestions";

export type ErrorCode = `${ErrorType}:${Surface}`;

export type ErrorVisibility = "log" | "response";

export function getStatusCodeByType(type: ErrorType): number {
  switch (type) {
    case "rate_limit":
      return 429;
    case "auth":
      return 401;
    case "invalid_request":
      return 400;
    case "server":
      return 500;
    default:
      return 500;
  }
}

export const visibilityBySurface: Record<Surface, ErrorVisibility> = {
  chat: "response",
  suggestions: "response",
};

export class ChatSDKError extends Error {
  public type: ErrorType;
  public surface: Surface;
  public statusCode: number;

  constructor(errorCode: ErrorCode, cause?: string) {
    super();

    const [type, surface] = errorCode.split(":");

    this.type = type as ErrorType;
    this.cause = cause;
    this.surface = surface as Surface;
    this.message = getMessageByErrorCode(errorCode);
    this.statusCode = getStatusCodeByType(this.type);
  }

  public toResponse() {
    const code: ErrorCode = `${this.type}:${this.surface}`;
    const visibility = visibilityBySurface[this.surface];

    const { message, cause, statusCode } = this;

    if (visibility === "log") {
      console.error({
        code,
        message,
        cause,
      });

      return NextResponse.json(
        { code: "", message: "Something went wrong. Please try again later." },
        { status: statusCode },
      );
    }

    return NextResponse.json({ code, message, cause }, { status: statusCode });
  }
}

export function getMessageByErrorCode(errorCode: ErrorCode): string {
  if (errorCode === "rate_limit:chat") {
    return "You've reached your daily message limit. Please try again tomorrow.";
  }

  if (errorCode === "auth:chat") {
    return "You must be authenticated to use this feature.";
  }

  if (errorCode === "invalid_request:chat") {
    return "Invalid request. Please check your input and try again.";
  }

  if (errorCode === "server:chat") {
    return "Something went wrong on our end. Please try again later.";
  }

  return "An error occurred. Please try again.";
}
