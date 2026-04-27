"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";
import socket from "@/lib/socket";
import dynamic from "next/dynamic";
import { CodeEditorHandle } from "@/components/CodeEditor"; // Keep type import
import InviteModal from "@/components/InviteModal";

// Full language mapping from file extension
const EXT_TO_LANGUAGE: Record<string, string> = {
    js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
    ts: 'typescript', tsx: 'typescript',
    py: 'python', pyw: 'python',
    java: 'java',
    c: 'c', h: 'c',
    cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin', kts: 'kotlin',
    sh: 'bash', bash: 'bash', zsh: 'bash',
    lua: 'lua',
    pl: 'perl', pm: 'perl',
    r: 'r', R: 'r',
    scala: 'scala',
    dart: 'dart',
    ex: 'elixir', exs: 'elixir',
    hs: 'haskell',
    clj: 'clojure',
    coffee: 'coffeescript',
    f90: 'fortran', f95: 'fortran',
    groovy: 'groovy',
    pas: 'pascal',
    sql: 'sql',
    html: 'html', htm: 'html',
    css: 'css', scss: 'scss', sass: 'sass', less: 'less',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml', yml: 'yaml',
    md: 'markdown',
    txt: 'plaintext',
};

const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return EXT_TO_LANGUAGE[ext] || 'plaintext';
};

interface AIAssistantEdit {
    fileName: string;
    action: "update" | "create";
    content: string;
}

interface AIChatMessage {
    role: "assistant" | "user";
    content: string;
    edits?: AIAssistantEdit[];
    appliedEdits?: AIAssistantEdit[];
}

interface AIAppliedEditRecord {
    fileName: string;
    action: "update" | "create";
    beforeContent: string | null;
    afterContent: string;
    fileId?: string;
    createdFileId?: string;
}

interface AIAuditBatch {
    id: string;
    timestamp: string;
    prompt: string;
    edits: AIAssistantEdit[];
    records: AIAppliedEditRecord[];
}

interface QualityGateResult {
    ok: boolean;
    errors: string[];
    warnings: string[];
}

interface WorkspaceNotification {
    id: string;
    message: string;
    type: "join" | "leave" | "ai" | "system";
    timestamp: string;
}

// Dynamic Imports with Lazy Loading
const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-gray-500 text-sm">Loading Editor...</div>
});
const OnlineUsers = dynamic(() => import("@/components/OnlineUsers"), { ssr: false });
const VersionHistory = dynamic(() => import("@/components/VersionHistory"), { ssr: false });
const DiscussionPanel = dynamic(() => import("@/components/DiscussionPanel"), { ssr: false });

