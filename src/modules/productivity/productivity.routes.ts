import { Router } from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  getProjectProductivity,
  getDeveloperProductivity,
  getMyProductivity,
} from "./productivity.controller.js";

const router = Router();

/**
 * @swagger
 * /api/productivity/projects/{id}:
 *   get:
 *     summary: Get project productivity statistics
 *     tags:
 *       - Productivity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project productivity retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not a project member
 *       404:
 *         description: Project not found
 */
router.get(
  "/projects/:id",
  authenticate,
  getProjectProductivity
);

/**
 * @swagger
 * /api/productivity/developers/{id}:
 *   get:
 *     summary: Get developer productivity statistics
 *     tags:
 *       - Productivity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Developer productivity retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.get(
  "/developers/:id",
  authenticate,
  getDeveloperProductivity
);

/**
 * @swagger
 * /api/productivity/me:
 *   get:
 *     summary: Get current user productivity statistics
 *     tags:
 *       - Productivity
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Your productivity retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/me",
  authenticate,
  getMyProductivity
);

export default router;
