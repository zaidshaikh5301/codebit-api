import {
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../../middleware/auth.middleware.js";

import {
  sendSuccess,
  sendError,
} from "../../utils/apiResponse.js";

import {
  updateProfileSchema,
  developerIdSchema,
  getDevelopersQuerySchema,
} from "./user.validation.js";

import * as userService from "./user.service.js";

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const user = await userService.getProfile(
    req.user.userId
  );

  return sendSuccess(
    res,
    200,
    "Profile retrieved successfully",
    user
  );
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const input = updateProfileSchema.parse(req.body);

  const user = await userService.updateProfile(
    req.user.userId,
    input
  );

  return sendSuccess(
    res,
    200,
    "Profile updated successfully",
    user
  );
};

export const getDevelopers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const query = getDevelopersQuerySchema.parse(req.query);

  const result = await userService.getDevelopers({
    search: query.search,
    skill: query.skill,
    page: query.page,
    limit: query.limit,
  });

  return sendSuccess(
    res,
    200,
    "Developers retrieved successfully",
    result.developers,
    result.pagination
  );
};

export const getDeveloperById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const parsed = developerIdSchema.parse({
    id: req.params.id,
  });

  const developer = await userService.getDeveloperById(
    parsed.id
  );

  return sendSuccess(
    res,
    200,
    "Developer retrieved successfully",
    developer
  );
};