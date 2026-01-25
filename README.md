🚀 TechConnect

An interactive real-time collaborative coding platform for students to build projects, solve challenges, and grow together.

🚧 Status: Under active development (Building in public)

📌 Table of Contents

About the Project

Key Features

Tech Stack

System Architecture

Getting Started

Environment Variables

Running the Project

Project Structure

Roadmap

Contributing

License

📖 About the Project

TechConnect is designed to help students collaborate on real-world coding projects through a shared workspace with real-time editing, AI-assisted development, discussions, and coding challenges.

The platform focuses on:

Practical learning

Team collaboration

Networking among aspiring developers

✨ Key Features

👥 Real-time collaborative workspace

💻 VS Code–like editor (Monaco Editor)

🤖 AI-powered coding assistant

▶️ Run code with live terminal output

🧠 Version history & rollback

💬 Project discussions & community forums

🏆 Coding challenges & leaderboards

🔐 Secure authentication & role-based access

🛠️ Tech Stack
Frontend

Next.js (App Router)

React

Tailwind CSS

Monaco Editor

Backend

Next.js API Routes

Socket.IO (real-time collaboration)

Database

MongoDB Atlas

AI

OpenAI API (Copilot-like assistant)

Deployment

Vercel (frontend)

Custom Socket.IO server (real-time)

🧠 System Architecture
Client (Next.js + Monaco)
        ↓
API Routes (Auth, Projects, AI, Run Code)
        ↓
MongoDB Atlas
        ↓
Socket.IO Server (Live collaboration)

🚀 Getting Started
Prerequisites

Node.js ≥ 18

MongoDB Atlas account

OpenAI API key

🔐 Environment Variables

Create a .env.local file:

MONGODB_URI=your_mongodb_atlas_uri
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

▶️ Running the Project
Install dependencies
npm install

Run development server
npm run dev

Run Socket server (if separate)
npm run socket

📂 Project Structure
techconnect/
│
├── app/                # Next.js app router
│   ├── api/            # API routes
│   ├── workspace/      # Collaborative editor
│
├── components/         # Reusable UI components
├── lib/                # DB, socket, utils
├── models/             # Mongoose models
├── server/             # Socket.IO server
├── public/             # Static assets
└── README.md

🛣️ Roadmap

 Inline AI code suggestions

 Multi-language code execution

 Advanced challenge evaluation

 Analytics & user insights

 Public project discovery

🤝 Contributing

Contributions are welcome!

Fork the repository

Create a new branch

Commit your changes

Open a Pull Request

📄 License

This project is licensed under the MIT License.
