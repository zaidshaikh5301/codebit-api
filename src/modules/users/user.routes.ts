import { Router } from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  getProfile,
  updateProfile,
  getDevelopers,
  getDeveloperById,
} from "./user.controller.js";

const router = Router();

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/me",
  authenticate,
  getProfile
);

/**
 * @swagger
 * /api/me:
 *   put:
 *     summary: Update authenticated user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Authentication required
 */
router.put(
  "/me",
  authenticate,
  updateProfile
);

/**
 * @swagger
 * /api/developers:
 *   get:
 *     summary: Get all developers
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, username, or bio
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *         description: Filter by skill
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Developers retrieved successfully
 */
router.get(
  "/developers",
  authenticate,
  getDevelopers
);

/**
 * @swagger
 * /api/developers/{id}:
 *   get:
 *     summary: Get developer by ID
 *     tags:
 *       - Users
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
 *         description: Developer retrieved successfully
 *       400:
 *         description: Invalid developer ID
 *       404:
 *         description: Developer not found
 */
router.get(
  "/developers/:id",
  authenticate,
  getDeveloperById
);

export default router;
