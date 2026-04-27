import React, { useState, useEffect } from 'react';
import API from "@/lib/api";

interface InviteModalProps {
    projectId: string;
    onClose: () => void;
    currentUserId: string;
    roomCode?: string;
}

export default function InviteModal({ projectId, onClose, currentUserId, roomCode: initialRoomCode }: InviteModalProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("editor");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"code" | "email">("code");
    const [roomCode, setRoomCode] = useState(initialRoomCode || "");
    const [copied, setCopied] = useState(false);

    // Fetch room code if not provided
    useEffect(() => {
        if (!roomCode) {
            API.get(`/projects/${projectId}`).then(({ data }) => {
                setRoomCode(data.roomCode || "");
            }).catch(() => {});
        }
    }, [projectId, roomCode]);

    const handleCopyCode = async () => {
        if (!roomCode) return;
        try {
            await navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const input = document.createElement('input');
            input.value = roomCode;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCopyLink = async () => {
        const link = `${window.location.origin}/join?code=${roomCode}`;
        try {
            await navigator.clipboard.writeText(link);
            setMessage("Link copied!");
            setTimeout(() => setMessage(""), 2000);
        } catch {
            setMessage("Failed to copy");
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            await API.post(`/projects/${projectId}/invite`, {
                email,
                role,
                requestedBy: currentUserId
            });
            setMessage("User invited successfully!");
            setTimeout(onClose, 1500);
        } catch (error: any) {
            setMessage(error.response?.data?.error || "Failed to invite");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e1e1e] border border-[#333] p-6 rounded-2xl w-[440px] shadow-2xl animate-slide-up">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-white">Invite Friends</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-lg">✕</button>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-[#2d2d2d] rounded-lg p-1 mb-5">
                    <button
                        onClick={() => setActiveTab("code")}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === "code" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        🔑 Room Code
                    </button>
                    <button
                        onClick={() => setActiveTab("email")}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === "email" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        ✉️ Email Invite
                    </button>
                </div>

                {/* ROOM CODE TAB */}
                {activeTab === "code" && (
                    <div className="space-y-4">
                        <p className="text-xs text-gray-400">Share this code with your friends. They can join from the dashboard or the join page.</p>

                        {/* Room Code Display */}
                        <div className="bg-[#0d1117] border-2 border-dashed border-blue-500/40 rounded-xl p-6 text-center">
                            {roomCode ? (
                                <>
                                    <div className="text-3xl font-mono font-black tracking-[0.5em] text-white mb-2 select-all">
                                        {roomCode}
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Room Code</p>
                                </>
                            ) : (
                                <div className="text-sm text-gray-500 animate-pulse">Loading code...</div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleCopyCode}
                                className={`py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${copied ? "bg-green-600 text-white" : "bg-[#2d2d2d] text-gray-300 hover:bg-[#3d3d3d] border border-[#444]"}`}
                            >
                                {copied ? (
                                    <><span>✓</span> Copied!</>
                                ) : (
                                    <><span>📋</span> Copy Code</>
                                )}
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className="py-2.5 text-xs font-bold rounded-lg bg-[#2d2d2d] text-gray-300 hover:bg-[#3d3d3d] border border-[#444] transition-all flex items-center justify-center gap-1.5"
                            >
                                <span>🔗</span> Copy Link
                            </button>
                        </div>

                        {message && (
                            <div className="text-xs text-center p-2 rounded bg-green-500/10 text-green-400">
                                {message}
                            </div>
                        )}
                    </div>
                )}

                {/* EMAIL INVITE TAB */}
                {activeTab === "email" && (
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">User Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-[#2d2d2d] border border-[#444] rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                placeholder="friend@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">Role</label>
                            <div className="grid grid-cols-2 gap-2">
                                <label className={`cursor-pointer border rounded-lg p-3 flex items-center gap-2 transition-all ${role === 'editor' ? 'bg-blue-600/20 border-blue-500' : 'bg-[#2d2d2d] border-[#444] hover:border-[#666]'}`}>
                                    <input type="radio" name="role" value="editor" checked={role === 'editor'} onChange={() => setRole('editor')} className="hidden" />
                                    <div>
                                        <div className={`text-sm font-bold ${role === 'editor' ? 'text-blue-400' : 'text-gray-300'}`}>Editor</div>
                                        <div className="text-[10px] text-gray-500">Can edit code & run</div>
                                    </div>
                                </label>
                                <label className={`cursor-pointer border rounded-lg p-3 flex items-center gap-2 transition-all ${role === 'viewer' ? 'bg-blue-600/20 border-blue-500' : 'bg-[#2d2d2d] border-[#444] hover:border-[#666]'}`}>
                                    <input type="radio" name="role" value="viewer" checked={role === 'viewer'} onChange={() => setRole('viewer')} className="hidden" />
                                    <div>
                                        <div className={`text-sm font-bold ${role === 'viewer' ? 'text-blue-400' : 'text-gray-300'}`}>Viewer</div>
                                        <div className="text-[10px] text-gray-500">Read-only access</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {message && (
                            <div className={`text-xs text-center p-2 rounded ${message.includes("success") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                {message}
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-xs font-bold text-gray-400 hover:text-white bg-[#2d2d2d] rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading} className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 transition-colors">
                                {isLoading ? "Sending..." : "Send Invite"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
