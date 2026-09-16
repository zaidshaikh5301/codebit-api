import mongoose from "mongoose";

import { Task } from "./task.model.js";
import { Project } from "../projects/project.model.js";

import {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "./task.validation.js";

import {
  createNotFoundError,
  createForbiddenError,
} from "../../utils/apiError.js";

import * as notificationService from "../notifications/notification.service.js";

const isProjectMember = async (
  projectId: string,
  userId: string
): Promise<boolean> => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw createNotFoundError("Project");
  }

  const isOwner = project.owner.toString() === userId;
  const isMember = project.members.some(
    (m) => m.toString() === userId
  );

  return isOwner || isMember;
};

export const createTask = async (
  input: CreateTaskInput,
  userId: string
) => {
  const isMember = await isProjectMember(input.projectId, userId);

  if (!isMember) {
    throw createForbiddenError("You are not a member of this project");
  }

  const task = await Task.create({
    title: input.title,
    description: input.description,
    priority: input.priority,
    project: new mongoose.Types.ObjectId(input.projectId).toString(),
    assignee: input.assignee
      ? new mongoose.Types.ObjectId(input.assignee).toString()
      : undefined,
    dueDate: input.dueDate,
    status: "pending",
  });

  await Project.findByIdAndUpdate(input.projectId, {
    $addToSet: { tasks: task._id },
  });

  if (task.assignee) {
    await notificationService.sendNotification({
      recipientId: task.assignee.toString(),
      actorId: userId,
      type: "task_assigned",
      title: "Task assigned",
      message: `You have been assigned to task: ${task.title}`,
      projectId: input.projectId,
      relatedId: task._id.toString(),
    });
  }

  return Task.findById(task._id)
    .populate("project", "name")
    .populate("assignee", "fullName email")
    .exec();
};

export const getTasks = async (
  userId: string,
  projectId?: string,
  priority?: string
) => {
  let filter: Record<string, unknown> = {};

  if (projectId) {
    const isMember = await isProjectMember(projectId, userId);

    if (!isMember) {
      throw createForbiddenError("You are not a member of this project");
    }

    filter.project = projectId;
  } else {
    const projects = await Project.find({
      $or: [
        { owner: new mongoose.Types.ObjectId(userId).toString() },
        { members: new mongoose.Types.ObjectId(userId).toString() },
      ],
    });

    const projectIds = projects.map((p) => p._id);

    filter.project = { $in: projectIds };
  }

  if (priority) {
    filter.priority = priority;
  }

  return Task.find(filter)
    .populate("project", "name")
    .populate("assignee", "fullName email")
    .sort({ createdAt: -1 })
    .exec();
};

export const getTaskById = async (id: string, userId: string) => {
  const task = await Task.findById(id)
    .populate("project", "name owner")
    .populate("assignee", "fullName email")
    .exec();

  if (!task) {
    throw createNotFoundError("Task");
  }

  const projectId = task.project._id;

  const isMember = await isProjectMember(
    projectId.toString(),
    userId
  );

  if (!isMember) {
    throw createForbiddenError("You are not a member of this project");
  }

  return task;
};

export const updateTask = async (
  id: string,
  input: UpdateTaskInput,
  userId: string
) => {
  const task = await Task.findById(id).populate("project").exec();

  if (!task) {
    throw createNotFoundError("Task");
  }

  const projectId = task.project._id;

  const isMember = await isProjectMember(
    projectId.toString(),
    userId
  );

  if (!isMember) {
    throw createForbiddenError("You are not a member of this project");
  }

  Object.assign(task, input);

  await task.save();

  return Task.findById(id)
    .populate("project", "name")
    .populate("assignee", "fullName email")
    .exec();
};

export const updateTaskStatus = async (
  id: string,
  input: UpdateTaskStatusInput,
  userId: string
) => {
  const task = await Task.findById(id).populate("project").exec();

  if (!task) {
    throw createNotFoundError("Task");
  }

  const projectId = task.project._id;

  const isMember = await isProjectMember(
    projectId.toString(),
    userId
  );

  if (!isMember) {
    throw createForbiddenError("You are not a member of this project");
  }

  const wasCompleted = task.status === "completed";
  const willBeCompleted = input.status === "completed";

  task.status = input.status;

  await task.save();

  const projectDocument = await Project.findById(projectId).exec();
  const targetUser = task.assignee
    ? task.assignee.toString()
    : projectDocument?.owner.toString() || userId;

  if (targetUser !== userId) {
    await notificationService.sendNotification({
      recipientId: targetUser,
      actorId: userId,
      type: "task_status_changed",
      title: "Task status updated",
      message: `Task "${task.title}" status changed to ${input.status}`,
      projectId: projectId.toString(),
      relatedId: task._id.toString(),
    });
  }

  if (!wasCompleted && willBeCompleted) {
    await Project.findByIdAndUpdate(projectId, {
      $inc: { completedTasks: 1 },
    });
  } else if (wasCompleted && !willBeCompleted) {
    await Project.findByIdAndUpdate(projectId, {
      $inc: { completedTasks: -1 },
    });
  }

  return Task.findById(id)
    .populate("project", "name")
    .populate("assignee", "fullName email")
    .exec();
};

export const deleteTask = async (id: string, userId: string) => {
  const task = await Task.findById(id).populate("project").exec();

  if (!task) {
    throw createNotFoundError("Task");
  }

  const projectId = task.project._id;

  const project = await Project.findById(projectId);

  if (!project) {
    throw createNotFoundError("Project");
  }

  if (project.owner.toString() !== userId) {
    throw createForbiddenError("Only the project owner can delete tasks");
  }

  await Project.findByIdAndUpdate(projectId, {
    $pull: { tasks: task._id },
  });

  await task.deleteOne();

  return;
};