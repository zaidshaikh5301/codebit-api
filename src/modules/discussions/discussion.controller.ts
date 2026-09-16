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

import * as discussionService
  from "./discussion.service.js";

import {
  projectIdParamSchema,
} from "./discussion.validation.js";

export const getMessages =
  async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    if (!req.user) {
      return sendError(
        res,
        401,
        "Authentication required"
      );
    }

    const parsed =
      projectIdParamSchema.parse({
        projectId:
          req.params.projectId,
      });

    const messages =
      await discussionService.getMessages(
        parsed.projectId,
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "Messages retrieved successfully",
      messages
    );
  };

export const listConversations =
  async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    if (!req.user) {
      return sendError(
        res,
        401,
        "Authentication required"
      );
    }

    const conversations =
      await discussionService.getConversations(
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "Conversations retrieved successfully",
      conversations
    );
  };
