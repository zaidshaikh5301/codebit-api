import mongoose from "mongoose";

import {
  Notification,
  NotificationType,
} from "./notificaion.model.js";

import { Project } from "../projects/project.model.js";
import { User } from "../users/user.model.js";

import { createNotFoundError } from "../../utils/apiError.js";
import { getIO } from "../../config/socket.js";

interface CreateNotificationInput {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  title: string;
  message: string;
  projectId?: string;
  relatedId?: string;
}

export const sendNotification = async (
  input: CreateNotificationInput
) => {
  const notification = await Notification.create({
    recipientId: new mongoose.Types.ObjectId(
      input.recipientId
    ).toString(),

    actorId: new mongoose.Types.ObjectId(input.actorId).toString(),

    type: input.type,
    title: input.title,
    message: input.message,
    projectId: input.projectId
      ? new mongoose.Types.ObjectId(input.projectId).toString()
      : undefined,
    relatedId: input.relatedId
      ? new mongoose.Types.ObjectId(input.relatedId).toString()
      : undefined,
    isRead: false,
  });

  const populated = await Notification.findById(notification._id)
    .populate("actorId", "fullName email profileImage")
    .populate("projectId", "name")
    .exec();

  const io = getIO();
  if (io) {
    io.to(`user_${input.recipientId}`).emit("notification", populated);
  }

  return populated;
};

export const createNotification = async (
  input: CreateNotificationInput
) => {
  const notification = await Notification.create({
    recipientId: new mongoose.Types.ObjectId(
      input.recipientId
    ).toString(),

    actorId: new mongoose.Types.ObjectId(input.actorId).toString(),

    type: input.type,
    title: input.title,
    message: input.message,
    projectId: input.projectId
      ? new mongoose.Types.ObjectId(input.projectId).toString()
      : undefined,
    relatedId: input.relatedId
      ? new mongoose.Types.ObjectId(input.relatedId).toString()
      : undefined,
    isRead: false,
  });

  const populated = await Notification.findById(notification._id)
    .populate("actorId", "fullName email profileImage")
    .populate("projectId", "name")
    .exec();

  return populated;
};

export const getUserNotifications = async (
  userId: string,
  options: {
    page: number;
    limit: number;
    read?: boolean;
  }
) => {
  const filter: Record<string, unknown> = {
    recipientId: new mongoose.Types.ObjectId(userId).toString(),
  };

  if (options.read !== undefined) {
    filter.isRead = options.read;
  }

  const skip = (options.page - 1) * options.limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate("actorId", "fullName email profileImage")
      .populate("projectId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(options.limit)
      .exec(),

    Notification.countDocuments(filter),

    Notification.countDocuments({
      recipientId: new mongoose.Types.ObjectId(userId).toString(),
      isRead: false,
    }),
  ]);

  return {
    notifications,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit),
    },
    unreadCount,
  };
};

export const getUnreadCount = async (
  userId: string
): Promise<number> => {
  return Notification.countDocuments({
    recipientId: new mongoose.Types.ObjectId(userId).toString(),
    isRead: false,
  });
};

export const markAsRead = async (
  notificationId: string,
  userId: string
) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipientId: userId,
  }).exec();

  if (!notification) {
    throw createNotFoundError("Notification");
  }

  notification.isRead = true;
  await notification.save();

  return notification.populate([
    {
      path: "actorId",
      select: "fullName email profileImage",
    },
    {
      path: "projectId",
      select: "name",
    },
  ]);
};

export const markAllAsRead = async (
  userId: string
): Promise<number> => {
  const result = await Notification.updateMany(
    {
      recipientId: new mongoose.Types.ObjectId(userId).toString(),
      isRead: false,
    },
    { $set: { isRead: true } }
  ).exec();

  return result.modifiedCount;
};

export const deleteNotificationById = async (
  notificationId: string,
  userId: string
) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipientId: userId,
  }).exec();

  if (!notification) {
    throw createNotFoundError("Notification");
  }

  return;
};

export type { CreateNotificationInput };