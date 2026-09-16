import bcrypt from "bcryptjs";

import {
  User,
} from "../users/user.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.js";

import {
  LoginInput,
  SignupInput,
} from "./auth.validation.js";

export const signup =
  async (
    input: SignupInput
  ) => {
    const existingUser =
      await User.findOne({
        email: input.email,
      });

    if (existingUser) {
      throw new Error(
        "Email is already registered"
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        input.password,
        12
      );

    const user =
      await User.create({
        email: input.email,
        password:
          hashedPassword,
        fullName:
          input.fullName,
      });

    const accessToken =
      generateAccessToken(
        user.id
      );

    const refreshToken =
      generateRefreshToken(
        user.id
      );

    user.refreshToken =
      await bcrypt.hash(
        refreshToken,
        12
      );

    await user.save();

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName:
          user.fullName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  };

export const login =
  async (
    input: LoginInput
  ) => {
    const user =
      await User.findOne({
        email: input.email,
      }).select(
        "+password +refreshToken"
      );

    if (!user) {
      throw new Error(
        "Invalid email or password"
      );
    }

    if (!user.isActive) {
      throw new Error(
        "User account is inactive"
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        input.password,
        user.password
      );

    if (!passwordMatches) {
      throw new Error(
        "Invalid email or password"
      );
    }

    const accessToken =
      generateAccessToken(
        user.id
      );

    const refreshToken =
      generateRefreshToken(
        user.id
      );

    user.refreshToken =
      await bcrypt.hash(
        refreshToken,
        12
      );

    await user.save();

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName:
          user.fullName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  };

export const getMe =
  async (
    userId: string
  ) => {
    const user =
      await User.findById(
        userId
      ).select(
        "-password -refreshToken"
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    return user;
  };

export const logout =
  async (
    userId: string
  ): Promise<void> => {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1,
        },
      }
    );
  };