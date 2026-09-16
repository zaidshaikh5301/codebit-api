import mongoose, {
  Document,
  Schema,
} from "mongoose";

import { Project } from "../projects/project.model.js";
import { User } from "../users/user.model.js";

export type TaskPriority =
  | "epic"
  | "high"
  | "medium"
  | "low";

export type TaskStatus =
  | "pending"
  | "in-progress"
  | "completed";

export interface ITask
  extends Document {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  project:
    mongoose.Types.ObjectId;
  assignee?:
    mongoose.Types.ObjectId;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema =
  new Schema<ITask>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
      },

      priority: {
        type: String,
        enum: [
          "epic",
          "high",
          "medium",
          "low",
        ],
        required: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "in-progress",
          "completed",
        ],
        default: "pending",
      },

      project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },

      assignee: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      dueDate: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

taskSchema.index({
  project: 1,
});

taskSchema.index({
  status: 1,
});

taskSchema.index({
  priority: 1,
});

taskSchema.index({
  assignee: 1,
});

taskSchema.index({
  createdAt: -1,
});

export const Task =
  mongoose.model<ITask>(
    "Task",
    taskSchema
  );