// Helper to parse markdown code blocks
const ParsedAIMessage = ({ content, onInsert }: { content: string, onInsert: (code: string) => void }) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
        <div className="whitespace-pre-wrap">
            {parts.map((part, i) => {
                const match = part.match(/```(\w*)\n([\s\S]*?)```/);
                if (match) {
                    const lang = match[1];
                    const code = match[2];
                    return (
                        <div key={i} className="my-2 rounded overflow-hidden border border-[#333]">
                            <div className="bg-[#2d2d2d] px-3 py-1 text-xs flex justify-between items-center text-gray-400">
                                <span className="uppercase font-bold">{lang || "code"}</span>
                                <button
                                    onClick={() => onInsert(code)}
                                    className="hover:text-white bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                                >
                                    <span>↦</span> Insert
                                </button>
                            </div>
                            <div className="bg-[#1e1e1e] p-3 text-xs overflow-x-auto">
                                <code>{code}</code>
                            </div>
                        </div>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </div>
    );
};

export default function ProjectPage() {
    const { id: projectId } = useParams() as { id: string };
    const { user } = useAuth();

    // Editor Ref for AI Insertion
    const editorRef = useRef<CodeEditorHandle>(null);

    // Data State
    const [project, setProject] = useState<any>(null);
    const [files, setFiles] = useState<any[]>([]);
    const [activeFile, setActiveFile] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);

    // Presence State
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);

    // Permission State
    const [myRole, setMyRole] = useState<"owner" | "editor" | "viewer">("viewer");
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Version State
    const [versions, setVersions] = useState<any[]>([]);
    const [isVersionsLoading, setIsVersionsLoading] = useState(false);
    const [activeVersionId, setActiveVersionId] = useState<string | null>(null);

    // UI State
    const [rightPanelTab, setRightPanelTab] = useState<"chat" | "ai" | "versions" | "discuss">("chat");
    const [chatText, setChatText] = useState("");
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const [showHtmlPreview, setShowHtmlPreview] = useState(false);
    const [leftPaneWidth, setLeftPaneWidth] = useState(256);
    const [rightPaneWidth, setRightPaneWidth] = useState(320);
    const [editorPaneRatio, setEditorPaneRatio] = useState(0.55);
    const [resizeMode, setResizeMode] = useState<null | "left" | "right" | "center">(null);

    // AI State
    const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([{ role: "assistant", content: "Hello! I'm Jules, your AI coding assistant. How can I help you with your code today?" }]);
    const [aiInput, setAiInput] = useState("");
    const [aiModel, setAiModel] = useState("minimaxai/minimax-m2.7");
    const [aiScope, setAiScope] = useState<"current_file" | "project_files">("current_file");
    const [aiApplyMode, setAiApplyMode] = useState<"manual" | "auto">("manual");
    const [requireReviewBeforeApply, setRequireReviewBeforeApply] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiHistory, setAiHistory] = useState<AIAuditBatch[]>([]);
    const [editPreviewByKey, setEditPreviewByKey] = useState<Record<string, { before: string; after: string; loaded: boolean; error?: string }>>({});
    const [joinNotice, setJoinNotice] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<WorkspaceNotification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const aiMessagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Data Fetch & Socket
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

                // Determine Role
                if (projRes.data.ownerId === user._id) {
                    setMyRole("owner");
                } else {
                    const member = projRes.data.members?.find((m: any) => m.userId === user._id);
                    setMyRole(member ? member.role : "viewer"); // Default to viewer if not found? Or handle access denied?
                    // Note: Ideally the API shouldn't return the project if no access, but assuming we have public projects:
                    // If public and not member -> viewer.
                }

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

        // Random Color for Presence
        const colors = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#f43f5e"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const joinPayload = {
            projectId,
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                color: randomColor
            }
        };

        const emitJoin = () => socket.emit("user-join", joinPayload);

        // Show current user immediately while socket presence sync catches up
        setOnlineUsers((prev) => {
            const exists = prev.some((u: any) => u._id === user._id);
            if (exists) return prev;
            return [...prev, joinPayload.user];
        });

        if (socket.connected) {
            emitJoin();
        }

        // Event Listeners (Chat & Presence)
        const handleReceiveMessage = (message: any) => {
            setMessages(prev => [...prev, message]);
        };
        const handlePresenceUpdate = (users: any[]) => {
            setOnlineUsers(users);
        };
        const handleUserTyping = (userId: string) => {
            if (userId !== user._id) {
                setTypingUser(userId);
                // Clear after 2 seconds
                setTimeout(() => setTypingUser(null), 2000);
            }
        };
        const handleSocketConnect = () => {
            emitJoin();
        };
        const handleUserJoinedNotice = (payload: any) => {
            const joinedName = payload?.user?.name || payload?.user?.username || "A user";
            if (payload?.user?._id && payload.user._id === user._id) return;
            const notice = `${joinedName} joined the room`;
            setJoinNotice(notice);
            setNotifications((prev) => [
                {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    message: notice,
                    type: "join" as const,
                    timestamp: new Date().toISOString(),
                },
                ...prev,
            ].slice(0, 50));
            setTimeout(() => setJoinNotice(null), 3500);
        };
        const handleUserLeftNotice = (payload: any) => {
            const leftName = payload?.user?.name || payload?.user?.username || "A user";
            if (payload?.user?._id && payload.user._id === user._id) return;
            const notice = `${leftName} left the room`;
            setJoinNotice(notice);
            setNotifications((prev) => [
                {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    message: notice,
                    type: "leave" as const,
                    timestamp: new Date().toISOString(),
                },
                ...prev,
            ].slice(0, 50));
            setTimeout(() => setJoinNotice(null), 3500);
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("presence-update", handlePresenceUpdate);
        socket.on("user-typing", handleUserTyping);
        socket.on("user-joined-notice", handleUserJoinedNotice);
        socket.on("user-left-notice", handleUserLeftNotice);
        socket.on("connect", handleSocketConnect);

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("presence-update", handlePresenceUpdate);
            socket.off("user-typing", handleUserTyping);
            socket.off("user-joined-notice", handleUserJoinedNotice);
            socket.off("user-left-notice", handleUserLeftNotice);
            socket.off("connect", handleSocketConnect);
            socket.disconnect();
        };
    }, [projectId, user]);

    const runQualityGate = (edits: AIAssistantEdit[]): QualityGateResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        const secretPattern = /(sk-[A-Za-z0-9_-]{20,}|nvapi-[A-Za-z0-9_-]{10,}|AIza[0-9A-Za-z-_]{20,}|-----BEGIN [A-Z ]+PRIVATE KEY-----)/;
        const forbiddenFilePattern = /(^|\/)\.env($|\.|\/)|(^|\/)\.git\/|package-lock\.json$|yarn\.lock$|pnpm-lock\.yaml$/i;

        if (!edits.length) {
            errors.push("No edits to apply.");
        }

        edits.forEach((edit) => {
            if (!edit.fileName?.trim()) {
                errors.push("Edit contains missing file name.");
            }
            if (forbiddenFilePattern.test(edit.fileName || "")) {
                errors.push(`Blocked sensitive file: ${edit.fileName}`);
            }
            if (!edit.content || !edit.content.trim()) {
                errors.push(`Empty content for ${edit.fileName}`);
            }
            if (secretPattern.test(edit.content || "")) {
                errors.push(`Potential secret detected in ${edit.fileName}`);
            }
            if ((edit.content || "").length > 20000) {
                warnings.push(`Large edit for ${edit.fileName} (${edit.content.length} chars)`);
            }
            if ((edit.fileName || "").includes("auth") || (edit.fileName || "").includes("security")) {
                warnings.push(`High-impact file touched: ${edit.fileName}`);
            }
        });

        return { ok: errors.length === 0, errors, warnings };
    };

    // Fetch full file content when selected
    const fetchFileContent = async (fileId: string) => {
        try {
            const { data } = await API.get(`/files/${fileId}`);
            setActiveFile(data);
        } catch (error) {
            console.error("Failed to fetch file content", error);
        }
    };

    // File Operations
    const handleCreateFile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (myRole === "viewer") return alert("Viewers cannot create files.");
        if (!newFileName) return;

        try {
            const language = getLanguageFromFilename(newFileName);

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
        if (myRole === "viewer") return alert("Viewers cannot delete files.");
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
        if (myRole === "viewer") return; // Silent fail or toast?
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
    }


    // Version History Logic
    // Version History Logic
    const handleFetchVersions = useCallback(async () => {
        if (!activeFile) return;
        setIsVersionsLoading(true);
        try {
            const { data } = await API.get(`/files/version?fileId=${activeFile._id}`);
            setVersions(data);
        } catch (error) {
            console.error("Failed to fetch versions", error);
        } finally {
            setIsVersionsLoading(false);
        }
    }, [activeFile]);

    const handleRestoreVersion = async (versionId: string) => {
        if (!activeFile) return;
        try {
            const { data } = await API.post("/files/restore", {
                fileId: activeFile._id,
                versionId
            });
            // Update local state immediately
            setActiveFile((prev: any) => ({ ...prev, content: data.content }));

            // Re-fetch versions to maybe show a new snapshot if we decided to create one implies restore
            handleFetchVersions();

            // Notify others via socket (optional but good)
            if (socket) {
                socket.emit("file-update", { fileId: activeFile._id, content: data.content });
            }

        } catch (error) {
            console.error("Failed to restore", error);
            alert("Failed to restore version");
        }
    };

    // Auto-save a version on manual save (optional logic, enabling for better experience)
    const handleSaveVersion = async () => {
        if (!activeFile || !user) return;
        try {
            await API.post("/files/version", {
                fileId: activeFile._id,
                projectId,
                content: activeFile.content,
                userId: user._id
            });
            handleFetchVersions(); // Refresh list
        } catch (error) {
            console.error("Failed to save snapshot", error);
        }
    };

    useEffect(() => {
        if (rightPanelTab === "versions") {
            handleFetchVersions();
        }
    }, [rightPanelTab, activeFile, handleFetchVersions]);


    // Run Code
    const [isRunning, setIsRunning] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState("");

    const handleRunCode = async () => {
        if (!activeFile) return;
        setIsRunning(true);
        const lang = activeFile.language || getLanguageFromFilename(activeFile.name || '');
        setTerminalOutput(`⏳ Running ${lang}...\n`);

        try {
            const { data } = await API.post("/run", {
                language: lang,
                code: activeFile.content
            });
            const header = `[${data.language || lang} v${data.version || '?'}] Exit code: ${data.exitCode ?? '?'}\n${'─'.repeat(40)}\n`;
            setTerminalOutput(header + (data.output || "(No output)"));
        } catch (error: any) {
            console.error(error);
            setTerminalOutput(`❌ Error: ${error.response?.data?.error || "Execution failed"}`);
        } finally {
            setIsRunning(false);
        }
    };

    const isHtmlPreviewFile =
        !!activeFile &&
        (activeFile.language === "html" ||
            activeFile.name?.toLowerCase().endsWith(".html") ||
            activeFile.name?.toLowerCase().endsWith(".htm"));

    useEffect(() => {
        if (!isHtmlPreviewFile) {
            setShowHtmlPreview(false);
        }
    }, [isHtmlPreviewFile]);

    useEffect(() => {
        const onMove = (event: MouseEvent) => {
            if (!resizeMode) return;
            if (resizeMode === "left") {
                const next = Math.max(200, Math.min(520, event.clientX));
                setLeftPaneWidth(next);
                return;
            }
            if (resizeMode === "right") {
                const next = Math.max(260, Math.min(560, window.innerWidth - event.clientX));
                setRightPaneWidth(next);
                return;
            }
            if (resizeMode === "center") {
                if (!showHtmlPreview) return;
                const container = document.getElementById("editor-preview-container");
                if (!container) return;
                const rect = container.getBoundingClientRect();
                const ratio = (event.clientX - rect.left) / rect.width;
                setEditorPaneRatio(Math.max(0.3, Math.min(0.75, ratio)));
            }
        };

        const onUp = () => setResizeMode(null);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [resizeMode, showHtmlPreview]);

    // AI Logic
    useEffect(() => {
        aiMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages, rightPanelTab]);

    const refreshProjectFiles = async () => {
        try {
            const { data } = await API.get(`/projects/${projectId}/files`);
            setFiles(data);

            if (activeFile?._id) {
                const matched = data.find((f: any) => f._id === activeFile._id || f.name === activeFile.name);
                if (matched) {
                    await fetchFileContent(matched._id);
                }
            }
            return data as any[];
        } catch (error) {
            console.error("Failed to refresh project files", error);
            return [];
        }
    };

    const pushNotification = (message: string, type: WorkspaceNotification["type"] = "system") => {
        setNotifications((prev) => [
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                message,
                type,
                timestamp: new Date().toISOString(),
            },
            ...prev,
        ].slice(0, 50));
    };

    const copyEditCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            alert("Code copied to clipboard");
        } catch {
            alert("Failed to copy code to clipboard");
        }
    };

    const getCurrentFileContentByName = async (fileName: string): Promise<{ fileId?: string; content: string | null }> => {
        const existing = files.find((f: any) => f.name === fileName);
        if (!existing?._id) {
            return { fileId: undefined, content: null };
        }
        try {
            const { data } = await API.get(`/files/${existing._id}`);
            return { fileId: existing._id, content: data?.content ?? "" };
        } catch {
            return { fileId: existing._id, content: null };
        }
    };

    const loadEditDiffPreview = async (edit: AIAssistantEdit, key: string) => {
        const current = await getCurrentFileContentByName(edit.fileName);
        setEditPreviewByKey((prev) => ({
            ...prev,
            [key]: {
                before: current.content ?? "// File does not exist yet",
                after: edit.content,
                loaded: true,
            },
        }));
    };

    const applyManualEdit = async (edit: AIAssistantEdit, options?: { silent?: boolean }): Promise<AIAppliedEditRecord | null> => {
        try {
            const gate = runQualityGate([edit]);
            if (!gate.ok) {
                alert(`Quality Gate blocked apply:\n- ${gate.errors.join("\n- ")}`);
                return null;
            }
            if (gate.warnings.length && !options?.silent) {
                const proceed = confirm(`Quality Gate warnings:\n- ${gate.warnings.join("\n- ")}\n\nProceed anyway?`);
                if (!proceed) return null;
            }

            if (myRole === "viewer") {
                alert("Viewers cannot apply edits.");
                return null;
            }

            let targetFileName = edit.fileName;
            const beforeSnapshot = await getCurrentFileContentByName(edit.fileName);
            let createdFileId: string | undefined;
            let updatedFileId: string | undefined = beforeSnapshot.fileId;

            if (edit.action === "update") {
                const existing = files.find((f: any) => f.name === edit.fileName);
                if (!existing) {
                    alert(`Cannot update "${edit.fileName}" because it does not exist.`);
                    return null;
                }
                await API.put(`/files/${existing._id}`, { content: edit.content });
                updatedFileId = existing._id;
            } else {
                const existing = files.find((f: any) => f.name === edit.fileName);
                if (existing) {
                    await API.put(`/files/${existing._id}`, { content: edit.content });
                    updatedFileId = existing._id;
                } else {
                    const created = await API.post(`/projects/${projectId}/files`, {
                        name: edit.fileName,
                        language: getLanguageFromFilename(edit.fileName),
                        content: edit.content,
                    });
                    targetFileName = created.data?.name || edit.fileName;
                    createdFileId = created.data?._id;
                }
            }

            const latestFiles = await refreshProjectFiles();
            const targetFile = latestFiles.find((f: any) => f.name === targetFileName);
            if (targetFile?._id) {
                await fetchFileContent(targetFile._id);
                updatedFileId = targetFile._id;
            }
            if (!options?.silent) {
                alert(`Applied AI edit to ${edit.fileName}`);
            }

            return {
                fileName: edit.fileName,
                action: edit.action,
                beforeContent: beforeSnapshot.content,
                afterContent: edit.content,
                fileId: updatedFileId,
                createdFileId,
            };
        } catch (error: any) {
            if (!options?.silent) {
                alert(error?.response?.data?.message || "Failed to apply AI edit.");
            } else {
                throw error;
            }
            return null;
        }
    };

    const applyAllEdits = async (edits: AIAssistantEdit[]) => {
        if (!edits.length) return;
        if (myRole === "viewer") {
            alert("Viewers cannot apply edits.");
            return;
        }

        try {
            const gate = runQualityGate(edits);
            if (!gate.ok) {
                alert(`Quality Gate blocked apply-all:\n- ${gate.errors.join("\n- ")}`);
                return;
            }
            if (gate.warnings.length) {
                const proceed = confirm(`Quality Gate warnings:\n- ${gate.warnings.join("\n- ")}\n\nProceed with apply-all?`);
                if (!proceed) return;
            }

            const records: AIAppliedEditRecord[] = [];
            for (const edit of edits) {
                const record = await applyManualEdit(edit, { silent: true });
                if (record) {
                    records.push(record);
                }
            }

            if (records.length) {
                setAiHistory((prev) => [{
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    timestamp: new Date().toISOString(),
                    prompt: "Apply all AI proposed edits",
                    edits,
                    records,
                }, ...prev].slice(0, 20));
            }
            pushNotification(`Applied ${records.length || edits.length} AI edit(s)`, "ai");
            alert(`Applied ${edits.length} edits successfully.`);
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed while applying all edits.");
        }
    };

    const rollbackBatch = async (batch: AIAuditBatch) => {
        try {
            for (const record of [...batch.records].reverse()) {
                if (record.action === "create" && record.createdFileId) {
                    await API.delete(`/files/${record.createdFileId}`);
                    continue;
                }
                if (record.fileId) {
                    await API.put(`/files/${record.fileId}`, { content: record.beforeContent ?? "" });
                }
            }
            await refreshProjectFiles();
            setAiHistory((prev) => prev.filter((b) => b.id !== batch.id));
            pushNotification(`Rolled back AI batch (${batch.edits.length} edit(s))`, "ai");
            alert("Rollback completed.");
        } catch (error: any) {
            alert(error?.response?.data?.message || "Rollback failed.");
        }
    };

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
                context: activeFile?.content || "",
                model: aiModel,
                projectId,
                activeFileName: activeFile?.name,
                scope: aiScope,
                applyMode: requireReviewBeforeApply ? "manual" : aiApplyMode,
            });

            setAiMessages(prev => [...prev, {
                role: "assistant",
                content: data.reply,
                edits: data.edits || [],
                appliedEdits: data.appliedEdits || [],
            }]);

            if ((data.appliedEdits || []).length > 0) {
                await refreshProjectFiles();
                setAiHistory((prev) => [{
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    timestamp: new Date().toISOString(),
                    prompt: message,
                    edits: data.edits || [],
                    records: (data.appliedEdits || []).map((e: AIAssistantEdit) => ({
                        fileName: e.fileName,
                        action: e.action,
                        beforeContent: null,
                        afterContent: e.content,
                    })),
                }, ...prev].slice(0, 20));
            }
        } catch (error: any) {
            console.error("AI Error", error);
            const apiError =
                error?.response?.data?.error ||
                error?.response?.data?.details ||
                error?.message ||
                "Sorry, I encountered an error. Please try again.";
            setAiMessages(prev => [...prev, { role: "assistant", content: `AI request failed: ${apiError}` }]);
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
            // Optimistic update
            const tempMsg = {
                content,
                senderId: { _id: user._id, username: user.username, name: user.name },
                createdAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, tempMsg]);

            await API.post(`/projects/${projectId}/messages`, { content });

            socket.emit("send-message", {
                projectId,
                message: tempMsg
            });

            // Emit TYPING
            socket.emit("typing", { projectId, userId: user._id });

        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    if (!user) return <div className="h-screen bg-[#1e1e1e] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="font-mono h-screen bg-[#1e1e1e] text-gray-300 flex flex-col overflow-hidden selection:bg-blue-500/30 selection:text-white">
            {joinNotice && (
                <div className="absolute top-3 right-4 z-50 bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 px-3 py-2 rounded text-xs font-semibold shadow-lg">
                    {joinNotice}
                </div>
            )}

            {/* 🟣 TOP BAR - VS Code Style */}
            <header className="h-10 border-b border-[#2b2b2b] bg-[#333333] flex items-center justify-between px-3 shrink-0 select-none">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-6 h-6 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-xs rounded-none">&lt;/&gt;</div>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-sm leading-tight flex items-center gap-2">
                            {project?.name || "Loading Project..."}
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${myRole === 'owner' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : myRole === 'editor' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
                                {myRole}
                            </span>
                        </h1>
                        <div className="text-[10px] text-jules-muted flex items-center gap-2">
                            {project?.isPublic ? "Public" : "Private"}
                        </div>
                    </div>
                </div>

                {/* CENTER: Online Users */}
                <div className="flex-1 flex justify-center items-center">
                    <OnlineUsers users={onlineUsers} />
                    {typingUser && (
                        <span className="text-[10px] text-blue-400 animate-pulse font-bold tracking-wide">SOMEONE IS TYPING...</span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowNotifications((prev) => !prev)}
                        className="text-xs bg-[#252526] border border-[#3a3a3a] text-gray-200 px-2.5 py-1 rounded hover:bg-[#2d2d2d] transition-colors"
                        title="Notification Center"
                    >
                        🔔 {notifications.length > 0 ? `(${notifications.length})` : ""}
                    </button>
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning || !activeFile}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1 font-bold rounded transition-colors ${isRunning ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-500"}`}
                    >
                        {isRunning ? "Running..." : "▶ Run"}
                    </button>
                    {isHtmlPreviewFile && (
                        <button
                            onClick={() => setShowHtmlPreview((prev) => !prev)}
                            className={`text-xs px-3 py-1 font-bold rounded transition-colors ${showHtmlPreview ? "bg-purple-600 text-white hover:bg-purple-500" : "bg-[#252526] border border-[#3a3a3a] text-gray-200 hover:bg-[#2d2d2d]"}`}
                        >
                            {showHtmlPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                    )}

                    <button onClick={() => { saveFile(); handleSaveVersion(); }} className="text-xs bg-jules-accent text-jules-bg px-3 py-1 font-bold rounded hover:opacity-90 min-w-[60px]">
                        {saveStatus === "saving" ? "Saving..." : saveStatus === "unsaved" ? "Save" : "Saved"}
                    </button>
                    {myRole !== 'viewer' && (
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="text-xs bg-blue-600 text-white px-3 py-1 font-bold rounded hover:bg-blue-500 transition-colors flex items-center gap-1"
                        >
                            <span>👥</span> Invite
                        </button>
                    )}
                    <Link href="/dashboard" className="bg-jules-surface border border-jules-border text-jules-muted text-xs font-bold px-3 py-1.5 rounded hover:text-white transition-colors">
                        Exit
                    </Link>
                </div>
            </header>

            {/* MAIN WORKSPACE AREA */}
            <div className="flex-1 flex overflow-hidden">
                {showNotifications && (
                    <div className="absolute top-12 right-4 z-40 w-[360px] max-h-[420px] overflow-hidden rounded-lg border border-[#3a3a3a] bg-[#1b1b1b] shadow-2xl">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-[#2d2d2d]">
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-wide">Notifications</div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setNotifications([])}
                                    className="text-[10px] text-gray-400 hover:text-white"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="text-[10px] text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="max-h-[370px] overflow-y-auto p-2 space-y-2">
                            {notifications.length === 0 ? (
                                <div className="text-xs text-gray-500 p-2">No notifications yet.</div>
                            ) : (
                                notifications.map((n) => (
                                    <div key={n.id} className="rounded border border-[#303030] bg-[#232323] px-2 py-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`text-[10px] font-bold uppercase ${
                                                n.type === "join" ? "text-emerald-300" :
                                                n.type === "ai" ? "text-purple-300" :
                                                n.type === "leave" ? "text-orange-300" : "text-gray-300"
                                            }`}>
                                                {n.type}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(n.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-200 mt-1">{n.message}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* 📂 LEFT SIDEBAR - FILE EXPLORER */}
                <aside style={{ width: `${leftPaneWidth}px` }} className="border-r border-[#2b2b2b] bg-[#252526] flex flex-col shrink-0 text-sm">
                    <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center shrink-0">
                        <span>Explorer</span>
                        {myRole !== 'viewer' && (
                            <button
                                onClick={() => setIsCreatingFile(!isCreatingFile)}
                                className="hover:text-white text-lg leading-none" title="New File"
                            >
                                +
                            </button>
                        )}
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

                    {/* Members Panel (Alternative View) */}
                    <div className="px-4 py-3 border-t border-[#2b2b2b]">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Online</div>
                        <div className={`text-[10px] mb-2 ${onlineUsers.length > 0 ? "text-emerald-400" : "text-gray-600"}`}>
                            {onlineUsers.length > 0
                                ? `${onlineUsers.length} ${onlineUsers.length === 1 ? "person is" : "people are"} in this room`
                                : "No one in room yet"}
                        </div>
                        <div className="space-y-1">
                            {onlineUsers.map((u: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="w-2 h-2 rounded-full" style={{ background: u.color || '#10b981' }}></div>
                                    <span className={u._id === user._id ? "font-bold text-white" : ""}>
                                        {u.name || u.username} {u._id === user._id && "(You)"}
                                    </span>
                                </div>
                            ))}
                            {onlineUsers.length === 0 && <span className="text-xs text-zinc-600">Waiting for people to join...</span>}
                        </div>
                    </div>
                </aside>
                <div
                    onMouseDown={() => setResizeMode("left")}
                    className="w-1 cursor-col-resize bg-[#2b2b2b] hover:bg-blue-500/60 transition-colors shrink-0"
                    title="Resize explorer"
                />

                {/* 🧠 CENTER - CODE EDITOR & TERMINAL */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative">
                    <div className="flex-1 overflow-hidden relative">
                        {isHtmlPreviewFile && showHtmlPreview ? (
                            <div id="editor-preview-container" className="h-full w-full flex gap-2 p-2">
                                <div style={{ width: `${editorPaneRatio * 100}%` }} className="h-full min-w-0">
                                    <CodeEditor
                                        ref={editorRef}
                                        file={activeFile}
                                        onCodeChange={handleCodeChange}
                                        onSave={() => saveFile()}
                                        readOnly={myRole === 'viewer'}
                                    />
                                </div>
                                <div
                                    onMouseDown={() => setResizeMode("center")}
                                    className="w-1 cursor-col-resize bg-[#2b2b2b] hover:bg-purple-500/70 transition-colors shrink-0 rounded"
                                    title="Resize editor/preview"
                                />
                                <div style={{ width: `${(1 - editorPaneRatio) * 100}%` }} className="h-full rounded-xl overflow-hidden border border-zinc-800 bg-[#111] flex flex-col">
                                    <div className="bg-[#252526] px-3 py-2 border-b border-zinc-800 text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                                        Live HTML Preview
                                    </div>
                                    <iframe
                                        title="HTML Live Preview"
                                        className="flex-1 w-full bg-white"
                                        srcDoc={activeFile?.content || ""}
                                        sandbox="allow-scripts allow-forms"
                                    />
                                </div>
                            </div>
                        ) : (
                            <CodeEditor
                                ref={editorRef}
                                file={activeFile}
                                onCodeChange={handleCodeChange}
                                onSave={() => saveFile()}
                                readOnly={myRole === 'viewer'}
                            />
                        )}
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
                <div
                    onMouseDown={() => setResizeMode("right")}
                    className="w-1 cursor-col-resize bg-[#2b2b2b] hover:bg-blue-500/60 transition-colors shrink-0"
                    title="Resize sidebar"
                />
                <aside style={{ width: `${rightPaneWidth}px` }} className="border-l border-[#2b2b2b] bg-[#252526] flex flex-col shrink-0">
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
                        <button
                            onClick={() => setRightPanelTab("versions")}
                            className={`flex-1 py-2 text-[11px] font-bold uppercase transition-colors ${rightPanelTab === "versions" ? "text-white border-b-2 border-orange-500 bg-[#1e1e1e]" : "text-gray-500 hover:text-gray-300"}`}
                        >
                            History
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden relative flex flex-col">

                        {/* VERSIONS TAB */}
                        {rightPanelTab === "versions" && (
                            <VersionHistory
                                versions={versions}
                                isLoading={isVersionsLoading}
                                onRestore={handleRestoreVersion}
                                onPreview={(content) => {
                                    // Preview Logic: For now, just a confirm or maybe a modal? 
                                    // Simplest: Replace buffer but warn user it's a preview?
                                    // Actually, let's just use the restore button for now as per plan. 
                                    // But user asked for "On click -> preview". 
                                    // Let's implement a simple read-only preview mode or just load it into editor as "unsaved"
                                    if (confirm("Load this version into editor to preview? (Unsaved changes will be lost)")) {
                                        setActiveFile((prev: any) => ({ ...prev, content }));
                                    }
                                }}
                                activeVersionId={activeVersionId}
                            />
                        )}

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
                                        onChange={(e) => {
                                            setChatText(e.target.value);
                                            // Emit Typing on change (throttling would be better but simplified)
                                            if (user) socket.emit("typing", { projectId, userId: user._id });
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        className="w-full bg-[#3c3c3c] border border-[#2b2b2b] rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-gray-500"
                                    />
                                </div>
                            </>
                        )}

                        {/* AI ASSISTANT TAB */}
                        {rightPanelTab === "ai" && (
                            <>
                                <div className="p-2 border-b border-[#2b2b2b] bg-[#1e1e1e]">
                                    <select
                                        value={aiModel}
                                        onChange={(e) => setAiModel(e.target.value)}
                                        className="w-full bg-[#3c3c3c] text-xs text-white border border-[#2b2b2b] rounded px-2 py-1 focus:outline-none"
                                    >
                                        <option value="minimaxai/minimax-m2.7">NVIDIA / MiniMax M2.7</option>
                                        <option value="meta/llama-3.1-70b-instruct">NVIDIA / Llama 3.1 70B</option>
                                    </select>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <select
                                            value={aiScope}
                                            onChange={(e) => setAiScope(e.target.value as "current_file" | "project_files")}
                                            className="bg-[#3c3c3c] text-[11px] text-white border border-[#2b2b2b] rounded px-2 py-1 focus:outline-none"
                                        >
                                            <option value="current_file">Scope: Current File</option>
                                            <option value="project_files">Scope: Project Files</option>
                                        </select>
                                        <select
                                            value={aiApplyMode}
                                            onChange={(e) => setAiApplyMode(e.target.value as "manual" | "auto")}
                                            className="bg-[#3c3c3c] text-[11px] text-white border border-[#2b2b2b] rounded px-2 py-1 focus:outline-none"
                                        >
                                            <option value="manual">Apply: Manual</option>
                                            <option value="auto">Apply: Auto</option>
                                        </select>
                                    </div>
                                    <label className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                                        <input
                                            type="checkbox"
                                            checked={requireReviewBeforeApply}
                                            onChange={(e) => setRequireReviewBeforeApply(e.target.checked)}
                                            className="accent-purple-500"
                                        />
                                        Require review before apply
                                    </label>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1e1e1e]">
                                    {!!aiHistory.length && (
                                        <div className="border border-[#333] rounded bg-[#181818] p-2">
                                            <div className="text-[10px] font-bold text-gray-400 mb-2">AI Action History</div>
                                            <div className="space-y-1">
                                                {aiHistory.slice(0, 5).map((batch) => (
                                                    <div key={batch.id} className="flex items-center justify-between gap-2 text-[10px]">
                                                        <span className="text-gray-300 truncate">
                                                            {new Date(batch.timestamp).toLocaleTimeString()} · {batch.edits.length} edit(s)
                                                        </span>
                                                        <button
                                                            onClick={() => rollbackBatch(batch)}
                                                            className="px-2 py-0.5 rounded bg-red-600/20 text-red-300 hover:bg-red-600/40"
                                                        >
                                                            Rollback
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

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
                                                        {isAi ? (
                                                            <>
                                                                <ParsedAIMessage
                                                                    content={m.content}
                                                                    onInsert={(code) => editorRef.current?.insertCode(code)}
                                                                />
                                                                {!!m.edits?.length && (
                                                                    <div className="mt-2 border border-[#333] rounded bg-[#1a1a1a] p-2">
                                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                                            <div className="text-[10px] font-bold text-gray-400">Proposed file edits</div>
                                                                            <button
                                                                                onClick={() => applyAllEdits(m.edits || [])}
                                                                                disabled={aiApplyMode === "auto" || myRole === "viewer"}
                                                                                className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 disabled:opacity-40 text-[10px] font-semibold"
                                                                            >
                                                                                Apply All
                                                                            </button>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {m.edits.map((edit, idx) => {
                                                                                const editKey = `${i}-${edit.fileName}-${idx}`;
                                                                                const preview = editPreviewByKey[editKey];
                                                                                return (
                                                                                <div key={`${edit.fileName}-${idx}`} className="border border-[#2f2f2f] rounded p-2">
                                                                                    <div className="flex items-center justify-between gap-2 text-[11px]">
                                                                                        <span className="truncate text-gray-300">
                                                                                            {edit.action.toUpperCase()} · {edit.fileName}
                                                                                        </span>
                                                                                        <div className="flex items-center gap-1">
                                                                                            <button
                                                                                                onClick={() => loadEditDiffPreview(edit, editKey)}
                                                                                                className="px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/40"
                                                                                            >
                                                                                                Preview
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => copyEditCode(edit.content)}
                                                                                                className="px-2 py-0.5 rounded bg-zinc-700/40 text-gray-200 hover:bg-zinc-700/70"
                                                                                            >
                                                                                                Copy
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={async () => {
                                                                                                    const record = await applyManualEdit(edit);
                                                                                                    if (record) {
                                                                                                        setAiHistory((prev) => [{
                                                                                                            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                                                                                                            timestamp: new Date().toISOString(),
                                                                                                            prompt: "Manual apply from AI chat",
                                                                                                            edits: [edit],
                                                                                                            records: [record],
                                                                                                        }, ...prev].slice(0, 20));
                                                                                                    }
                                                                                                }}
                                                                                                disabled={aiApplyMode === "auto" || myRole === "viewer"}
                                                                                                className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 disabled:opacity-40"
                                                                                            >
                                                                                                Apply
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                    {preview?.loaded && (
                                                                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                                                                            <div>
                                                                                                <div className="text-[10px] text-gray-400 mb-1">Current</div>
                                                                                                <pre className="max-h-36 overflow-auto rounded bg-[#111] border border-[#2a2a2a] p-2 text-[10px] text-gray-200 whitespace-pre-wrap break-words">
                                                                                                    <code>{preview.before}</code>
                                                                                                </pre>
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className="text-[10px] text-gray-400 mb-1">Proposed</div>
                                                                                                <pre className="max-h-36 overflow-auto rounded bg-[#111] border border-[#2a2a2a] p-2 text-[10px] text-gray-200 whitespace-pre-wrap break-words">
                                                                                                    <code>{preview.after}</code>
                                                                                                </pre>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    <pre className="mt-2 max-h-44 overflow-auto rounded bg-[#111] border border-[#2a2a2a] p-2 text-[10px] text-gray-200 whitespace-pre-wrap break-words">
                                                                                        <code>{edit.content}</code>
                                                                                    </pre>
                                                                                </div>
                                                                            )})}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {!!m.appliedEdits?.length && (
                                                                    <div className="mt-2 text-[10px] text-green-400">
                                                                        Auto-applied: {m.appliedEdits.map((e) => e.fileName).join(", ")}
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="whitespace-pre-wrap">{m.content}</div>
                                                        )}
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
                                        Context: {activeFile ? activeFile.name : "None"} · {aiScope === "project_files" ? "Project-wide" : "Single file"} · {aiApplyMode === "auto" ? "Auto-apply ON" : "Manual apply"}
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </aside>

            </div>
            {showInviteModal && (
                <InviteModal
                    projectId={projectId}
                    currentUserId={user._id}
                    onClose={() => setShowInviteModal(false)}
                    roomCode={project?.roomCode}
                />
            )}
        </div>
    );
}
