"use client";
import React, { useEffect, useState } from 'react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetch('/api/challenges')
      .then(res => res.json())
      .then(data => setChallenges(data));
  }, []);

  return (
    <div className="min-h-screen bg-jules-bg text-jules-text font-sans p-6 md:p-10">
      <div className="max-w-5xl mx-auto animate-slide-up mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Coding Challenges</h2>
          <div className="flex gap-2">
            <button className="text-xs border border-jules-border bg-jules-surface px-3 py-1.5 rounded-full hover:bg-jules-surfaceHover">Difficulty</button>
            <button className="text-xs border border-jules-border bg-jules-surface px-3 py-1.5 rounded-full hover:bg-jules-surfaceHover">Language</button>
          </div>
        </div>

        <div className="space-y-4">
          {challenges.map((challenge: any) => (
            <div key={challenge._id} className="bg-jules-surface border border-jules-border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-jules-accent/50 transition-colors group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${challenge.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400 border-green-900' : 'bg-red-900/30 text-red-400 border-red-900'}`}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                  <span className="text-xs text-jules-muted">{challenge.category}</span>
                </div>
                <h3 className="text-lg font-medium group-hover:text-jules-accent transition-colors">{challenge.title}</h3>
                <p className="text-sm text-jules-muted mt-1">{challenge.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium">{challenge.solvers}</div>
                  <div className="text-[10px] text-jules-muted">Solvers</div>
                </div>
                <button className="bg-[#2a2a2a] text-white px-5 py-2 rounded-full text-sm hover:bg-white hover:text-black transition-all">Solve</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
