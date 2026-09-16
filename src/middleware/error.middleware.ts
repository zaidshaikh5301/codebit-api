import { ErrorRequestHandler, Request } from "express";

import { ZodError } from "zod";

import { AppError, isAppError } from "../utils/apiError.js";
import { ERROR_CODES, ErrorCode } from "../utils/errorCodes.js";
import { HTTP_STATUS } from "../utils/errorCodes.js";

interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

interface MongooseValidationError extends Error {
  errors: Record<string, { path: string; message: string }>;
}

interface MongoServerError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}

export const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  _next
): void => {
  const requestId = (req as Request & { requestId?: string }).requestId;

  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    const response: ErrorResponse = {
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Request validation failed",
        details,
        ...(requestId ? { requestId } : {}),
      },
    };

    res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    return;
  }

  if (isAppError(error)) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
        ...(requestId ? { requestId } : {}),
      },
    };

    res.status(error.statusCode).json(response);
    return;
  }

  if (error instanceof Error) {
    if (error.name === "CastError") {
      const response: ErrorResponse = {
        success: false,
        error: {
          code: ERROR_CODES.INVALID_ID,
          message: "Invalid ID format",
          ...(requestId ? { requestId } : {}),
        },
      };

      res.status(HTTP_STATUS.BAD_REQUEST).json(response);
      return;
    }

    if (error.name === "ValidationError") {
      const mongooseError = error as MongooseValidationError;
      const details = Object.values(mongooseError.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));

      const response: ErrorResponse = {
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: "Validation failed",
          details,
          ...(requestId ? { requestId } : {}),
        },
      };

      res.status(HTTP_STATUS.BAD_REQUEST).json(response);
      return;
    }

    if (error.name === "MongoServerError") {
      const mongoError = error as MongoServerError;
      if (mongoError.code === 11000) {
        const field = Object.keys(mongoError.keyValue || {})[0];
        const message = field === "email" ? "Email is already registered" : "Duplicate resource";

        const response: ErrorResponse = {
          success: false,
          error: {
            code: ERROR_CODES.DUPLICATE_RESOURCE,
            message,
            ...(requestId ? { requestId } : {}),
          },
        };

        res.status(HTTP_STATUS.CONFLICT).json(response);
        return;
      }
    }

    if (error.name === "JsonWebTokenError") {
      const response: ErrorResponse = {
        success: false,
        error: {
          code: ERROR_CODES.INVALID_TOKEN,
          message: "Invalid token",
          ...(requestId ? { requestId } : {}),
        },
      };

      res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
      return;
    }

    if (error.name === "TokenExpiredError") {
      const response: ErrorResponse = {
        success: false,
        error: {
          code: ERROR_CODES.TOKEN_EXPIRED,
          message: "Token has expired",
          ...(requestId ? { requestId } : {}),
        },
      };

      res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
      return;
    }
  }

  console.error("Unhandled error:", error);

  const response: ErrorResponse = {
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "Internal server error",
      ...(requestId ? { requestId } : {}),
    },
  };

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};