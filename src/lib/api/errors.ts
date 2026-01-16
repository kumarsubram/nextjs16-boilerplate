/**
 * API Error Types
 *
 * Structured error handling for API calls.
 */

export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "UNKNOWN";

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  status?: number;
  details?: unknown;
}

export class ApiException extends Error {
  public readonly code: ApiErrorCode;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiException";
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
  }

  static fromResponse(response: Response, body?: unknown): ApiException {
    const code = getErrorCode(response.status);
    return new ApiException({
      code,
      message: getErrorMessage(response.status, body),
      status: response.status,
      details: body,
    });
  }

  static networkError(error: Error): ApiException {
    return new ApiException({
      code: "NETWORK_ERROR",
      message: `Network error: ${error.message}`,
      details: error,
    });
  }

  static timeout(): ApiException {
    return new ApiException({
      code: "TIMEOUT",
      message: "Request timed out",
    });
  }
}

function getErrorCode(status: number): ApiErrorCode {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 422) return "VALIDATION_ERROR";
  if (status === 429) return "RATE_LIMITED";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN";
}

function getErrorMessage(status: number, body?: unknown): string {
  // Try to extract message from response body
  if (body && typeof body === "object" && "message" in body) {
    return String((body as { message: unknown }).message);
  }

  // Default messages by status
  const messages: Record<number, string> = {
    400: "Bad request",
    401: "Unauthorized - please sign in",
    403: "Forbidden - you don't have permission",
    404: "Not found",
    422: "Validation error",
    429: "Too many requests - please try again later",
    500: "Internal server error",
    502: "Bad gateway",
    503: "Service unavailable",
    504: "Gateway timeout",
  };

  return messages[status] || `Request failed with status ${status}`;
}
