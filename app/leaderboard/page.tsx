"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Leaderboard() {
    const { loading } = useAuth();

    // Mock Data
    const [users] = useState([
        { rank: 1, username: "dev_wizard", points: 15400, badges: ["🏆", "🔥", "⚡"], trend: "up" },
        { rank: 2, username: "python_guru", points: 14250, badges: ["🥈", "🐍"], trend: "stable" },
        { rank: 3, username: "react_master", points: 13800, badges: ["🥉", "⚛️"], trend: "down" },
        { rank: 4, username: "algo_queen", points: 12100, badges: ["💻"], trend: "up" },
        { rank: 5, username: "bug_hunter", points: 11500, badges: ["🐛"], trend: "up" },
        { rank: 6, username: "fullstack_joe", points: 10900, badges: ["🌐"], trend: "stable" },
        { rank: 7, username: "css_ninja", points: 9800, badges: ["🎨"], trend: "down" },
        { rank: 8, username: "node_hero", points: 9500, badges: ["🔋"], trend: "up" },
        { rank: 9, username: "db_admin", points: 9200, badges: ["🗄️"], trend: "stable" },
        { rank: 10, username: "security_expert", points: 8800, badges: ["🔒"], trend: "stable" },
    ]);

    if (loading) return <div className="min-h-screen bg-[#0A0A23] flex items-center justify-center text-jules-primary">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0A0A23] text-jules-primary font-mono antialiased relative overflow-hidden">
            {/* Decorative Assets */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto p-8 relative z-10">

                {/* Header */}
                <header className="flex justify-between items-center mb-12 border-b border-jules-border/30 pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-lg rounded-none group-hover:bg-jules-accent transition-colors">&lt;/&gt;</div>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Global Leaderboard</h1>
                            <p className="text-sm text-jules-primary/60">Top developers competing for glory.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/dashboard" className="px-5 py-2.5 rounded-none font-bold text-sm bg-jules-surface border border-jules-border hover:bg-jules-border/50 transition-all shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-0.5">
                            Dashboard
                        </Link>
                        <Link href="/challenges" className="px-5 py-2.5 rounded-none font-bold text-sm bg-jules-surface border border-jules-border hover:bg-jules-border/50 transition-all shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-0.5">
                            Earn Points
                        </Link>
                    </div>
                </header>

                {/* Top 3 Podium */}
                <div className="flex justify-center items-end gap-6 mb-16">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-4 border-zinc-400 bg-[#0A0A23] flex items-center justify-center text-2xl mb-2 relative">
                            🥈
                            <div className="absolute -bottom-3 bg-zinc-400 text-[#0A0A23] text-xs font-bold px-2 py-0.5 rounded-full">2nd</div>
                        </div>
                        <div className="text-lg font-bold">{users[1].username}</div>
                        <div className="text-sm text-jules-primary/60">{users[1].points} pts</div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center -mt-8">
                        <div className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-[#0A0A23] flex items-center justify-center text-4xl mb-2 relative shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                            👑
                            <div className="absolute -bottom-3 bg-yellow-400 text-[#0A0A23] text-xs font-bold px-2 py-0.5 rounded-full">1st</div>
                        </div>
                        <div className="text-xl font-bold text-yellow-400">{users[0].username}</div>
                        <div className="text-sm text-jules-primary/60 font-bold">{users[0].points} pts</div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-4 border-orange-700 bg-[#0A0A23] flex items-center justify-center text-2xl mb-2 relative">
                            🥉
                            <div className="absolute -bottom-3 bg-orange-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">3rd</div>
                        </div>
                        <div className="text-lg font-bold">{users[2].username}</div>
                        <div className="text-sm text-jules-primary/60">{users[2].points} pts</div>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-jules-surface/30 border border-jules-border rounded-xl overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left">
                        <thead className="bg-jules-surface/80 border-b border-jules-border/50 text-xs uppercase text-jules-muted">
                            <tr>
                                <th className="px-6 py-4 font-bold">Rank</th>
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Badges</th>
                                <th className="px-6 py-4 font-bold text-right">Score</th>
                                <th className="px-6 py-4 font-bold text-center">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-jules-border/30">
                            {users.slice(3).map((u) => (
                                <tr key={u.rank} className="hover:bg-jules-surface/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-jules-primary/50">#{u.rank}</td>
                                    <td className="px-6 py-4 font-bold text-jules-accent">{u.username}</td>
                                    <td className="px-6 py-4 flex gap-1 text-sm">
                                        {u.badges.map((b, i) => <span key={i}>{b}</span>)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono">{u.points}</td>
                                    <td className="px-6 py-4 text-center">
                                        {u.trend === "up" && <span className="text-green-500">▲</span>}
                                        {u.trend === "down" && <span className="text-red-500">▼</span>}
                                        {u.trend === "stable" && <span className="text-jules-primary/20">-</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
