"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";
import socket from "@/lib/socket";
import CodeEditor from "@/components/CodeEditor";

export default function ProjectPage() {
    const { id: projectId } = useParams() as { id: string };
    const { user } = useAuth();

    // Data State
    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

    // UI State
    const [rightPanelTab, setRightPanelTab] = useState<"chat" | "tasks">("chat");
    const [chatText, setChatText] = useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Data Fetch & Socket Setup
    useEffect(() => {
        if (!user || !projectId) return;

        // Fetch Data
        const fetchData = async () => {
            try {
                const [projRes, tasksRes, msgsRes] = await Promise.all([
                    API.get(`/projects/${projectId}`),
                    API.get(`/projects/${projectId}/tasks`),
                    API.get(`/projects/${projectId}/messages`)
                ]);
                setProject(projRes.data);
                setTasks(tasksRes.data);
                setMessages(msgsRes.data);
            } catch (err) {
                console.error("Failed to load project data", err);
            }
        };
        fetchData();

        // Socket Connect
        socket.connect();
        socket.emit("join-project", {
            projectId,
            user: { username: user.username, name: user.name, _id: user._id }
        });

        // Event Listeners
        const handleReceiveMessage = (message: any) => {
            setMessages(prev => [...prev, message]);
        };

        const handleOnlineUsers = (users: any[]) => {
            // Deduplicate based on _id if needed, but socketId is unique source of truth for connection
            setOnlineUsers(users);
        };

        const handleTaskSync = (updatedTask: any) => {
            setTasks(prev => {
                const exists = prev.find(t => t._id === updatedTask._id);
                if (exists) {
                    return prev.map(t => t._id === updatedTask._id ? updatedTask : t);
                }
                return [updatedTask, ...prev];
            });
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("online-users", handleOnlineUsers);
        socket.on("task-sync", handleTaskSync);

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("online-users", handleOnlineUsers);
            socket.off("task-sync", handleTaskSync);
            socket.disconnect();
        };
    }, [projectId, user]);

    // Auto-scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, rightPanelTab]);

    // Actions
    const sendMessage = async () => {
        if (!chatText.trim()) return;

        // Optimistic UI update not strictly needed as socket is fast, but good practice
        // We'll wait for socket/API for now to keep it simple and consistent

        const content = chatText;
        setChatText("");

        try {
            await API.post(`/projects/${projectId}/messages`, { content });
            // Emit to others (the controller saves it too, but we need to broadcast)
            // Actually, backend controller saves to DB.
            // We should ideally have the backend emit 'receive-message' after saving.
            // But current backend/server.ts listens to 'send-message' and broadcasts.
            // So we do both: API to save, Socket to broadcast.
            // Ideally: API saves -> emits event via server-side socket.
            // But for now, we follow existing pattern: Client emits 'send-message'.

            socket.emit("send-message", {
                projectId,
                message: {
                    content,
                    senderId: { _id: user._id, username: user.username, name: user.name },
                    createdAt: new Date().toISOString()
                }
            });

            // Add to own list manually since broadcast usually excludes sender (socket.to)
            setMessages(prev => [...prev, {
                content,
                senderId: { _id: user._id, username: user.username, name: user.name },
                createdAt: new Date().toISOString()
            }]);

        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const createTask = async () => {
        if (!taskTitle.trim()) return;
        try {
            const { data } = await API.post(`/projects/${projectId}/tasks`, { title: taskTitle });
            setTasks(prev => [data, ...prev]);
            setTaskTitle("");
            socket.emit("task-updated", { projectId, task: data });
        } catch (error) {
            console.error(error);
        }
    };

    const toggleTask = async (task: any) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        const updatedTask = { ...task, status: newStatus };

        // Optimistic
        setTasks(prev => prev.map(t => t._id === task._id ? updatedTask : t));

        try {
            const { data } = await API.put(`/tasks/${task._id}`, { status: newStatus });
            socket.emit("task-updated", { projectId, task: data });
        } catch (error) {
            console.error("Failed to toggle task", error);
            // Revert on fail?
        }
    };

    if (!user) return <div className="h-screen bg-[#0A0A23] flex items-center justify-center text-jules-primary">Loading...</div>;

    return (
        <div className="font-mono h-screen bg-[#0A0A23] text-jules-primary flex flex-col overflow-hidden selection:bg-jules-accent selection:text-jules-bg">

            {/* 🟣 TOP BAR */}
            <header className="h-14 border-b border-jules-border/30 bg-[#120129] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-6 h-6 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-xs rounded-none">&lt;/&gt;</div>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-sm leading-tight">{project?.name || "Loading Project..."}</h1>
                        <div className="text-[10px] text-jules-muted flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {project?.isPublic ? "Public" : "Private"} • {onlineUsers.length} Online
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Online Users Avatars */}
                    <div className="flex -space-x-2 mr-4">
                        {onlineUsers.slice(0, 5).map((u, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-jules-accent border-2 border-[#120129] flex items-center justify-center text-jules-bg font-bold text-xs z-20" title={u.username}>
                                {u.username?.slice(0, 2).toUpperCase()}
                            </div>
                        ))}
                         {onlineUsers.length > 5 && (
                             <div className="w-8 h-8 rounded-full bg-jules-surface border-2 border-[#120129] flex items-center justify-center text-xs z-10">
                                 +{onlineUsers.length - 5}
                             </div>
                         )}
                    </div>
                    <Link href="/dashboard" className="bg-jules-surface border border-jules-border text-jules-muted text-xs font-bold px-3 py-1.5 rounded hover:text-white transition-colors">
                        Exit
                    </Link>
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
                        <div className="flex items-center gap-2 px-2 py-1 bg-jules-primary/5 cursor-pointer">
                            <span className="opacity-50">📂</span> src
                        </div>
                        <div className="pl-6 space-y-1">
                            <div className="flex items-center gap-2 px-2 py-1 bg-jules-accent/10 text-jules-accent rounded font-bold">
                                <span className="text-yellow-400">JS</span> main.js
                            </div>
                        </div>
                        <div className="p-4 text-xs text-jules-muted italic text-center mt-4">
                            Multi-file support coming soon
                        </div>
                    </div>

                    {/* Members Panel */}
                    <div className="p-3 border-t border-jules-border/30">
                        <div className="text-xs font-bold text-jules-muted uppercase tracking-wider mb-3">Online Now</div>
                        <div className="space-y-2">
                            {onlineUsers.map((u, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {u.name || u.username} {u._id === user._id && "(You)"}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* 🧠 CENTER - CODE EDITOR */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A23] relative">
                    {/* Tabs */}
                    <div className="flex items-center bg-[#0E0E1E] border-b border-jules-border/30">
                        <div className="px-4 py-2 text-xs font-bold bg-[#0A0A23] border-r border-[#0A0A23] text-jules-accent border-t-2 border-t-jules-accent flex items-center gap-2">
                            <span className="text-yellow-400">JS</span> main.js
                            <span className="ml-2 opacity-50 text-[10px]">Edited just now</span>
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 overflow-hidden relative">
                         <CodeEditor projectId={projectId} />
                    </div>

                    {/* Editor Status Bar */}
                    <div className="bg-[#1D0245] border-t border-jules-border/30 p-1 flex justify-between items-center text-[10px] text-jules-muted px-3">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Connected</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span>JavaScript</span>
                            <span>UTF-8</span>
                        </div>
                    </div>
                </main>

                {/* 💬 RIGHT SIDEBAR - CHAT / TASKS */}
                <aside className="w-80 border-l border-jules-border/30 bg-[#0E0E1E] flex flex-col shrink-0">
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
                                    {messages.map((m, i) => {
                                        const isMe = m.senderId?._id === user._id || m.senderId === user._id; // Handle populated vs raw ID
                                        const senderName = m.senderId?.username || m.senderId?.name || "User";

                                        return (
                                            <div key={i} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                                                 <div className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 mt-1 ${isMe ? "bg-jules-accent text-jules-bg" : "bg-[#E546CA] text-white"}`}>
                                                     {senderName.slice(0, 2).toUpperCase()}
                                                 </div>
                                                 <div className={`${isMe ? "text-right" : "text-left"} max-w-[80%]`}>
                                                     <div className="text-xs font-bold text-jules-muted mb-0.5">{senderName}</div>
                                                     <div className={`text-sm p-2 rounded-lg border text-jules-primary/90 break-words ${isMe ? "bg-jules-accent/10 border-jules-accent/30 rounded-tr-none" : "bg-[#0A0A23] border-jules-border/30 rounded-tl-none"}`}>
                                                         {m.content}
                                                     </div>
                                                 </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="p-3 border-t border-jules-border/30 bg-[#120129]">
                                    <input
                                        type="text"
                                        placeholder="Write a message..."
                                        value={chatText}
                                        onChange={(e) => setChatText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        className="w-full bg-[#0A0A23] border border-jules-border/30 rounded px-3 py-2 text-sm text-jules-primary focus:outline-none focus:border-jules-accent"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col p-4">
                                <div className="mb-4 flex gap-2">
                                     <input
                                        className="flex-1 bg-[#0A0A23] border border-jules-border/30 rounded px-2 py-1 text-xs text-white"
                                        placeholder="New Task..."
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && createTask()}
                                     />
                                     <button onClick={createTask} className="bg-jules-accent text-jules-bg text-xs font-bold px-2 rounded">+</button>
                                </div>
                                <div className="space-y-3 overflow-y-auto flex-1">
                                    {tasks.map((t) => (
                                        <div key={t._id} className="flex items-start gap-3 group cursor-pointer" onClick={() => toggleTask(t)}>
                                            <div className={`w-4 h-4 mt-0.5 border rounded flex items-center justify-center text-[10px] transition-colors ${t.status === 'done' ? "border-green-500 bg-green-500/20 text-green-500" : "border-jules-muted/50 group-hover:border-jules-accent"}`}>
                                                {t.status === 'done' && "✓"}
                                            </div>
                                            <div className={`text-sm ${t.status === 'done' ? "text-jules-muted line-through" : "text-jules-primary"}`}>
                                                {t.title}
                                            </div>
                                        </div>
                                    ))}
                                    {tasks.length === 0 && <div className="text-xs text-jules-muted text-center mt-10">No tasks yet</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

            </div>
        </div>
    );
}
