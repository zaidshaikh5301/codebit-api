import { User } from "./user.model.js";

import {
  UpdateProfileInput,
} from "./user.validation.js";

import { AppError, createNotFoundError, createConflictError } from "../../utils/apiError.js";

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw createNotFoundError("User");
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput
) => {
  if (input.username) {
    const existingUser = await User.findOne({
      username: input.username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw createConflictError("Username is already taken");
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: input },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw createNotFoundError("User");
  }

  return user;
};

interface DeveloperQuery {
  search?: string;
  skill?: string;
  page: number;
  limit: number;
}

export const getDevelopers = async ({
  search,
  skill,
  page,
  limit,
}: DeveloperQuery) => {
  const filter: Record<string, unknown> = {
    isActive: true,
  };

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { bio: { $regex: search, $options: "i" } },
    ];
  }

  if (skill) {
    filter.skills = { $regex: skill, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [developers, total] = await Promise.all([
    User.find(filter)
      .select(
        "fullName username profileImage bio skills experience githubUsername linkedinUrl portfolioUrl createdAt"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(filter),
  ]);

  return {
    developers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDeveloperById = async (userId: string) => {
  const developer = await User.findOne({
    _id: userId,
    isActive: true,
  }).select(
    "fullName username profileImage bio skills experience githubUsername linkedinUrl portfolioUrl createdAt"
  );

  if (!developer) {
    throw createNotFoundError("Developer");
  }

  return developer;
};