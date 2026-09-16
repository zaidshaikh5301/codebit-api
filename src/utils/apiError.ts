import { ERROR_CODES, ErrorCode, HTTP_STATUS } from "./errorCodes.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: ErrorCode = ERROR_CODES.INTERNAL_ERROR,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = "AppError";

    Error.captureStackTrace(this, this.constructor);
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof Error && "statusCode" in error && "code" in error;
};

export const createValidationError = (
  message: string,
  details?: unknown
): AppError => {
  return new AppError(
    message,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.VALIDATION_ERROR,
    details
  );
};

export const createAuthError = (message: string): AppError => {
  return new AppError(
    message,
    HTTP_STATUS.UNAUTHORIZED,
    ERROR_CODES.AUTH_REQUIRED
  );
};

export const createInvalidTokenError = (): AppError => {
  return new AppError(
    "Invalid or expired access token",
    HTTP_STATUS.UNAUTHORIZED,
    ERROR_CODES.INVALID_TOKEN
  );
};

export const createForbiddenError = (message: string): AppError => {
  return new AppError(
    message,
    HTTP_STATUS.FORBIDDEN,
    ERROR_CODES.FORBIDDEN
  );
};

export const createNotFoundError = (resource: string): AppError => {
  return new AppError(
    `${resource} not found`,
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.NOT_FOUND
  );
};

export const createConflictError = (message: string): AppError => {
  return new AppError(
    message,
    HTTP_STATUS.CONFLICT,
    ERROR_CODES.CONFLICT
  );
};

export const createDuplicateResourceError = (resource: string): AppError => {
  return new AppError(
    `${resource} already exists`,
    HTTP_STATUS.CONFLICT,
    ERROR_CODES.DUPLICATE_RESOURCE
  );
};

export const createInvalidIdError = (resource: string): AppError => {
  return new AppError(
    `Invalid ${resource} ID`,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.INVALID_ID
  );
};

export const createRateLimitError = (): AppError => {
  return new AppError(
    "Too many requests",
    HTTP_STATUS.TOO_MANY_REQUESTS,
    ERROR_CODES.RATE_LIMITED
  );
};

export const createDatabaseError = (message: string): AppError => {
  return new AppError(
    message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_CODES.DATABASE_ERROR
  );
};

export const createExternalServiceError = (service: string): AppError => {
  return new AppError(
    `${service} service is temporarily unavailable`,
    HTTP_STATUS.BAD_GATEWAY,
    ERROR_CODES.EXTERNAL_SERVICE_ERROR
  );
};

export const createFileUploadError = (message: string): AppError => {
  return new AppError(
    message,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.FILE_UPLOAD_ERROR
  );
};

export const createInvalidFileTypeError = (): AppError => {
  return new AppError(
    "Invalid file type. Only JPEG and PNG images are allowed",
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.INVALID_FILE_TYPE
  );
};

export const createFileTooLargeError = (): AppError => {
  return new AppError(
    "File too large. Maximum size is 2 MB",
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.FILE_TOO_LARGE
  );
};