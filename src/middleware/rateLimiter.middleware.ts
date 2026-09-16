import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  code?: string;
  keyGenerator?: (req: Request) => string;
  skip?: (req: Request) => boolean;
}

const ipStore = new Map<
  string,
  { count: number; resetTime: number }
>();

export const createRateLimiter = (options: RateLimitOptions) => {
  const {
    windowMs,
    maxRequests,
    message = "Too many requests, please try again later",
    code = "RATE_LIMITED",
    keyGenerator = (req) => req.ip || "unknown",
    skip = () => false,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    if (skip(req)) {
      next();
      return;
    }

    const key = keyGenerator(req);
    const now = Date.now();
    const record = ipStore.get(key);

    if (!record || now > record.resetTime) {
      ipStore.set(key, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (record.count >= maxRequests) {
      res.set({
        "X-RateLimit-Limit": maxRequests.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": Math.ceil(record.resetTime / 1000).toString(),
      });

      res.status(429).json({
        success: false,
        error: {
          code,
          message,
        },
      });
      return;
    }

    record.count++;
    res.set({
      "X-RateLimit-Limit": maxRequests.toString(),
      "X-RateLimit-Remaining": (maxRequests - record.count).toString(),
      "X-RateLimit-Reset": Math.ceil(record.resetTime / 1000).toString(),
    });

    next();
  };
};

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: "Too many authentication attempts, please try again later",
  code: "RATE_LIMITED",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
  message: "Too many requests, please try again later",
  code: "RATE_LIMITED",
});

export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: "Too many upload attempts, please try again later",
  code: "RATE_LIMITED",
});

export const githubRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: "Too many GitHub API requests, please try again later",
  code: "RATE_LIMITED",
});