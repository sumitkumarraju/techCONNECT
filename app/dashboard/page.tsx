"use client";
import React from "react";
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="font-mono min-h-screen bg-jules-bg text-jules-primary flex">

      {/* Sidebar */}
      <aside className="w-64 border-r border-jules-border p-6 hidden md:block">
        <div className="mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-xs">&lt;/&gt;</div>
            <span className="font-bold tracking-tight text-lg">TechConnect</span>
          </Link>
        </div>

        <nav className="space-y-4">
          <a href="#" className="block px-4 py-2 bg-jules-surface rounded-lg font-bold text-jules-accent">Overview</a>
          <a href="#" className="block px-4 py-2 hover:bg-jules-surface/50 rounded-lg text-jules-muted hover:text-jules-primary transition-colors">Projects</a>
          <a href="#" className="block px-4 py-2 hover:bg-jules-surface/50 rounded-lg text-jules-muted hover:text-jules-primary transition-colors">Challenges</a>
          <a href="#" className="block px-4 py-2 hover:bg-jules-surface/50 rounded-lg text-jules-muted hover:text-jules-primary transition-colors">Community</a>
          <a href="#" className="block px-4 py-2 hover:bg-jules-surface/50 rounded-lg text-jules-muted hover:text-jules-primary transition-colors">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, Developer</h1>
            <p className="text-jules-muted">Here's what's happening today.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-jules-accent flex items-center justify-center text-jules-bg font-bold text-lg">
            D
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Stat Card 1 */}
          <div className="bg-jules-surface border border-jules-border p-6 rounded-2xl">
            <p className="text-jules-muted text-sm font-bold mb-2 uppercase">Active Projects</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-jules-primary">3</span>
              <span className="text-jules-accent text-sm mb-1">+1 this week</span>
            </div>
          </div>
          {/* Stat Card 2 */}
          <div className="bg-jules-surface border border-jules-border p-6 rounded-2xl">
            <p className="text-jules-muted text-sm font-bold mb-2 uppercase">Completed Challenges</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-jules-primary">12</span>
              <span className="text-jules-pink text-sm mb-1">Top 10%</span>
            </div>
          </div>
          {/* Stat Card 3 */}
          <div className="bg-jules-surface border border-jules-border p-6 rounded-2xl">
            <p className="text-jules-muted text-sm font-bold mb-2 uppercase">Total Contributions</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-jules-primary">148</span>
              <span className="text-green-400 text-sm mb-1">Level 5</span>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-jules-accent"></span>
            Recent Activity
          </h2>
          <div className="bg-jules-surface border border-jules-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-jules-border/50 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl">🚀</div>
              <div>
                <p className="font-bold">Deployed Portfolio V2</p>
                <p className="text-xs text-jules-muted">2 hours ago • Production</p>
              </div>
            </div>
            <div className="p-4 border-b border-jules-border/50 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">💬</div>
              <div>
                <p className="font-bold">Commented on "Auth System"</p>
                <p className="text-xs text-jules-muted">5 hours ago • Discussion</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center text-xl">🌿</div>
              <div>
                <p className="font-bold">Merged pull request #42</p>
                <p className="text-xs text-jules-muted">Yesterday • main branch</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
