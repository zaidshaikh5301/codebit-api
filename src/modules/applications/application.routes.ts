import { Router } from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  apply,
  listApplications,
  getApplication,
  accept,
  reject,
} from "./application.controller.js";

const router = Router();

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Apply to a project
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *             properties:
 *               projectId:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Project not found
 *       409:
 *         description: Application already submitted
 */
router.post(
  "/",
  authenticate,
  apply
);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications for projects owned by the user
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  authenticate,
  listApplications
);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags:
 *       - Applications
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
 *         description: Application retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Application not found
 */
router.get(
  "/:id",
  authenticate,
  getApplication
);

/**
 * @swagger
 * /api/applications/{id}/accept:
 *   patch:
 *     summary: Accept an application
 *     tags:
 *       - Applications
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
 *         description: Application accepted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Application not found
 *       409:
 *         description: Already processed
 */
router.patch(
  "/:id/accept",
  authenticate,
  accept
);

/**
 * @swagger
 * /api/applications/{id}/reject:
 *   patch:
 *     summary: Reject an application
 *     tags:
 *       - Applications
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
 *         description: Application rejected
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Application not found
 *       409:
 *         description: Already processed
 */
router.patch(
  "/:id/reject",
  authenticate,
  reject
);

export default router;
