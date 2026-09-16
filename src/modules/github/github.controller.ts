import { Response } from "express";

import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import { sendSuccess, sendError } from "../../utils/apiResponse.js";

import {
  githubUsernameSchema,
  githubRepoUrlSchema,
  projectIdSchema,
} from "./github.validation.js";

import * as githubService from "./github.service.js";

export const getGitHubProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const parsed = githubUsernameSchema.parse({
    username: req.params.username,
  });

  const profile = await githubService.fetchGitHubProfile(parsed.username);

  return sendSuccess(
    res,
    200,
    "GitHub profile retrieved successfully",
    profile
  );
};

export const getGitHubRepos = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const parsed = githubUsernameSchema.parse({
    username: req.params.username,
  });

  const repos = await githubService.fetchGitHubRepos(parsed.username);

  return sendSuccess(
    res,
    200,
    "GitHub repositories retrieved successfully",
    repos
  );
};

export const connectGitHubRepo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const projectParsed = projectIdSchema.parse({ id: req.params.id });
  const parsed = githubRepoUrlSchema.parse({ repoUrl: req.body.repoUrl });

  const project = await githubService.connectRepo(
    projectParsed.id,
    req.user.userId,
    parsed.repoUrl
  );

  return sendSuccess(
    res,
    200,
    "GitHub repository connected successfully",
    project
  );
};