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
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
} from "./project.validation.js";

import * as projectService
  from "./project.service.js";

export const createNewProject =
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
      createProjectSchema.parse(
        req.body
      );

    const project =
      await projectService.createProject(
        input,
        req.user.userId
      );

    return sendSuccess(
      res,
      201,
      "Project created successfully",
      project
    );
  };

export const listProjects =
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

    const projects =
      await projectService.getProjects(
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "Projects retrieved successfully",
      projects
    );
  };

export const getProject =
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
      projectIdSchema.parse({
        id: req.params.id,
      });

    const project =
      await projectService.getProjectById(
        parsed.id
      );

    return sendSuccess(
      res,
      200,
      "Project retrieved successfully",
      project
    );
  };

export const updateExistingProject =
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
      projectIdSchema.parse({
        id: req.params.id,
      });

    const input =
      updateProjectSchema.parse(
        req.body
      );

    const project =
      await projectService.updateProject(
        parsed.id,
        input,
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "Project updated successfully",
      project
    );
  };

export const deleteProjectById =
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
      projectIdSchema.parse({
        id: req.params.id,
      });

    await projectService.deleteProject(
      parsed.id,
      req.user.userId
    );

    return sendSuccess(
      res,
      200,
      "Project deleted successfully",
      null
    );
  };
