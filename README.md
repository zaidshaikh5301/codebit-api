# CodeBit

> A modern developer collaboration platform for discovering projects, finding developers, collaborating with teams, managing tasks, communicating in real time, and connecting GitHub workflows.

## 🚀 Overview

CodeBit is a full-stack SaaS platform designed to help developers find projects, build teams, collaborate with other developers, and manage their development workflow from a single platform.

Developers can create professional profiles, discover projects, apply to projects, accept or reject applicants, manage project members, assign tasks, communicate through discussions and real-time chat, and integrate GitHub repositories.

The platform is designed with scalability, security, real-time collaboration, and a professional SaaS experience in mind.

---

## ✨ Features

### 🔐 Authentication & Security

- User registration and login
- JWT-based authentication
- Access and refresh token support
- Protected API routes
- Password security
- Authentication middleware
- Role-based access control
- Request validation
- Centralized error handling
- Request ID tracking
- API rate limiting
- CORS protection
- Helmet security headers

### 👨‍💻 Developer Profiles

- Create developer profiles
- Update profile information
- Upload profile images
- Developer discovery
- Search developers
- Developer skills
- Developer project information

### 📁 Project Management

- Create projects
- Update projects
- Delete projects
- View project details
- Discover available projects
- Project ownership
- Project members
- Project status management
- Project technology information

### 📨 Project Applications

Developers can apply to projects they are interested in.

Project owners can:

- View applications
- Accept applicants
- Reject applicants
- Manage accepted members

Application status is tracked throughout the workflow.

### 👥 Team & Member Management

- View project members
- Manage project members
- Project owner controls
- Member roles
- Collaboration between team members

### ✅ Task Management

Project teams can manage development tasks.

Supported task priorities:

- Epic
- High
- Medium
- Low

Supported task statuses:

- Pending
- In Progress
- Completed

Task functionality includes:

- Create tasks
- View tasks
- Filter tasks by priority
- Update task details
- Change task status
- Delete tasks

### 💬 Discussions & Real-Time Chat

CodeBit supports real-time team communication using Socket.IO.

Features include:

- Project discussions
- Real-time messaging
- Project rooms
- Message history
- Typing indicators
- Real-time message broadcasting
- Team collaboration

### 🔔 Notifications

Users can receive notifications for important project activities such as:

- Application updates
- Application acceptance/rejection
- Project activity
- Team activity
- Collaboration events

### 🐙 GitHub Integration

CodeBit is designed to integrate GitHub into the project workflow.

Planned/available capabilities include:

- Connect GitHub accounts
- Link repositories to projects
- GitHub repository information
- Development workflow integration
- Repository-based project collaboration

### 📊 Productivity

The platform is designed to provide developers with tools for managing their development workflow and monitoring project progress.

---

# 🏗️ Architecture

CodeBit follows a modular full-stack architecture.

```text
┌──────────────────────────────┐
│          Frontend            │
│                              │
│ React + TypeScript           │
│ React Router                 │
│ TanStack Query               │
│ Axios                        │
│ Responsive SaaS UI           │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│           Backend            │
│                              │
│ Node.js                      │
│ Express.js                   │
│ TypeScript                   │
│ JWT Authentication           │
│ Socket.IO                    │
│ Swagger / OpenAPI            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│           Database           │
│                              │
│ MongoDB                      │
└──────────────────────────────┘

               │
               ▼
┌──────────────────────────────┐
│       External Services      │
│                              │
│ GitHub API                   │
│ Cloudinary                   │
└──────────────────────────────┘
