import mongoose, {
  Document,
  Schema,
} from "mongoose";

import { Project } from "../projects/project.model.js";
import { User } from "../users/user.model.js";

export interface IDiscussionMessage
  extends Document {
  projectId:
    mongoose.Types.ObjectId;
  senderId:
    mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const discussionMessageSchema =
  new Schema<IDiscussionMessage>(
    {
      projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },

      senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
      },
    },
    {
      timestamps: true,
    }
  );

discussionMessageSchema.index({
  projectId: 1,
});

discussionMessageSchema.index({
  senderId: 1,
});

discussionMessageSchema.index({
  createdAt: -1,
});

export const DiscussionMessage =
  mongoose.model<IDiscussionMessage>(
    "DiscussionMessage",
    discussionMessageSchema
  );

export interface IConversation
  extends Document {
  projectId:
    mongoose.Types.ObjectId;
  lastMessage:
    mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const conversationSchema =
  new Schema<IConversation>(
    {
      projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },

      lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "DiscussionMessage",
      },
    },
    {
      timestamps: true,
    }
  );

conversationSchema.index({
  projectId: 1,
});

conversationSchema.index({
  updatedAt: -1,
});

export const Conversation =
  mongoose.model<IConversation>(
    "Conversation",
    conversationSchema
  );
