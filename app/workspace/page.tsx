"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Workspace() {
    const [activeTab, setActiveTab] = useState("main.tsx");
    const [rightPanelTab, setRightPanelTab] = useState("chat");

    return (
        <div className="font-mono h-screen bg-[#0A0A23] text-jules-primary flex flex-col overflow-hidden selection:bg-jules-accent selection:text-jules-bg">

            {/* 🟣 TOP BAR */}
            <header className="h-14 border-b border-jules-border/30 bg-[#120129] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-6 h-6 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-xs rounded-none">&lt;/&gt;</div>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-sm leading-tight">TechConnect Landing Page</h1>
                        <div className="text-[10px] text-jules-muted flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Private • 4 Members
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Members Avatars */}
                    <div className="flex -space-x-2 mr-4">
                        <div className="w-8 h-8 rounded-full bg-jules-accent border-2 border-[#120129] flex items-center justify-center text-jules-bg font-bold text-xs z-30">YO</div>
                        <div className="w-8 h-8 rounded-full bg-[#E546CA] border-2 border-[#120129] flex items-center justify-center text-jules-bg font-bold text-xs z-20">AL</div>
                        <div className="w-8 h-8 rounded-full bg-[#FFB800] border-2 border-[#120129] flex items-center justify-center text-jules-bg font-bold text-xs z-10">SA</div>
                        <button className="w-8 h-8 rounded-full bg-jules-surface border-2 border-[#120129] flex items-center justify-center text-jules-primary text-xs hover:bg-jules-primary hover:text-jules-bg transition-colors z-0">+</button>
                    </div>

                    <button className="bg-jules-primary/10 hover:bg-jules-primary/20 text-jules-primary text-xs font-bold px-3 py-1.5 rounded border border-jules-primary/20 transition-colors">Invite</button>
                    <button className="bg-jules-accent text-jules-bg text-xs font-bold px-3 py-1.5 rounded hover:bg-white transition-colors">Share</button>
                </div>
            </header>

            {/* MAIN WORKSPACE AREA */}
            <div className="flex-1 flex overflow-hidden">

                {/* 📂 LEFT SIDEBAR - FILE EXPLORER */}
                <aside className="w-64 border-r border-jules-border/30 bg-[#0E0E1E] flex flex-col shrink-0">
                    <div className="p-3 border-b border-jules-border/30 text-xs font-bold text-jules-muted uppercase tracking-wider">
                        Files
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 text-sm text-jules-primary/80 space-y-1">
                        <div className="flex items-center gap-2 px-2 py-1 mx-[-8px] bg-jules-primary/5 cursor-pointer">
                            <span className="opacity-50">📂</span> src
                        </div>
                        <div className="pl-6 space-y-1">
                            <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-white/5 rounded">
                                <span className="opacity-50">📂</span> components
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-white/5 rounded">
                                <span className="opacity-50">📂</span> pages
                            </div>
                            <div className="pl-6 space-y-1">
                                <div className="flex items-center gap-2 px-2 py-1 cursor-pointer bg-jules-accent/10 text-jules-accent rounded font-bold">
                                    <span className="text-blue-400">TS</span> main.tsx
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-white/5 rounded">
                                    <span className="text-yellow-400">JS</span> layout.tsx
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-white/5 rounded">
                                <span className="opacity-50">📂</span> styles
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-white/5 rounded">
                            <span className="text-gray-400">MD</span> README.md
                        </div>
                    </div>

                    {/* Members Panel (Bottom of Sidebar) */}
                    <div className="p-3 border-t border-jules-border/30">
                        <div className="text-xs font-bold text-jules-muted uppercase tracking-wider mb-3">Members</div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> You (Owner)
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Alex
                            </div>
                            <div className="flex items-center gap-2 text-xs opacity-50">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Sarah (Away)
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 🧠 CENTER - CODE EDITOR */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A23] relative">
                    {/* Tabs */}
                    <div className="flex items-center bg-[#0E0E1E] border-b border-jules-border/30">
                        <div className="px-4 py-2 text-xs font-bold bg-[#0A0A23] border-r border-[#0A0A23] text-jules-accent border-t-2 border-t-jules-accent flex items-center gap-2">
                            <span className="text-blue-400">TS</span> main.tsx
                            <span className="hover:bg-white/10 rounded-full w-4 h-4 flex items-center justify-center ml-2 cursor-pointer">×</span>
                        </div>
                        <div className="px-4 py-2 text-xs font-bold text-jules-muted hover:bg-[#0A0A23]/50 border-r border-jules-border/10 cursor-pointer flex items-center gap-2">
                            <span className="text-yellow-400">JS</span> layout.tsx
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto p-4 text-sm font-mono leading-relaxed relative">
                        {/* Real-time Cursor Indicator */}
                        <div className="absolute top-32 left-40 z-10 pointer-events-none">
                            <div className="w-0.5 h-5 bg-[#E546CA] absolute top-[-2px]"></div>
                            <div className="bg-[#E546CA] text-[#0A0A23] text-[10px] font-bold px-1.5 py-0.5 rounded-r rounded-b absolute top-[-18px] left-0 whitespace-nowrap">
                                Alex is editing...
                            </div>
                        </div>

                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">1</div>
                            <div className="text-purple-400">import</div> <div className="text-jules-primary ml-2">React</div> <div className="text-purple-400 ml-2">from</div> <div className="text-green-400 ml-2">"react"</div>;
                        </div>
                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">2</div>
                        </div>
                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">3</div>
                            <div className="text-purple-400">export default</div> <div className="text-blue-400 ml-2">function</div> <div className="text-yellow-400 ml-2">Home</div>() {"{"}
                        </div>
                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">4</div>
                            <div className="pl-4 text-purple-400">return</div> (
                        </div>
                        <div className="flex bg-[#E546CA]/10 -mx-4 px-4 border-l-2 border-[#E546CA]">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">5</div>
                            <div className="pl-8 text-blue-400">&lt;div</div> <div className="text-green-400 ml-2">className</div>=<div className="text-orange-400">"bg-jules-bg min-h-screen"</div>&gt;
                        </div>
                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">6</div>
                            <div className="pl-12 text-blue-400">&lt;h1</div> <div className="text-green-400 ml-2">className</div>=<div className="text-orange-400">"text-4xl font-bold"</div>&gt;
                        </div>
                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">7</div>
                            <div className="pl-16">Welcome to TechConnect</div>
                        </div>
                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">8</div>
                            <div className="pl-12 text-blue-400">&lt;/h1&gt;</div>
                        </div>
                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">9</div>
                            <div className="pl-8 text-blue-400">&lt;/div&gt;</div>
                        </div>
                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">10</div>
                            <div className="pl-4">);</div>
                        </div>
                        <div className="flex">
                            <div className="w-10 text-jules-muted/30 text-right pr-4 select-none">11</div>
                            <div>{"}"}</div>
                        </div>
                    </div>

                    {/* Editor Status Bar */}
                    <div className="bg-[#1D0245] border-t border-jules-border/30 p-1 flex justify-between items-center text-[10px] text-jules-muted px-3">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Connected</span>
                            <span>3 users online</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span>Ln 5, Col 42</span>
                            <span>Spaces: 2</span>
                            <span>UTF-8</span>
                            <span>Auto-save enabled</span>
                        </div>
                    </div>
                </main>

                {/* 💬 RIGHT SIDEBAR - CHAT / TASKS */}
                <aside className="w-72 border-l border-jules-border/30 bg-[#0E0E1E] flex flex-col shrink-0">
                    {/* Tabs */}
                    <div className="flex border-b border-jules-border/30">
                        <button
                            onClick={() => setRightPanelTab("chat")}
                            className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${rightPanelTab === "chat" ? "text-jules-primary border-b-2 border-jules-accent bg-[#0A0A23]" : "text-jules-muted hover:bg-[#0A0A23]"}`}
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => setRightPanelTab("tasks")}
                            className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${rightPanelTab === "tasks" ? "text-jules-primary border-b-2 border-jules-accent bg-[#0A0A23]" : "text-jules-muted hover:bg-[#0A0A23]"}`}
                        >
                            Tasks
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {rightPanelTab === "chat" ? (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#E546CA] text-[10px] flex items-center justify-center font-bold text-[#0A0A23] shrink-0 mt-1">AL</div>
                                        <div>
                                            <div className="text-xs font-bold text-[#E546CA] mb-0.5">Alex</div>
                                            <div className="text-sm bg-[#0A0A23] p-2 rounded-tr-lg rounded-br-lg rounded-bl-lg border border-jules-border/30 text-jules-primary/90">
                                                I’ll work on the navbar today.
                                            </div>
                                            <div className="text-[10px] text-jules-muted mt-1">10:42 AM</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-row-reverse">
                                        <div className="w-6 h-6 rounded-full bg-jules-accent text-[10px] flex items-center justify-center font-bold text-[#0A0A23] shrink-0 mt-1">YO</div>
                                        <div className="text-right">
                                            <div className="text-sm bg-jules-accent/10 p-2 rounded-tl-lg rounded-bl-lg rounded-br-lg border border-jules-accent/30 text-jules-primary/90">
                                                Sounds good 👍 I’ll handle the hero section.
                                            </div>
                                            <div className="text-[10px] text-jules-muted mt-1">10:45 AM</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-center text-xs text-jules-muted justify-center my-4">
                                        <span className="h-px w-8 bg-jules-border/30"></span>
                                        <div>Sarah joined the project</div>
                                        <span className="h-px w-8 bg-jules-border/30"></span>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-jules-border/30 bg-[#120129]">
                                    <input
                                        type="text"
                                        placeholder="Write a message..."
                                        className="w-full bg-[#0A0A23] border border-jules-border/30 rounded px-3 py-2 text-sm text-jules-primary focus:outline-none focus:border-jules-accent"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col p-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 group cursor-pointer">
                                        <div className="w-4 h-4 mt-0.5 border border-green-500 bg-green-500/20 rounded flex items-center justify-center text-green-500 text-[10px]">✓</div>
                                        <div className="text-sm text-jules-muted line-through">Set up project structure</div>
                                    </div>
                                    <div className="flex items-start gap-3 group cursor-pointer">
                                        <div className="w-4 h-4 mt-0.5 border border-jules-muted/50 rounded flex items-center justify-center group-hover:border-jules-accent"></div>
                                        <div className="text-sm text-jules-primary">Design landing page UI</div>
                                    </div>
                                    <div className="flex items-start gap-3 group cursor-pointer">
                                        <div className="w-4 h-4 mt-0.5 border border-jules-muted/50 rounded flex items-center justify-center group-hover:border-jules-accent"></div>
                                        <div className="text-sm text-jules-primary">Add authentication flow</div>
                                    </div>
                                </div>
                                <button className="mt-4 flex items-center gap-2 text-xs font-bold text-jules-muted hover:text-jules-accent transition-colors">
                                    <span className="text-lg">+</span> Add Task
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

            </div>

            {/* ⚠️ FIRST-TIME MESSAGE OVERLAY (Optional/Conditional) - Hidden for now to show full stats */}
            {/* 
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#120129] border border-jules-border p-8 rounded-xl shadow-2xl max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome to your project workspace 👋</h2>
            <p className="text-jules-primary/70 mb-6">Start by adding files, inviting teammates, or creating tasks.</p>
            <div className="space-y-3">
                <button className="w-full bg-jules-accent text-jules-bg font-bold py-3 rounded hover:bg-white transition-colors">Add First File</button>
                <button className="w-full bg-transparent border border-jules-primary/30 text-jules-primary font-bold py-3 rounded hover:bg-jules-primary/10 transition-colors">Invite Members</button>
            </div>
        </div>
      </div>
      */}

            {/* FOOTER */}
            <footer className="h-6 bg-[#0E0E1E] border-t border-jules-border/30 flex items-center justify-between px-4 text-[10px] text-jules-muted shrink-0">
                <span>Changes are saved automatically.</span>
                <span>TechConnect Workspace v1.0</span>
            </footer>
        </div>
    );
}
