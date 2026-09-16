import { Request, Response } from "express";
import mongoose from "mongoose";

import { sendSuccess } from "../utils/apiResponse.js";

export const healthCheck = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

  const isHealthy = dbState === 1;

  return sendSuccess(
    res,
    isHealthy ? 200 : 503,
    isHealthy ? "Codebit API is running" : "Codebit API is degraded",
    {
      status: isHealthy ? "healthy" : "degraded",
      database: dbStatus,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    }
  );
};