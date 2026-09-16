import { Server, Socket } from "socket.io";
import http from "node:http";
import mongoose from "mongoose";

import {
  verifyAccessToken,
  JwtPayload,
} from "../utils/jwt.js";

import { Project } from "../modules/projects/project.model.js";
import {
  DiscussionMessage,
} from "../modules/discussions/discussion.model.js";
import { Notification } from "../modules/notifications/notificaion.model.js";

import { env } from "./env.js";

interface SocketWithUser extends Socket {
  userId?: string;
}

let ioInstance: Server | null = null;

export const getIO = (): Server | null => {
  return ioInstance;
};

export const setupSocketIO = (
  httpServer: http.Server
): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
    path: "/socket.io",
  });

  ioInstance = io;

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication token is required"));
    }

    try {
      const payload = verifyAccessToken(token) as JwtPayload;
      (socket as SocketWithUser).userId = payload.userId;
      next();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
          return next(new Error("Token expired"));
        }
        if (error.name === "JsonWebTokenError") {
          return next(new Error("Invalid token"));
        }
      }
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket: SocketWithUser) => {
    const userId = socket.userId!;

    socket.join(`user_${userId}`);

    const checkProjectAccess = async (
      projectId: string
    ): Promise<boolean> => {
      if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
        return false;
      }

      try {
        const project = await Project.findById(projectId);
        if (!project) return false;
        const isOwner = project.owner.toString() === userId;
        const isMember = project.members.some(
          (m) => m.toString() === userId
        );
        return isOwner || isMember;
      } catch {
        return false;
      }
    };

    socket.on("join", async (projectId: string, cb) => {
      try {
        if (!projectId || !/^[0-9a-fA-F]{24}$/.test(projectId)) {
          cb?.({ success: false, error: "Invalid project ID" });
          return;
        }

        const hasAccess = await checkProjectAccess(projectId);
        if (!hasAccess) {
          cb?.({ success: false, error: "Access denied" });
          return;
        }

        socket.join(`project_${projectId}`);
        cb?.({ success: true });
      } catch (error) {
        cb?.({ success: false, error: "Failed to join project" });
      }
    });

    socket.on(
      "message",
      async (
        data: {
          projectId: string;
          content: string;
        },
        cb: (msg: unknown) => void
      ) => {
        try {
          if (
            !data.projectId ||
            !/^[0-9a-fA-F]{24}$/.test(data.projectId)
          ) {
            cb?.({ success: false, error: "Invalid project ID" });
            return;
          }

          if (
            !data.content ||
            typeof data.content !== "string" ||
            data.content.trim().length === 0
          ) {
            cb?.({ success: false, error: "Message content is required" });
            return;
          }

          if (data.content.length > 2000) {
            cb?.({ success: false, error: "Message too long (max 2000 characters)" });
            return;
          }

          const hasAccess = await checkProjectAccess(data.projectId);
          if (!hasAccess) {
            cb?.({ success: false, error: "Access denied" });
            return;
          }

          const message = await DiscussionMessage.create({
            projectId: new mongoose.Types.ObjectId(data.projectId),
            senderId: new mongoose.Types.ObjectId(userId),
            content: data.content.trim(),
          });

          const populated = await DiscussionMessage.findById(message._id)
            .populate("senderId", "fullName email")
            .exec();

          io.to(`project_${data.projectId}`).emit("message", populated);

          const project = await Project.findById(data.projectId)
            .select("owner members")
            .exec();

          if (project) {
            const recipientIds: string[] = [];

            if (project.owner.toString() !== userId) {
              recipientIds.push(project.owner.toString());
            }

            for (const memberId of project.members) {
              if (memberId.toString() !== userId) {
                recipientIds.push(memberId.toString());
              }
            }

            for (const recipientId of recipientIds) {
              const notification = await Notification.create({
                recipientId: new mongoose.Types.ObjectId(recipientId),
                actorId: new mongoose.Types.ObjectId(userId),
                type: "new_message",
                title: "New message in project",
                message: data.content.trim(),
                projectId: new mongoose.Types.ObjectId(data.projectId),
                relatedId: message._id,
                isRead: false,
              });

              const populatedNotification = await Notification.findById(
                notification._id
              )
                .populate("actorId", "fullName email")
                .populate("projectId", "name")
                .exec();

              io.to(`user_${recipientId}`).emit(
                "notification",
                populatedNotification
              );
            }
          }

          cb?.({ success: true, data: populated });
        } catch (error) {
          console.error("Socket message error:", error);
          cb?.({ success: false, error: "Failed to send message" });
        }
      }
    );

    socket.on(
      "typing",
      (data: { projectId: string }) => {
        if (data.projectId && /^[0-9a-fA-F]{24}$/.test(data.projectId)) {
          socket
            .to(`project_${data.projectId}`)
            .emit("typing", {
              userId,
              projectId: data.projectId,
            });
        }
      }
    );

    socket.on("disconnect", () => {
      void 0;
    });
  });

  return io;
};