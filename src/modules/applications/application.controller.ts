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
  createApplicationSchema,
  applicationIdSchema,
} from "./application.validation.js";

import * as applicationService
  from "./application.service.js";

export const apply =
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

    const input =
      createApplicationSchema.parse(
        req.body
      );

    const application =
      await applicationService.applyToProject(
        input,
        req.user.userId
      );

    return sendSuccess(
      res,
      201,
      "Application submitted successfully",
      application
    );
  };

export const listApplications =
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

    const applications =
      await applicationService.getApplications(
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "Applications retrieved successfully",
      applications
    );
  };

export const getApplication =
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
      applicationIdSchema.parse({
        id: req.params.id,
      });

    const application =
      await applicationService.getApplicationById(
        parsed.id
      );

    return sendSuccess(
      res,
      200,
      "Application retrieved successfully",
      application
    );
  };

export const accept =
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
      applicationIdSchema.parse({
        id: req.params.id,
      });

    const application =
      await applicationService.acceptApplication(
        parsed.id,
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "Application accepted successfully",
      application
    );
  };

export const reject =
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
      applicationIdSchema.parse({
        id: req.params.id,
      });

    const application =
      await applicationService.rejectApplication(
        parsed.id,
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "Application rejected",
      application
    );
  };
