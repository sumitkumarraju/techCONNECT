import React, { useState } from 'react';
import API from "@/lib/api";

interface InviteModalProps {
    projectId: string;
    onClose: () => void;
    currentUserId: string;
}

export default function InviteModal({ projectId, onClose, currentUserId }: InviteModalProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1e1e1e] border border-[#333] p-6 rounded-xl w-96 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Invite Team Member</h2>

                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">User Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-[#2d2d2d] border border-[#444] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Role</label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className={`cursor-pointer border border-[#444] rounded p-2 flex items-center gap-2 ${role === 'editor' ? 'bg-blue-600/20 border-blue-500' : 'bg-[#2d2d2d]'}`}>
                                <input type="radio" name="role" value="editor" checked={role === 'editor'} onChange={() => setRole('editor')} className="hidden" />
                                <div>
                                    <div className={`text-sm font-bold ${role === 'editor' ? 'text-blue-400' : 'text-gray-300'}`}>Editor</div>
                                    <div className="text-[10px] text-gray-500">Can edit code & run</div>
                                </div>
                            </label>
                            <label className={`cursor-pointer border border-[#444] rounded p-2 flex items-center gap-2 ${role === 'viewer' ? 'bg-blue-600/20 border-blue-500' : 'bg-[#2d2d2d]'}`}>
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
                        <button type="button" onClick={onClose} className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-white bg-[#2d2d2d] rounded">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50">
                            {isLoading ? "Sending..." : "Send Invite"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
