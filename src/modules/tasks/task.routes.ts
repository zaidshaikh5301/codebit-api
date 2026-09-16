import { Router } from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  createNewTask,
  listTasks,
  getTask,
  updateExistingTask,
  updateTaskStatusValue,
  deleteTaskById,
} from "./task.controller.js";

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priority
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [epic, high, medium, low]
 *               projectId:
 *                 type: string
 *               assignee:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not a project member
 *       404:
 *         description: Project not found
 */
router.post(
  "/",
  authenticate,
  createNewTask
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by project
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [epic, high, medium, low]
 *         description: Filter by priority
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  authenticate,
  listTasks
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags:
 *       - Tasks
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
 *         description: Task retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 */
router.get(
  "/:id",
  authenticate,
  getTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update a task (description, priority only)
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [epic, high, medium, low]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not a project member
 *       404:
 *         description: Task not found
 */
router.patch(
  "/:id",
  authenticate,
  updateExistingTask
);

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not a project member
 *       404:
 *         description: Task not found
 */
router.patch(
  "/:id/status",
  authenticate,
  updateTaskStatusValue
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task (owner only)
 *     tags:
 *       - Tasks
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
 *         description: Task deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not project owner
 *       404:
 *         description: Task not found
 */
router.delete(
  "/:id",
  authenticate,
  deleteTaskById
);

export default router;