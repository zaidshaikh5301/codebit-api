import http from "node:http";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { setupSocketIO } from "./config/socket.js";
import "./modules/users/user.model.js";
import "./modules/projects/project.model.js";
import "./modules/applications/application.model.js";
import "./modules/tasks/task.model.js";
import "./modules/discussions/discussion.model.js";
import "./modules/notifications/notificaion.model.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = http.createServer(app);

  setupSocketIO(server);

  server.listen(env.port, () => {
    console.log(
      `Codebit API running on http://localhost:${env.port}`
    );
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
