import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const notificationTypeSchema = z.enum([
  "new_application",
  "application_accepted",
  "application_rejected",
  "new_member",
  "member_removed",
  "task_assigned",
  "task_status_changed",
  "new_message",
]);

export const notificationIdSchema = z
  .object({
    id: z
      .string()
      .refine((val) => objectIdRegex.test(val), {
        message: "Invalid notification ID",
      }),
  })
  .strict();

export const listNotificationsQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) =>
        val ? Math.max(Number(val), 1) : 1
      ),
    limit: z
      .string()
      .optional()
      .transform((val) =>
        val
          ? Math.min(Math.max(Number(val), 1), 50)
          : 20
      ),
    read: z
      .string()
      .optional()
      .transform((val) =>
        val === "true"
          ? true
          : val === "false"
          ? false
          : undefined
      ),
  })
  .strict();

export type NotificationIdInput = z.infer<
  typeof notificationIdSchema
>;

export type ListNotificationsQueryInput = z.infer<
  typeof listNotificationsQuerySchema
>;

export type { NotificationType } from "./notificaion.model.js";