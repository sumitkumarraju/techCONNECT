# techCONNECT

Real-time collaborative coding platform for students and developers to build projects together with AI-assisted workflows.

## What is new

- Room-code based project joining (`/join` flow + dashboard join modal)
- Resilient real-time presence with join/leave notifications
- Notification center in workspace for room and AI events
- AI assistant with:
  - model selection (NVIDIA-hosted models)
  - current-file or project-wide context scope
  - manual/auto apply modes
  - per-file apply, apply-all, preview, copy, history, rollback
  - quality gate checks before apply
- HTML live preview support in editor (button-triggered)
- Resizable workspace panes (explorer, editor, preview, right sidebar)
- MongoDB Atlas-ready configuration

## Core features

- Real-time collaboration (code, messages, presence) via Socket.IO
- Monaco editor workspace with autosave and file management
- Role-based project permissions (owner/editor/viewer)
- Version snapshots and rollback for code files
- Multi-language code execution endpoint
- Community, discussions, challenges, profile and leaderboard APIs

## Tech stack

- **Frontend**: Next.js App Router, React, Tailwind CSS, Monaco Editor
- **Backend**: Next.js API routes + separate Socket.IO server
- **Database**: MongoDB / MongoDB Atlas (Mongoose)
- **Testing**: Jest (unit), Playwright (E2E)

## Project structure

```text
techCONNECT/
  app/                   # Next.js routes, API routes, pages
  backend/               # Socket.IO server
  components/            # UI and editor components
  context/               # Auth context
  lib/                   # DB, API client, auth helpers, socket client
  models/                # Mongoose models
  __tests__/             # Unit tests
  e2e/                   # Playwright tests
```

## Environment setup

Create environment files:

- `techCONNECT/.env`
- `techCONNECT/backend/.env`

Required values:

```env
MONGO_URI=mongodb+srv://<atlas-username>:<atlas-password>@<atlas-cluster>.mongodb.net/techconnect?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<strong-random-secret>
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001

NVIDIA_API_KEY=<your-nvidia-key>
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=minimaxai/minimax-m2.7
```

### MongoDB Atlas notes

- Add your machine IP in Atlas Network Access
- Create DB user with access to `techconnect`
- URL-encode special characters in password (example `@` => `%40`)

## Run locally

Install dependencies:

```bash
npm install
```

Start Next.js app:

```bash
npm run dev
```

Start Socket server:

```bash
cd backend
node server.js
```

Open:

- App: `http://localhost:3000` (or custom port you run)
- Socket health: `http://localhost:5001/health`

## Test and quality checks

```bash
npm run lint
npx tsc --noEmit
npm test -- --runInBand
```

Run E2E:

```bash
npx playwright test
```

## Deployment notes

- Frontend: Vercel
- Realtime socket server: separate Node deployment
- Ensure production `NEXT_PUBLIC_SOCKET_URL` points to deployed socket host
- Configure env vars in Vercel project settings

## Additional docs

- Full project build report: `PROJECT-REPORT.md`
