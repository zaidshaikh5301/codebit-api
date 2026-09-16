import {
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../../middleware/auth.middleware.js";

import {
  sendSuccess,
} from "../../utils/apiResponse.js";

import {
  signupSchema,
  loginSchema,
} from "./auth.validation.js";

import * as authService
  from "./auth.service.js";

export const signup =
  async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    const input =
      signupSchema.parse(
        req.body
      );

    const result =
      await authService.signup(
        input
      );

    return sendSuccess(
      res,
      201,
      "Account created successfully",
      result
    );
  };

export const login =
  async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    const input =
      loginSchema.parse(
        req.body
      );

    const result =
      await authService.login(
        input
      );

    return sendSuccess(
      res,
      200,
      "Login successful",
      result
    );
  };

export const me =
  async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const user =
      await authService.getMe(
        req.user.userId
      );

    return sendSuccess(
      res,
      200,
      "User retrieved successfully",
      user
    );
  };

export const logout =
  async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    await authService.logout(
      req.user.userId
    );

    return sendSuccess(
      res,
      200,
      "Logout successful",
      null
    );
  };