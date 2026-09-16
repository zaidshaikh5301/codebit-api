import { Request, Response } from "express";

import { ERROR_CODES } from "../utils/errorCodes.js";
import { HTTP_STATUS } from "../utils/errorCodes.js";

export const notFoundMiddleware = (
  req: Request,
  res: Response
): Response => {
  const requestId = (req as Request & { requestId?: string }).requestId;

  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: "Route not found",
      ...(requestId ? { requestId } : {}),
    },
  });
};