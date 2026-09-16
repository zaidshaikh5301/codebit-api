import { Router } from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  createNewProject,
  listProjects,
  getProject,
  updateExistingProject,
  deleteProjectById,
} from "./project.controller.js";

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - technologies
 *             properties:
 *               name:
 *                 type: string
 *                 example: Codebit Frontend
 *               description:
 *                 type: string
 *                 example: The main web application for Codebit
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "TypeScript", "Tailwind CSS"]
 *               status:
 *                 type: string
 *                 enum: [planning, active, completed]
 *     responses:
 *       201:
 *         description: Project created successfully
 *       401:
 *         description: Authentication required
 *       400:
 *         description: Validation failed
 */
router.post(
  "/",
  authenticate,
  createNewProject
);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  authenticate,
  listProjects
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags:
 *       - Projects
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
 *         description: Project retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Project not found
 */
router.get(
  "/:id",
  authenticate,
  getProject
);

/**
 * @swagger
 * /api/projects/{id}:
 *   patch:
 *     summary: Update a project
 *     tags:
 *       - Projects
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [planning, active, completed]
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 */
router.patch(
  "/:id",
  authenticate,
  updateExistingProject
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags:
 *       - Projects
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
 *         description: Project deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 */
router.delete(
  "/:id",
  authenticate,
  deleteProjectById
);

export default router;
