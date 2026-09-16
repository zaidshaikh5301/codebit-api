import mongoose from "mongoose";

import { Project } from "../projects/project.model.js";
import { Task } from "../tasks/task.model.js";
import { User } from "../users/user.model.js";

import {
  createNotFoundError,
  createForbiddenError,
} from "../../utils/apiError.js";

interface ProjectStats {
  projectId: string;
  projectName: string;
  totalMembers: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  epicTasks: number;
  highTasks: number;
  mediumTasks: number;
  lowTasks: number;
  completionPercentage: number;
}

interface DeveloperStats {
  userId: string;
  fullName: string;
  username?: string;
  profileImage?: string;
  totalTasksAssigned: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  projectsCount: number;
}

export const getProjectStats = async (
  projectId: string,
  userId: string
): Promise<ProjectStats> => {
  const project = await Project.findById(projectId)
    .populate("owner", "fullName")
    .populate("members", "fullName")
    .exec();

  if (!project) {
    throw createNotFoundError("Project");
  }

  const isOwner = project.owner.toString() === userId;
  const isMember = project.members.some(
    (m) => m.toString() === userId
  );

  if (!isOwner && !isMember) {
    throw createForbiddenError("You are not a member of this project");
  }

  const tasks = await Task.find({ project: projectId }).exec();

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  const epicTasks = tasks.filter((t) => t.priority === "epic").length;
  const highTasks = tasks.filter((t) => t.priority === "high").length;
  const mediumTasks = tasks.filter((t) => t.priority === "medium").length;
  const lowTasks = tasks.filter((t) => t.priority === "low").length;

  const completionPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  return {
    projectId: project._id.toString(),
    projectName: project.name,
    totalMembers: project.members.length + 1,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    epicTasks,
    highTasks,
    mediumTasks,
    lowTasks,
    completionPercentage,
  };
};

export const getDeveloperStats = async (
  userId: string
): Promise<DeveloperStats> => {
  const user = await User.findById(userId)
    .select("fullName username profileImage")
    .exec();

  if (!user) {
    throw createNotFoundError("User");
  }

  const projects = await Project.find({
    $or: [{ owner: userId }, { members: userId }],
  }).exec();

  const projectIds = projects.map((p) => p._id);

  const tasks = await Task.find({
    assignee: userId,
    ...(projectIds.length > 0 ? { project: { $in: projectIds } } : {}),
  }).exec();

  const totalTasksAssigned = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;

  const completionPercentage =
    totalTasksAssigned > 0
      ? Math.round((completedTasks / totalTasksAssigned) * 100)
      : 0;

  return {
    userId: user.id.toString(),
    fullName: user.fullName,
    username: user.username,
    profileImage: user.profileImage,
    totalTasksAssigned,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    completionPercentage,
    projectsCount: projects.length,
  };
};