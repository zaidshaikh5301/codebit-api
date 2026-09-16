import mongoose, {
  Document,
  Schema,
} from "mongoose";

import { Project } from "../projects/project.model.js";
import { User } from "../users/user.model.js";

export type NotificationType =
  | "new_application"
  | "application_accepted"
  | "application_rejected"
  | "new_member"
  | "member_removed"
  | "task_assigned"
  | "task_status_changed"
  | "new_message";

export interface INotification
  extends Document {
  recipientId:
    mongoose.Types.ObjectId;
  actorId:
    mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  projectId:
    mongoose.Types.ObjectId;
  relatedId:
    mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema =
  new Schema<INotification>(
    {
      recipientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      actorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "new_application",
          "application_accepted",
          "application_rejected",
          "new_member",
          "member_removed",
          "task_assigned",
          "task_status_changed",
          "new_message",
        ],
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        index: true,
      },

      relatedId: {
        type: Schema.Types.ObjectId,
      },

      isRead: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

notificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  createdAt: -1,
});

export const Notification =
  mongoose.model<INotification>(
    "Notification",
    notificationSchema
  );
