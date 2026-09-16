import { Router } from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  getGitHubProfile,
  getGitHubRepos,
  connectGitHubRepo,
} from "./github.controller.js";

const router = Router();

/**
 * @swagger
 * /api/github/developers/{username}:
 *   get:
 *     summary: Get GitHub profile for a developer
 *     tags:
 *       - GitHub
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: GitHub profile retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: GitHub user not found
 *       429:
 *         description: GitHub API rate limit exceeded
 *       502:
 *         description: GitHub API request failed
 */
router.get(
  "/developers/:username",
  authenticate,
  getGitHubProfile
);

/**
 * @swagger
 * /api/github/developers/{username}/repos:
 *   get:
 *     summary: Get GitHub repositories for a developer
 *     tags:
 *       - GitHub
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: GitHub repositories retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: GitHub user not found
 *       429:
 *         description: GitHub API rate limit exceeded
 *       502:
 *         description: GitHub API request failed
 */
router.get(
  "/developers/:username/repos",
  authenticate,
  getGitHubRepos
);

/**
 * @swagger
 * /api/projects/{id}/github:
 *   patch:
 *     summary: Connect a GitHub repository to a project
 *     tags:
 *       - GitHub
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
 *               - repoUrl
 *             properties:
 *               repoUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://github.com/owner/repo
 *     responses:
 *       200:
 *         description: GitHub repository connected successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 */
router.patch(
  "/projects/:id/github",
  authenticate,
  connectGitHubRepo
);

export default router;
