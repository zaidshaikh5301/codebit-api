import jwt, {
  JwtPayload as JwtPayloadType,
} from "jsonwebtoken";

import { env } from "../config/env.js";

export interface JwtPayload
  extends JwtPayloadType {
  userId: string;
}

export const generateAccessToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    env.jwtAccessSecret,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    env.jwtRefreshSecret,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyAccessToken = (
  token: string
): JwtPayload => {
  const decoded =
    jwt.verify(
      token,
      env.jwtAccessSecret
    ) as JwtPayload;

  return decoded;
};

export const verifyRefreshToken = (
  token: string
): JwtPayload => {
  const decoded =
    jwt.verify(
      token,
      env.jwtRefreshSecret
    ) as JwtPayload;

  return decoded;
};
