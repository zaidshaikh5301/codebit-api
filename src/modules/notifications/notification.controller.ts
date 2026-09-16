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

import * as notificationService from "./notification.service.js";

import {
  notificationIdSchema,
  listNotificationsQuerySchema,
} from "./notification.validation.js";

export const listNotifications =
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

    const query =
      listNotificationsQuerySchema.parse({
        page: req.query.page,
        limit: req.query.limit,
        read: req.query.read,
      });

    const result =
      await notificationService.getUserNotifications(
        req.user.userId,
        {
          page: query.page,
          limit: query.limit,
          read: query.read,
        }
      );

    return sendSuccess(
      res,
      200,
      "Notifications retrieved successfully",
      result.notifications
    );
  };

export const getUnreadCount =
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

    const count =
      await notificationService.getUnreadCount(
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "Unread count retrieved successfully",
      { count }
    );
  };

export const markRead =
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
      notificationIdSchema.parse({
        id: req.params.id,
      });

    const notification =
      await notificationService.markAsRead(
        parsed.id,
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "Notification marked as read",
      notification
    );
  };

export const markAllRead =
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

    const updated =
      await notificationService.markAllAsRead(
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      `${updated} notifications marked as read`,
      { updated }
    );
  };

export const deleteNotification =
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
      notificationIdSchema.parse({
        id: req.params.id,
      });

    await notificationService.deleteNotificationById(
      parsed.id,
      req.user.userId
    );

    return sendSuccess(
      res,
      200,
      "Notification deleted successfully",
      null
    );
  };
