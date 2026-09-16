import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getMessages, listConversations } from "./discussion.controller.js";

const router = Router();

/**
 * @swagger
 * /api/discussions:
 *   get:
 *     summary: Get conversation list for the authenticated user
 *     tags:
 *       - Discussions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/", authenticate, listConversations);

/**
 * @swagger
 * /api/discussions/{projectId}/messages:
 *   get:
 *     summary: Get message history for a project
 *     tags:
 *       - Discussions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 */
router.get("/:projectId/messages", authenticate, getMessages);

export default router;
