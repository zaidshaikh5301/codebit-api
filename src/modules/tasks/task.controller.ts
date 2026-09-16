import { Response } from "express";

import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import { sendSuccess, sendError } from "../../utils/apiResponse.js";

import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskIdSchema,
  listTasksQuerySchema,
} from "./task.validation.js";

import * as taskService from "./task.service.js";

export const createNewTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const input = createTaskSchema.parse(req.body);

  const task = await taskService.createTask(input, req.user.userId);

  return sendSuccess(res, 201, "Task created successfully", task);
};

export const listTasks = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const query = listTasksQuerySchema.parse(req.query);

  const tasks = await taskService.getTasks(
    req.user.userId,
    query.projectId,
    query.priority
  );

  return sendSuccess(res, 200, "Tasks retrieved successfully", tasks);
};

export const getTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const parsed = taskIdSchema.parse({ id: req.params.id });

  const task = await taskService.getTaskById(parsed.id, req.user.userId);

  return sendSuccess(res, 200, "Task retrieved successfully", task);
};

export const updateExistingTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const parsed = taskIdSchema.parse({ id: req.params.id });

  const input = updateTaskSchema.parse(req.body);

  const task = await taskService.updateTask(
    parsed.id,
    input,
    req.user.userId
  );

  return sendSuccess(res, 200, "Task updated successfully", task);
};

export const updateTaskStatusValue = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const parsed = taskIdSchema.parse({ id: req.params.id });

  const input = updateTaskStatusSchema.parse(req.body);

  const task = await taskService.updateTaskStatus(
    parsed.id,
    input,
    req.user.userId
  );

  return sendSuccess(res, 200, "Task status updated successfully", task);
};

export const deleteTaskById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const parsed = taskIdSchema.parse({ id: req.params.id });

  await taskService.deleteTask(parsed.id, req.user.userId);

  return sendSuccess(res, 200, "Task deleted successfully", null);
};