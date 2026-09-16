import mongoose, {
  Document,
  Schema,
} from "mongoose";

import { User } from "../users/user.model.js";

export type ProjectStatus =
  | "planning"
  | "active"
  | "completed";

export interface IProject
  extends Document {
  name: string;
  description: string;
  status: ProjectStatus;
  technologies: string[];
  owner:
    | mongoose.Types.ObjectId
    | typeof User;
  members:
    mongoose.Types.ObjectId[];
  tasks:
    mongoose.Types.ObjectId[];
  completedTasks: number;
  createdAt: Date;
  updatedAt: Date;
  githubRepo?: string;
  githubRepoUrl?: string;
}

const projectSchema =
  new Schema<IProject>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      status: {
        type: String,
        enum: [
          "planning",
          "active",
          "completed",
        ],
        default: "planning",
      },

      technologies: {
        type: [
          {
            type: String,
            trim: true,
            maxlength: 50,
          }
        ],
        required: true,
        default: [],
        validate: {
          validator: function (
            v: string[]
          ) {
            return (
              Array.isArray(v) &&
              v.length > 0
            );
          },
          message:
            "At least one technology is required",
        },
      },

      owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      members: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          }
        ],
        default: [],
      },

      tasks: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "Task",
          }
        ],
        default: [],
      },

      completedTasks: {
        type: Number,
        default: 0,
      },

      githubRepo: {
        type: String,
        trim: true,
      },

      githubRepoUrl: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

projectSchema.index({
  name: 1,
});

projectSchema.index({
  owner: 1,
});

projectSchema.index({
  status: 1,
});

projectSchema.index({
  technologies: 1,
});

export const Project =
  mongoose.model<IProject>(
    "Project",
    projectSchema
  );
