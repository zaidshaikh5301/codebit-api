import { Project } from "../projects/project.model.js";

import {
  createNotFoundError,
  createForbiddenError,
  createValidationError,
  createExternalServiceError,
} from "../../utils/apiError.js";

interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  htmlUrl: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  topics: string[];
  defaultBranch: string;
  updatedAt: string;
  createdAt: string;
}

interface GitHubProfile {
  login: string;
  id: number;
  avatarUrl: string;
  bio?: string;
  location?: string;
  blog?: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

function parseGitHubRepoUrl(
  url: string
): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:$|\/|\?|#)/);

  if (!match) return null;

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");

  return { owner, repo };
}

async function fetchGitHub<T>(
  endpoint: string
): Promise<T> {
  const base = "https://api.github.com";

  const response = await fetch(`${base}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "Codebit-API",
    },
  });

  if (response.status === 404) {
    throw createNotFoundError("GitHub user or repository");
  }

  if (response.status === 403) {
    throw createExternalServiceError("GitHub");
  }

  if (!response.ok) {
    throw createExternalServiceError("GitHub");
  }

  return response.json() as Promise<T>;
}

export const fetchGitHubProfile = async (
  username: string
): Promise<GitHubProfile> => {
  const data = await fetchGitHub<GitHubProfile>(`/users/${username}`);

  return {
    login: data.login,
    id: data.id,
    avatarUrl: data.avatarUrl,
    bio: data.bio || "",
    location: data.location || "",
    blog: data.blog || "",
    publicRepos: data.publicRepos,
    followers: data.followers,
    following: data.following,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const fetchGitHubRepos = async (
  username: string
): Promise<GitHubRepo[]> => {
  const repos = await fetchGitHub<
    Array<{
      id: number;
      name: string;
      full_name: string;
      url: string;
      html_url: string;
      description?: string;
      language?: string;
      stargazers_count: number;
      forks_count: number;
      topics: string[];
      default_branch: string;
      updated_at: string;
      created_at: string;
    }>
  >(`/users/${username}/repos?sort=updated&per_page=30`);

  return repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    url: repo.url,
    htmlUrl: repo.html_url,
    description: repo.description || "",
    language: repo.language || "",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics,
    defaultBranch: repo.default_branch,
    updatedAt: repo.updated_at,
    createdAt: repo.created_at,
  }));
};

export const connectRepo = async (
  projectId: string,
  userId: string,
  repoUrl: string
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw createNotFoundError("Project");
  }

  if (project.owner.toString() !== userId) {
    throw createForbiddenError(
      "Only the project owner can connect a GitHub repository"
    );
  }

  const parsed = parseGitHubRepoUrl(repoUrl);

  if (!parsed) {
    throw createValidationError("Invalid GitHub repository URL");
  }

  const repoData = await fetchGitHub<{
    name: string;
    full_name: string;
    html_url: string;
    default_branch: string;
  }>(`/repos/${parsed.owner}/${parsed.repo}`);

  project.githubRepo = repoData.full_name;
  project.githubRepoUrl = repoData.html_url;

  await project.save();

  return Project.findById(project._id)
    .populate("owner", "fullName email")
    .populate("members", "fullName email")
    .exec();
};