import mongoose, {
  Document,
  Schema,
} from "mongoose";

import { Project } from "../projects/project.model.js";
import { User } from "../users/user.model.js";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected";

export interface IApplication
  extends Document {
  projectId:
    mongoose.Types.ObjectId;
  applicantId:
    mongoose.Types.ObjectId;
  status: ApplicationStatus;
  coverLetter?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema =
  new Schema<IApplication>(
    {
      projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },

      applicantId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "accepted",
          "rejected",
        ],
        default: "pending",
      },

      coverLetter: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
    {
      timestamps: true,
    }
  );

applicationSchema.index({
  projectId: 1,
  applicantId: 1,
});

applicationSchema.index({
  status: 1,
});

applicationSchema.index({
  createdAt: -1,
});

export const Application =
  mongoose.model<IApplication>(
    "Application",
    applicationSchema
  );
