import { Request, Response, NextFunction } from "express";

export const requestIdMiddleware = (
  req: Request & { requestId?: string },
  _res: Response,
  next: NextFunction
): void => {
  const requestId =
    (req.headers["x-request-id"] as string) ||
    crypto.randomUUID();

  req.requestId = requestId;
  next();
};

export const addRequestIdToResponse = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalJson = res.json.bind(res);

  res.json = (data: unknown) => {
    if (
      data &&
      typeof data === "object" &&
      "success" in data &&
      data.success === false &&
      "error" in data
    ) {
      const requestId = (res.req as Request & { requestId?: string }).requestId;
      if (requestId) {
        const errorObj = (data as Record<string, unknown>).error;
        if (errorObj && typeof errorObj === "object" && !("requestId" in errorObj)) {
          (errorObj as Record<string, unknown>).requestId = requestId;
        }
      }
    }
    return originalJson(data);
  };

  next();
};