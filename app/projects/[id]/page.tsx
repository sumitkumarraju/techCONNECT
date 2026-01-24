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
    const [files, setFiles] = useState<any[]>([]);
    const [activeFile, setActiveFile] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

    // UI State
    const [rightPanelTab, setRightPanelTab] = useState<"chat" | "ai">("chat");
    const [chatText, setChatText] = useState("");
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const [newFileName, setNewFileName] = useState("");

    // AI State
    const [aiMessages, setAiMessages] = useState<any[]>([{ role: "assistant", content: "Hello! I'm Jules, your AI coding assistant. How can I help you with your code today?" }]);
    const [aiInput, setAiInput] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const aiMessagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Data Fetch
    useEffect(() => {
        if (!user || !projectId) return;

        const fetchData = async () => {
            try {
                const [projRes, filesRes, msgsRes] = await Promise.all([
                    API.get(`/projects/${projectId}`),
                    API.get(`/projects/${projectId}/files`),
                    API.get(`/projects/${projectId}/messages`)
                ]);
                setProject(projRes.data);
                setFiles(filesRes.data);
                setMessages(msgsRes.data);

                // Open first file by default if exists
                if (filesRes.data.length > 0) {
                    fetchFileContent(filesRes.data[0]._id);
                }
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

        // Event Listeners (Chat & Presence only for now)
        const handleReceiveMessage = (message: any) => {
            setMessages(prev => [...prev, message]);
        };
        const handleOnlineUsers = (users: any[]) => {
            setOnlineUsers(users);
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("online-users", handleOnlineUsers);

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("online-users", handleOnlineUsers);
            socket.disconnect();
        };
    }, [projectId, user]);

    // Fetch full file content when selected
    const fetchFileContent = async (fileId: string) => {
        try {
            // Join Socket Room for this file
            if (activeFile && activeFile._id !== fileId) {
                // Ideally leave previous room, but socket.io handles multi-room fine.
                // We'll rely on joining the new room.
            }
            // socket.emit("join-file", fileId); // REMOVED: Using project-scoped rooms now

            const { data } = await API.get(`/files/${fileId}`);
            setActiveFile(data);
        } catch (error) {
            console.error("Failed to fetch file content", error);
        }
    };

    // File Operations
    const handleCreateFile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFileName) return;

        try {
            // Determine language from extension
            const ext = newFileName.split('.').pop();
            const language = ext === 'js' ? 'javascript' : ext === 'py' ? 'python' : ext === 'ts' ? 'typescript' : 'plaintext';

            const { data } = await API.post(`/projects/${projectId}/files`, {
                name: newFileName,
                language
            });

            setFiles(prev => [...prev, data]);
            setNewFileName("");
            setIsCreatingFile(false);
            setActiveFile(data); // Switch to new file
        } catch (error) {
            console.error("Failed to create file", error);
            alert("Failed to create file. Name might be duplicate.");
        }
    };

    const handleDeleteFile = async (fileId: string) => {
        if (!confirm("Are you sure you want to delete this file?")) return;
        try {
            await API.delete(`/files/${fileId}`);
            setFiles(prev => prev.filter(f => f._id !== fileId));
            if (activeFile?._id === fileId) {
                setActiveFile(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Auto-save & Status
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Editor Update Handler
    const handleCodeChange = (newContent: string) => {
        setActiveFile((prev: any) => ({ ...prev, content: newContent }));
        setSaveStatus("unsaved");

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveFile(newContent);
        }, 2000);
    };

    // Save File
    const saveFile = async (dataToSave?: string) => {
        if (!activeFile) return;
        const content = dataToSave !== undefined ? dataToSave : activeFile.content;

        setSaveStatus("saving");
        try {
            await API.put(`/files/${activeFile._id}`, { content });
            setSaveStatus("saved");
        } catch (error) {
            console.error("Failed to save", error);
            setSaveStatus("unsaved");
        }
    };

    // Run Code
    const [isRunning, setIsRunning] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState("");

    const handleRunCode = async () => {
        if (!activeFile) return;
        setIsRunning(true);
        setTerminalOutput("Running...");

        try {
            const { data } = await API.post("/run", {
                language: activeFile.language,
                code: activeFile.content
            });
            setTerminalOutput(data.output || "No output returned.");
        } catch (error: any) {
            console.error(error);
            setTerminalOutput(`Error: ${error.response?.data?.error || "Execution failed"}`);
        } finally {
            setIsRunning(false);
        }
    };

    // AI Logic
    useEffect(() => {
        aiMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages, rightPanelTab]);

    const handleAskAI = async () => {
        if (!aiInput.trim()) return;
        const message = aiInput;
        setAiInput("");

        // Add User Message
        setAiMessages(prev => [...prev, { role: "user", content: message }]);
        setIsAiLoading(true);

        try {
            const { data } = await API.post("/ai", {
                message,
                context: activeFile?.content || ""
            });

            setAiMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        } catch (error) {
            console.error("AI Error", error);
            setAiMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    // Chat Logic
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, rightPanelTab]);

    const sendMessage = async () => {
        if (!chatText.trim() || !user) return;
        const content = chatText;
        setChatText("");

        try {
            await API.post(`/projects/${projectId}/messages`, { content });
            socket.emit("send-message", {
                projectId,
                message: {
                    content,
                    senderId: { _id: user._id, username: user.username, name: user.name },
                    createdAt: new Date().toISOString()
                }
            });
            setMessages(prev => [...prev, {
                content,
                senderId: { _id: user._id, username: user.username, name: user.name },
                createdAt: new Date().toISOString()
            }]);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    if (!user) return <div className="h-screen bg-[#1e1e1e] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="font-mono h-screen bg-[#1e1e1e] text-gray-300 flex flex-col overflow-hidden selection:bg-blue-500/30 selection:text-white">

            {/* 🟣 TOP BAR - VS Code Style */}
            <header className="h-10 border-b border-[#2b2b2b] bg-[#333333] flex items-center justify-between px-3 shrink-0 select-none">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-6 h-6 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-xs rounded-none">&lt;/&gt;</div>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-sm leading-tight">{project?.name || "Loading Project..."}</h1>
                        <div className="text-[10px] text-jules-muted flex items-center gap-2">
                            {project?.isPublic ? "Public" : "Private"} • {onlineUsers.length} Online
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning || !activeFile}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1 font-bold rounded transition-colors ${isRunning ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-500"}`}
                    >
                        {isRunning ? "Running..." : "▶ Run"}
                    </button>

                    <button onClick={() => saveFile()} className="text-xs bg-jules-accent text-jules-bg px-3 py-1 font-bold rounded hover:opacity-90 min-w-[60px]">
                        {saveStatus === "saving" ? "Saving..." : saveStatus === "unsaved" ? "Save" : "Saved"}
                    </button>
                    <Link href="/dashboard" className="bg-jules-surface border border-jules-border text-jules-muted text-xs font-bold px-3 py-1.5 rounded hover:text-white transition-colors">
                        Exit
                    </Link>
                </div>
            </header>

            {/* MAIN WORKSPACE AREA */}
            <div className="flex-1 flex overflow-hidden">

                {/* 📂 LEFT SIDEBAR - FILE EXPLORER */}
                <aside className="w-64 border-r border-[#2b2b2b] bg-[#252526] flex flex-col shrink-0 text-sm">
                    <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center shrink-0">
                        <span>Explorer</span>
                        <button
                            onClick={() => setIsCreatingFile(!isCreatingFile)}
                            className="hover:text-white text-lg leading-none" title="New File"
                        >
                            +
                        </button>
                    </div>

                    {isCreatingFile && (
                        <div className="px-2 py-1 bg-[#37373d]">
                            <form onSubmit={handleCreateFile}>
                                <input
                                    autoFocus
                                    className="w-full bg-transparent border border-blue-500 text-sm px-1 py-0.5 focus:outline-none text-white placeholder-gray-500"
                                    placeholder="filename.js"
                                    value={newFileName}
                                    onChange={e => setNewFileName(e.target.value)}
                                    onBlur={() => !newFileName && setIsCreatingFile(false)}
                                />
                            </form>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto pt-1 space-y-0.5">
                        {files.map(file => (
                            <div
                                key={file._id}
                                onClick={() => fetchFileContent(file._id)}
                                className={`flex items-center justify-between px-4 py-1 cursor-pointer text-sm group ${activeFile?._id === file._id ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e] text-gray-300"}`}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <span className="opacity-70 text-blue-400">📄</span>
                                    {file.name}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteFile(file._id); }}
                                    className="hidden group-hover:block text-gray-400 hover:text-white"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Members Panel */}
                    <div className="px-4 py-3 border-t border-[#2b2b2b]">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Online</div>
                        <div className="space-y-1">
                            {onlineUsers.map((u, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                    {u.name || u.username} {u._id === user._id && "(You)"}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* 🧠 CENTER - CODE EDITOR & TERMINAL */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative">
                    <div className="flex-1 overflow-hidden relative">
                        <CodeEditor
                            file={activeFile}
                            onCodeChange={handleCodeChange}
                            onSave={() => saveFile()}
                        />
                    </div>

                    {/* TERMINAL PANEL */}
                    <div className="h-48 bg-[#1e1e1e] border-t border-[#2b2b2b] flex flex-col shrink-0">
                        <div className="flex items-center justify-between px-4 py-1 border-b border-[#2b2b2b] bg-[#1e1e1e]">
                            <span className="text-[11px] font-bold uppercase text-gray-500">Terminal</span>
                            <button onClick={() => setTerminalOutput("")} className="text-[10px] hover:text-white text-gray-500">Clear</button>
                        </div>
                        <div className="flex-1 p-3 font-mono text-xs overflow-y-auto whitespace-pre-wrap text-gray-300">
                            {terminalOutput || <span className="text-gray-600 italic">Ready to run code...</span>}
                        </div>
                    </div>
                </main>

                {/* 💬 RIGHT SIDEBAR - CHAT & AI */}
                <aside className="w-80 border-l border-[#2b2b2b] bg-[#252526] flex flex-col shrink-0">
                    <div className="flex border-b border-[#2b2b2b]">
                        <button
                            onClick={() => setRightPanelTab("chat")}
                            className={`flex-1 py-2 text-[11px] font-bold uppercase transition-colors ${rightPanelTab === "chat" ? "text-white border-b-2 border-blue-500 bg-[#1e1e1e]" : "text-gray-500 hover:text-gray-300"}`}
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => setRightPanelTab("ai")}
                            className={`flex-1 py-2 text-[11px] font-bold uppercase transition-colors ${rightPanelTab === "ai" ? "text-white border-b-2 border-purple-500 bg-[#1e1e1e]" : "text-gray-500 hover:text-gray-300"}`}
                        >
                            AI Assistant
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden relative flex flex-col">

                        {/* TEAM CHAT TAB */}
                        {rightPanelTab === "chat" && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1e1e1e]">
                                    {messages.map((m, i) => {
                                        const isMe = m.senderId?._id === user._id || m.senderId === user._id;
                                        const senderName = m.senderId?.username || m.senderId?.name || "User";
                                        return (
                                            <div key={i} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                                                <div className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 mt-1 ${isMe ? "bg-blue-600 text-white" : "bg-gray-600 text-white"}`}>
                                                    {senderName.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className={`${isMe ? "text-right" : "text-left"} max-w-[80%]`}>
                                                    <div className="text-[10px] font-bold text-gray-500 mb-0.5">{senderName}</div>
                                                    <div className={`text-sm px-3 py-2 rounded-lg break-words text-gray-200 ${isMe ? "bg-blue-600/20 border border-blue-600/30 rounded-tr-none" : "bg-[#252526] border border-[#333] rounded-tl-none"}`}>
                                                        {m.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="p-3 border-t border-[#2b2b2b] bg-[#252526]">
                                    <input
                                        type="text"
                                        placeholder="Message..."
                                        value={chatText}
                                        onChange={(e) => setChatText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        className="w-full bg-[#3c3c3c] border border-[#2b2b2b] rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-gray-500"
                                    />
                                </div>
                            </>
                        )}

                        {/* AI ASSISTANT TAB */}
                        {rightPanelTab === "ai" && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1e1e1e]">
                                    {aiMessages.map((m, i) => {
                                        const isAi = m.role === "assistant";
                                        return (
                                            <div key={i} className={`flex gap-3 ${!isAi ? "flex-row-reverse" : ""}`}>
                                                <div className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 mt-1 ${!isAi ? "bg-blue-600 text-white" : "bg-purple-600 text-white"}`}>
                                                    {isAi ? "AI" : "YOU"}
                                                </div>
                                                <div className={`${!isAi ? "text-right" : "text-left"} max-w-[90%]`}>
                                                    <div className="text-[10px] font-bold text-gray-500 mb-0.5">{isAi ? "Jules" : "You"}</div>
                                                    <div className={`text-sm px-3 py-2 rounded-lg break-words text-gray-200 ${!isAi ? "bg-blue-600/20 border border-blue-600/30 rounded-tr-none" : "bg-[#252526] border border-purple-900/40 rounded-tl-none"}`}>
                                                        <div className="whitespace-pre-wrap">{m.content}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {isAiLoading && (
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-1">AI</div>
                                            <div className="bg-[#252526] border border-purple-500/30 p-2 rounded-lg rounded-tl-none text-xs text-gray-400 animate-pulse">
                                                Thinking...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={aiMessagesEndRef} />
                                </div>
                                <div className="p-3 border-t border-[#2b2b2b] bg-[#252526]">
                                    <input
                                        type="text"
                                        placeholder="Ask Jules about your code..."
                                        value={aiInput}
                                        onChange={(e) => setAiInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                                        className="w-full bg-[#3c3c3c] border border-purple-500/30 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder-gray-500"
                                    />
                                    <div className="text-[10px] text-gray-600 mt-1 text-center">
                                        Context: {activeFile ? activeFile.name : "None"}
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </aside>

            </div>
        </div>
    );
}
