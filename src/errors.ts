export type ParcelWingErrorType =
  | "authentication_error"
  | "validation_error"
  | "invalid_request_error"
  | "not_found_error"
  | "conflict_error"
  | "rate_limit_error"
  | "reputation_error"
  | "suppression_error"
  | "api_error";

export type ParcelWingApiErrorPayload = {
  error: {
    type: ParcelWingErrorType;
    code?: string;
    message: string;
    details?: unknown;
    request_id?: string;
    [key: string]: unknown;
  };
};

export class ParcelWingError extends Error {
  readonly status: number;
  readonly type: ParcelWingErrorType;
  readonly code?: string;
  readonly requestId?: string;
  readonly details?: unknown;
  readonly metadata: Record<string, unknown>;

  constructor({
    message,
    status,
    type,
    code,
    requestId,
    details,
    metadata = {},
  }: {
    message: string;
    status: number;
    type: ParcelWingErrorType;
    code?: string;
    requestId?: string;
    details?: unknown;
    metadata?: Record<string, unknown>;
  }) {
    super(message);
    this.name = "ParcelWingError";
    this.status = status;
    this.type = type;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
    this.metadata = metadata;
  }
}

export function isParcelWingError(error: unknown): error is ParcelWingError {
  return error instanceof ParcelWingError;
}
