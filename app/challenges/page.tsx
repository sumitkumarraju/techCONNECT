"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

export default function ChallengesPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [chalData, leadData] = await Promise.all([
          API.get("/challenges"),
          API.get("/leaderboard")
        ]);
        setChallenges(chalData.data);
        setLeaderboard(leadData.data);
      } catch (err) {
        console.error("Failed to load challenges", err);
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

  if (!user) return <div className="h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      <header className="h-16 border-b border-[#222] flex items-center justify-between px-8 backdrop-blur-md bg-black/50 sticky top-0 z-50">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          TechConnect <span className="text-white font-normal text-sm opacity-60">Challenges</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:text-white text-gray-400 transition-colors">Dashboard</Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs ring-2 ring-white/10">
            {user.username[0].toUpperCase()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* 👈 LEFT: Challenges List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Coding Challenges</h1>
            <div className="flex gap-2">
              {['All', 'Easy', 'Medium', 'Hard'].map(filter => (
                <button key={filter} className="px-4 py-1.5 rounded-full text-xs font-bold border border-[#333] hover:border-white transition-colors">
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
                <Link href={`/challenges/${challenge._id}`} key={challenge._id} className="group relative bg-[#111] border border-[#222] hover:border-purple-500/50 p-6 rounded-xl transition-all hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)]">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors">{challenge.title}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${difficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{challenge.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-2">
                      {challenge.tags?.map((t: string) => (
                        <span key={t} className="bg-[#222] px-2 py-1 rounded text-gray-300">#{t}</span>
                      ))}
                    </div>
                    <div className="font-mono text-purple-400 font-bold">+{challenge.points} XP</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 👉 RIGHT: Leaderboard */}
        <aside className="lg:col-span-1 border-l border-[#222] pl-8">
          <div className="sticky top-24">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span>🏆</span> Top Performers
            </h2>

            <div className="space-y-4">
              {leaderboard.map((entry, idx) => (
                <div key={entry.userId} className="flex items-center gap-4 group">
                  <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg ${idx === 0 ? "bg-yellow-400 text-black" : idx === 1 ? "bg-gray-300 text-black" : idx === 2 ? "bg-orange-400 text-black" : "bg-[#222] text-gray-400"}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold group-hover:text-purple-400 transition-colors">{entry.username}</div>
                    <div className="text-xs text-gray-500">{entry.solvedCount} Solved</div>
                  </div>
                  <div className="text-sm font-mono font-bold text-gray-300">
                    {entry.totalScore}pts
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && <div className="text-sm text-gray-600">No scores yet. Be the first!</div>}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/20">
              <h3 className="text-sm font-bold text-purple-300 mb-1">Weekly Challenge</h3>
              <p className="text-xs text-gray-400 mb-3">Solve "Reverse Linked List" to earn double XP this week!</p>
              <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded transition-colors">
                View Challenge
              </button>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
