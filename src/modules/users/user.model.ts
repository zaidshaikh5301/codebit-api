import mongoose, {
  Document,
  Schema,
} from "mongoose";

export type UserRole =
  | "user"
  | "admin";

export interface IUser
  extends Document {
  email: string;
  password: string;

  fullName: string;
  username?: string;

  profileImage?: string;
  bio?: string;

  skills: string[];

  experience?: string;

  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;

  role: UserRole;
  isActive: boolean;

  refreshToken?: string;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema =
  new Schema<IUser>(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
        select: false,
      },

      fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },

      username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30,
      },

      profileImage: {
        type: String,
        trim: true,
      },

      bio: {
        type: String,
        trim: true,
        maxlength: 500,
      },

      skills: {
        type: [String],
        default: [],
      },

      experience: {
        type: String,
        trim: true,
        maxlength: 2000,
      },

      githubUsername: {
        type: String,
        trim: true,
      },

      linkedinUrl: {
        type: String,
        trim: true,
      },

      portfolioUrl: {
        type: String,
        trim: true,
      },

      role: {
        type: String,
        enum: [
          "user",
          "admin",
        ],
        default: "user",
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      refreshToken: {
        type: String,
        select: false,
      },
    },
    {
      timestamps: true,
    }
  );

userSchema.index({
  fullName: 1,
});

userSchema.index({
  skills: 1,
});

userSchema.index({
  createdAt: -1,
});

export const User =
  mongoose.model<IUser>(
    "User",
    userSchema
  );