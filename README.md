# ⚡ CodeBit API

REST API and real-time backend for **CodeBit**, a developer collaboration platform where developers find projects, build teams, manage tasks and chat in real time.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socketdotio&logoColor=white)

## ✨ Features

### 🔐 Auth and security
- JWT authentication with access and refresh tokens
- Role-based access control
- Request validation and centralized error handling
- Request ID tracking
- Rate limiting, CORS and Helmet security headers

### 👨‍💻 Developers
- Profiles with image upload (Cloudinary)
- Developer discovery and search, with skills

### 📁 Projects
- Create, update, delete and discover projects
- Ownership, members and status management

### 📨 Applications and team
- Apply to projects
- Owners accept or reject applicants
- Member management

### ✅ Tasks
- Priorities: Epic, High, Medium, Low
- Statuses: Pending, In Progress, Completed
- Filter by priority, update and delete

### 💬 Real time
- Project discussions and rooms (Socket.IO)
- Message history and typing indicators
- Live notifications for application and project activity

### 🐙 GitHub integration
- Connect a GitHub account and link repositories to projects

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB |
| Real time | Socket.IO |
| Auth | JWT |
| Uploads | Cloudinary |
| Integrations | GitHub API |
| API docs | Swagger / OpenAPI |
| Testing | Vitest |

## 🏗️ Architecture

```
CodeBit Frontend (React + TypeScript)
        │  REST + WebSocket
        ▼
Express API ── Controllers → Services → Models ──► MongoDB
        │
        ├── Socket.IO (rooms, chat, notifications)
        ├── Cloudinary (image uploads)
        └── GitHub API
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for uploads)

### Installation

```bash
git clone https://github.com/zaidshaikh5301/codebit-api.git
cd codebit-api
npm install
cp .env.example .env
```

Fill in `.env` using `.env.example` as the reference (database URI, JWT secrets, Cloudinary and GitHub credentials, client URL).

### Run

```bash
npm run dev      # development
npm run build    # compile TypeScript
npm start        # run compiled build
npm test         # run Vitest tests
```

> Check the `scripts` section of `package.json` and adjust the commands above if your script names differ.

## 📚 API Documentation

With the server running, open the Swagger docs at `http://localhost:<PORT>/api-docs`.

> Replace `/api-docs` with the route you used for Swagger.

## 📁 Project Structure

```
codebit-api/
├── src/
├── .env.example
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## 🔒 Security

- Never commit `.env` or any secrets
- Use strong, unique JWT secrets in production
- Restrict CORS to your frontend domain in production

## 🔮 Roadmap

- [ ] Production deployment
- [ ] Expanded test coverage
- [ ] CI/CD pipeline
- [ ] Project analytics and progress tracking

## 👨‍💻 Author

**Zaid Shaikh**

[GitHub](https://github.com/zaidshaikh5301) · [LinkedIn](https://www.linkedin.com/in/zaid-shaikh-823961345/)
