import dotenv from "dotenv";

dotenv.config();

const requiredEnvironmentVariables = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

if (process.env.NODE_ENV === "production") {
  requiredEnvironmentVariables.push("CLIENT_URL");
}

for (const variable of requiredEnvironmentVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is not defined in .env`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri: process.env.MONGODB_URI as string,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,

  clientUrl:
    process.env.CLIENT_URL || "http://localhost:5173",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
};