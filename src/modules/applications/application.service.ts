import mongoose from "mongoose";

import { Application } from "./application.model.js";

import { Project } from "../projects/project.model.js";

import { CreateApplicationInput } from "./application.validation.js";

import {
  createNotFoundError,
  createForbiddenError,
  createConflictError,
  createValidationError,
} from "../../utils/apiError.js";

import * as notificationService from "../notifications/notification.service.js";

export const applyToProject = async (
  input: CreateApplicationInput,
  applicantId: string
) => {
  const project = await Project.findById(input.projectId);

  if (!project) {
    throw createNotFoundError("Project");
  }

  if (project.owner.toString() === applicantId) {
    throw createValidationError("You cannot apply to your own project");
  }

  const existing = await Application.findOne({
    projectId: input.projectId,
    applicantId,
    status: { $in: ["pending", "accepted"] },
  });

  if (existing) {
    if (existing.status === "accepted") {
      throw createConflictError("You are already a member of this project");
    }
    throw createConflictError("Application already submitted");
  }

  const application = await Application.create({
    projectId: new mongoose.Types.ObjectId(input.projectId).toString(),
    applicantId: new mongoose.Types.ObjectId(applicantId).toString(),
    coverLetter: input.coverLetter,
    status: "pending",
  });

  await notificationService.sendNotification({
    recipientId: project.owner.toString(),
    actorId: applicantId,
    type: "new_application",
    title: "New project application",
    message: `New application submitted for ${project.name}`,
    projectId: input.projectId,
    relatedId: application._id.toString(),
  });

  return Application.findById(application._id)
    .populate("projectId", "name description status")
    .populate("applicantId", "fullName email")
    .exec();
};

export const getApplications = async (userId: string) => {
  const projects = await Project.find({
    owner: new mongoose.Types.ObjectId(userId).toString(),
  });

  const projectIds = projects.map((p) => p._id);

  return Application.find({
    projectId: { $in: projectIds },
  })
    .populate("projectId", "name")
    .populate("applicantId", "fullName email")
    .sort({ createdAt: -1 })
    .exec();
};

export const getApplicationById = async (id: string) => {
  const application = await Application.findById(id)
    .populate("projectId", "name description status")
    .populate("applicantId", "fullName email")
    .exec();

  if (!application) {
    throw createNotFoundError("Application");
  }

  return application;
};

export const acceptApplication = async (
  id: string,
  userId: string
) => {
  const application = await Application.findById(id);

  if (!application) {
    throw createNotFoundError("Application");
  }

  const project = await Project.findById(application.projectId);

  if (!project) {
    throw createNotFoundError("Project");
  }

  if (project.owner.toString() !== userId) {
    throw createForbiddenError(
      "Only the project owner can manage applications"
    );
  }

  if (application.status !== "pending") {
    throw createConflictError("Application has already been processed");
  }

  await Project.findByIdAndUpdate(application.projectId, {
    $addToSet: { members: application.applicantId },
  });

  application.status = "accepted";

  await application.save();

  await notificationService.sendNotification({
    recipientId: application.applicantId.toString(),
    actorId: userId,
    type: "application_accepted",
    title: "Application accepted",
    message: `Your application for ${project.name} has been accepted`,
    projectId: application.projectId.toString(),
    relatedId: application._id.toString(),
  });

  return Application.findById(id)
    .populate("projectId", "name description status")
    .populate("applicantId", "fullName email")
    .exec();
};

export const rejectApplication = async (
  id: string,
  userId: string
) => {
  const application = await Application.findById(id);

  if (!application) {
    throw createNotFoundError("Application");
  }

  const project = await Project.findById(application.projectId);

  if (!project) {
    throw createNotFoundError("Project");
  }

  if (project.owner.toString() !== userId) {
    throw createForbiddenError(
      "Only the project owner can manage applications"
    );
  }

  if (application.status !== "pending") {
    throw createConflictError("Application has already been processed");
  }

  application.status = "rejected";

  await application.save();

  await notificationService.sendNotification({
    recipientId: application.applicantId.toString(),
    actorId: userId,
    type: "application_rejected",
    title: "Application rejected",
    message: `Your application for ${project.name} has been rejected`,
    projectId: application.projectId.toString(),
    relatedId: application._id.toString(),
  });

  return Application.findById(id)
    .populate("projectId", "name description status")
    .populate("applicantId", "fullName email")
    .exec();
};