import mongoose from "mongoose";

import { Project } from "./project.model.js";

import {
  CreateProjectInput,
  UpdateProjectInput,
} from "./project.validation.js";

import {
  AppError,
  createNotFoundError,
  createForbiddenError,
} from "../../utils/apiError.js";

export const createProject = async (
  input: CreateProjectInput,
  ownerId: string
) => {
  const project = await Project.create({
    ...input,
    owner: new mongoose.Types.ObjectId(ownerId).toString(),
    members: [],
    tasks: [],
    completedTasks: 0,
  });

  return Project.findById(project._id)
    .populate("owner", "fullName email")
    .populate("members", "fullName email")
    .exec();
};

export const getProjects = async (userId: string) => {
  const projects = await Project.find({
    $or: [
      { owner: new mongoose.Types.ObjectId(userId).toString() },
      { members: new mongoose.Types.ObjectId(userId).toString() },
    ],
  })
    .populate("owner", "fullName email")
    .populate("members", "fullName email")
    .sort({ createdAt: -1 })
    .exec();

  return projects;
};

export const getProjectById = async (id: string) => {
  const project = await Project.findById(id)
    .populate("owner", "fullName email")
    .populate("members", "fullName email")
    .exec();

  if (!project) {
    throw createNotFoundError("Project");
  }

  return project;
};

export const updateProject = async (
  id: string,
  input: UpdateProjectInput,
  userId: string
) => {
  const project = await Project.findById(id);

  if (!project) {
    throw createNotFoundError("Project");
  }

  if (project.owner.toString() !== userId) {
    throw createForbiddenError("You are not authorized to update this project");
  }

  Object.assign(project, input);

  await project.save();

  return Project.findById(id)
    .populate("owner", "fullName email")
    .populate("members", "fullName email")
    .exec();
};

export const deleteProject = async (
  id: string,
  userId: string
) => {
  const project = await Project.findById(id);

  if (!project) {
    throw createNotFoundError("Project");
  }

  if (project.owner.toString() !== userId) {
    throw createForbiddenError("You are not authorized to delete this project");
  }

  await project.deleteOne();

  return;
};