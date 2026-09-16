import { Response } from "express";

import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import { sendSuccess, sendError } from "../../utils/apiResponse.js";

import {
  projectIdSchema,
  developerIdSchema,
} from "./productivity.validation.js";

import * as productivityService from "./productivity.service.js";

export const getProjectProductivity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const parsed = projectIdSchema.parse({ id: req.params.id });

  const stats = await productivityService.getProjectStats(
    parsed.id,
    req.user.userId
  );

  return sendSuccess(
    res,
    200,
    "Project productivity retrieved successfully",
    stats
  );
};

export const getDeveloperProductivity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const parsed = developerIdSchema.parse({ id: req.params.id });

  const stats = await productivityService.getDeveloperStats(
    parsed.id
  );

  return sendSuccess(
    res,
    200,
    "Developer productivity retrieved successfully",
    stats
  );
};

export const getMyProductivity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const stats = await productivityService.getDeveloperStats(
    req.user.userId
  );

  return sendSuccess(
    res,
    200,
    "Your productivity retrieved successfully",
    stats
  );
};