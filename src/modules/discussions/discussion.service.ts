import mongoose from "mongoose";

import {
  DiscussionMessage,
  Conversation,
} from "./discussion.model.js";

import { Project } from "../projects/project.model.js";

import { createNotFoundError, createForbiddenError } from "../../utils/apiError.js";

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

export const getMessages = async (
  projectId: string,
  userId: string
) => {
  const member = await isProjectMember(projectId, userId);

  if (!member) {
    throw createForbiddenError("Access denied");
  }

  const messages = await DiscussionMessage.find({
    projectId: new mongoose.Types.ObjectId(projectId).toString(),
  })
    .populate("senderId", "fullName email")
    .sort({ createdAt: 1 })
    .exec();

  return messages;
};

export const getConversations = async (userId: string) => {
  const projects = await Project.find({
    $or: [
      { owner: new mongoose.Types.ObjectId(userId).toString() },
      { members: new mongoose.Types.ObjectId(userId).toString() },
    ],
  });

  const projectIds = projects.map((p) => p._id);

  const conversations = await Conversation.find({
    projectId: { $in: projectIds },
  })
    .populate("projectId", "name")
    .populate("lastMessage", "content senderId createdAt")
    .sort({ updatedAt: -1 })
    .exec();

  return conversations;
};

export const ensureConversation = async (projectId: string) => {
  let conv = await Conversation.findOne({ projectId });

  if (!conv) {
    conv = await Conversation.create({
      projectId: new mongoose.Types.ObjectId(projectId).toString(),
    });
  }

  return conv;
};