import { Router } from "express";

import { healthCheck } from "../controllers/health.controller.js";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Returns the current health status of the Codebit API.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *       503:
 *         description: API is degraded (database disconnected)
 */
router.get("/", healthCheck);

export default router;