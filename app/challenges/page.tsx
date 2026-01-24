"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Challenges() {
  const { user, loading } = useAuth();

  // Mock Data for UI Development
  const [challenges] = useState([
    { id: 1, title: "Two Sum", difficulty: "Easy", tags: ["Arrays", "Hash Map"], participants: 1205, status: "Solved" },
    { id: 2, title: "Reverse Linked List", difficulty: "Medium", tags: ["Linked List"], participants: 850, status: "Unsolved" },
    { id: 3, title: "LRU Cache", difficulty: "Hard", tags: ["Design", "Hash Map"], participants: 340, status: "Unsolved" },
    { id: 4, title: "Valid Palindrome", difficulty: "Easy", tags: ["String", "Two Pointers"], participants: 2100, status: "Unsolved" },
    { id: 5, title: "Course Schedule", difficulty: "Medium", tags: ["Graph", "DFS"], participants: 600, status: "Unsolved" },
    { id: 6, title: "Merge k Sorted Lists", difficulty: "Hard", tags: ["Heap", "Linked List"], participants: 250, status: "Unsolved" },
  ]);

  const [filter, setFilter] = useState("All");

  if (loading) return <div className="min-h-screen bg-[#0A0A23] flex items-center justify-center text-jules-primary">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A23] text-jules-primary font-mono antialiased relative overflow-hidden">
      {/* Decorative Assets */}
      <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto p-8 relative z-10">

        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-jules-border/30 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-lg rounded-none group-hover:bg-jules-accent transition-colors">&lt;/&gt;</div>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Coding Challenges</h1>
              <p className="text-sm text-jules-primary/60">Sharpen your skills with daily problems.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-5 py-2.5 rounded-none font-bold text-sm bg-jules-surface border border-jules-border hover:bg-jules-border/50 transition-all shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-0.5">
              Dashboard
            </Link>
            <button className="bg-jules-accent text-jules-bg px-6 py-2.5 font-bold shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-1 transition-all border-2 border-transparent hover:border-jules-primary/20">
              My Submission History
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {["All", "Easy", "Medium", "Hard"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${filter === f ? "bg-jules-primary text-jules-bg border-jules-primary" : "text-jules-muted border-jules-border/30 hover:border-jules-accent"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.filter(c => filter === "All" || c.difficulty === filter).map(challenge => (
            <div key={challenge.id} className="bg-jules-surface/50 border border-jules-border hover:border-jules-accent p-6 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-50 text-[100px] leading-none font-black text-white/5 -rotate-12 select-none group-hover:opacity-100 group-hover:text-jules-accent/5 transition-all">
                {challenge.id}
              </div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${challenge.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                  {challenge.difficulty}
                </span>
                {challenge.status === "Solved" && (
                  <span className="text-green-500 text-lg">✓</span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-jules-accent transition-colors relative z-10">{challenge.title}</h3>

              <div className="flex gap-2 mb-6 flex-wrap relative z-10">
                {challenge.tags.map(t => (
                  <span key={t} className="text-xs text-jules-primary/50 bg-[#0A0A23] px-1.5 py-0.5 border border-jules-border/30">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-jules-border/30 flex justify-between items-center relative z-10">
                <div className="text-xs text-jules-muted">
                  <strong className="text-jules-primary">{challenge.participants}</strong> Solvers
                </div>
                <button className="text-xs font-bold bg-jules-surface hover:bg-jules-accent hover:text-jules-bg text-jules-primary border border-jules-border px-3 py-1.5 transition-colors">
                  Solve Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
