import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  verifyAccessToken,
  JwtPayload,
} from "../utils/jwt.js";

import { createAuthError, createInvalidTokenError } from "../utils/apiError.js";

export interface AuthenticatedRequest
  extends Request {
  user?: JwtPayload;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      throw createAuthError(
        "Authentication token is required"
      );
    }

    const [scheme, token] =
      authorization.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      throw createAuthError(
        "Invalid authorization format"
      );
    }

    const payload =
      verifyAccessToken(token);

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        next(createInvalidTokenError());
        return;
      }
      if (error.name === "JsonWebTokenError") {
        next(createInvalidTokenError());
        return;
      }
    }
    next(error);
  }
};