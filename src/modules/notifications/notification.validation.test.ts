import { describe, it, expect } from "vitest";

import {
  notificationTypeSchema,
  notificationIdSchema,
  listNotificationsQuerySchema,
} from "./notification.validation.js";

describe("Notification Validation", () => {
  const validId = "0123456789abcdef01234567";

  it("validates notification type enum", () => {
    const validTypes = [
      "new_application",
      "application_accepted",
      "application_rejected",
      "new_member",
      "member_removed",
      "task_assigned",
      "task_status_changed",
      "new_message",
    ];

    for (const type of validTypes) {
      const result = notificationTypeSchema.safeParse(type);
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid notification type", () => {
    const result = notificationTypeSchema.safeParse("invalid_type");
    expect(result.success).toBe(false);
  });

  it("validates notification ID schema", () => {
    const result =
      notificationIdSchema.safeParse({
        id: validId,
      });
    expect(result.success).toBe(true);
  });

  it("rejects invalid notification ID", () => {
    const result =
      notificationIdSchema.safeParse({
        id: "invalid",
      });
    expect(result.success).toBe(false);
  });

  it("validates list notifications query", () => {
    const result =
      listNotificationsQuerySchema.safeParse({
        page: "1",
        limit: "20",
        read: "true",
      });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.read).toBe(true);
    }
  });

  it("defaults query values", () => {
    const result =
      listNotificationsQuerySchema.safeParse(
        {}
      );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.read).toBeUndefined();
    }
  });
});
