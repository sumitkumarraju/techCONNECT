"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

const SAMPLE_CHALLENGES = [
  {
    _id: "sample_1",
    title: "AI Chatbot Interface",
    difficulty: "medium",
    description: "Build a responsive chat interface with streaming responses and typing indicators.",
    points: 500,
    tags: ["React", "UI/UX", "Streaming"]
  },
  {
    _id: "sample_2",
    title: "DeFi Crypto Wallet dashboard",
    difficulty: "hard",
    description: "Create a Web3 wallet dashboard showing real-time token balances and gas fees.",
    points: 1000,
    tags: ["Web3", "Blockchain", "Dashboard"]
  },
  {
    _id: "sample_3",
    title: "Real-time Collaboration Board",
    difficulty: "hard",
    description: "Implement a whiteboard where multiple users can draw and move shapes in real-time.",
    points: 800,
    tags: ["Socket.io", "Canvas", "Real-time"]
  },
  {
    _id: "sample_4",
    title: "Responsive Landing Page",
    difficulty: "easy",
    description: "Design a high-converting landing page with smooth animations and mobile layout.",
    points: 300,
    tags: ["CSS Grid", "Animations", "Responsive"]
  }
];

export default function ChallengesPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [chalData, leadData] = await Promise.all([
          API.get("/challenges").catch(() => ({ data: [] })),
          API.get("/leaderboard").catch(() => ({ data: [] }))
        ]);

        // Use samples if API returns empty (for demo/dev purposes)
        setChallenges(chalData.data.length > 0 ? chalData.data : SAMPLE_CHALLENGES);
        setLeaderboard(leadData.data);
      } catch (err) {
        console.error("Failed to load challenges", err);
        setChallenges(SAMPLE_CHALLENGES); // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const difficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "text-green-400 border-green-500/30 bg-green-500/10";
      case "medium": return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      case "hard": return "text-red-400 border-red-500/30 bg-red-500/10";
      default: return "text-gray-400";
    }
  };

  if (!user) return <div className="h-screen bg-jules-bg text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-jules-bg text-jules-primary font-sans selection:bg-purple-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none bg-hero-glow z-0"></div>

      {/* Header */}
      <header className="h-16 border-b border-jules-border/50 flex items-center justify-between px-8 backdrop-blur-md bg-jules-bg/80 sticky top-0 z-50">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          TechConnect <span className="text-jules-accent font-normal text-sm opacity-80">Challenges</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:text-white text-gray-400 transition-colors">Dashboard</Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs ring-2 ring-white/10 text-white">
            {user.username[0].toUpperCase()}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* 👈 LEFT: Challenges List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white tracking-tight">Coding Challenges</h1>
            <div className="flex gap-2">
              {['All', 'Easy', 'Medium', 'Hard'].map(filter => (
                <button key={filter} className="px-4 py-1.5 rounded-full text-xs font-bold border border-jules-border bg-jules-surface hover:border-jules-accent hover:text-white transition-all text-gray-400">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-500">Loading challenges...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map(challenge => (
                <Link href={`/challenges/${challenge._id}`} key={challenge._id} className="group relative bg-jules-surface border border-jules-border hover:border-jules-accent/50 p-6 rounded-xl transition-all hover:shadow-[0_0_30px_-10px_rgba(0,215,255,0.15)] hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold group-hover:text-jules-accent transition-colors">{challenge.title}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${difficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{challenge.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-2">
                      {challenge.tags?.map((t: string) => (
                        <span key={t} className="bg-[#1a0530] px-2 py-1 rounded text-gray-300 border border-jules-border/30">#{t}</span>
                      ))}
                    </div>
                    <div className="font-mono text-jules-accent font-bold">+{challenge.points} XP</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 👉 RIGHT: Leaderboard */}
        <aside className="lg:col-span-1 border-l border-jules-border pl-8">
          <div className="sticky top-24">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <span>🏆</span> Top Performers
            </h2>

            <div className="space-y-4">
              {leaderboard.map((entry, idx) => (
                <div key={entry.userId} className="flex items-center gap-4 group p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg ${idx === 0 ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/20" : idx === 1 ? "bg-gray-300 text-black" : idx === 2 ? "bg-orange-400 text-black" : "bg-jules-surface border border-jules-border text-gray-400"}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold group-hover:text-jules-accent transition-colors">{entry.username}</div>
                    <div className="text-xs text-gray-500">{entry.solvedCount} Solved</div>
                  </div>
                  <div className="text-sm font-mono font-bold text-jules-accent">
                    {entry.totalScore}pts
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && <div className="text-sm text-gray-600 bg-jules-surface p-4 rounded-xl border border-jules-border text-center">No scores yet. <br />Be the first to conquer!</div>}
            </div>

            <div className="mt-8 p-1 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <div className="p-4 bg-jules-bg rounded-[10px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl font-bold -mr-10 -mt-10"></div>
                <h3 className="text-sm font-bold text-white mb-1 relative z-10">Weekly Challenge</h3>
                <p className="text-xs text-gray-300 mb-3 relative z-10">Solve &quot;Reverse Linked List&quot; to earn double XP this week!</p>
                <button className="w-full py-2 bg-jules-accent text-black hover:bg-cyan-300 text-xs font-bold rounded transition-colors relative z-10">
                  View Challenge
                </button>
              </div>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
