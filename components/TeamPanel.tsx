"use client";

import React, { useState } from 'react';
import API from "@/lib/api";

interface Member {
    userId: string;
    name: string;
    username: string;
    email?: string;
    avatar?: string;
    role: 'owner' | 'editor' | 'viewer';
    joinedAt?: string;
}

interface TeamPanelProps {
    projectId: string;
    owner: Member | null;
    members: Member[];
    currentUserId: string;
    currentUserRole: 'owner' | 'editor' | 'viewer';
    onlineUsers: { _id: string }[];
    onMembersChange: () => void;
    onInviteClick: () => void;
}

const roleColors: Record<string, string> = {
    owner: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    editor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    viewer: 'text-gray-400 bg-gray-400/10 border-gray-400/20'
};

export default function TeamPanel({
    projectId,
    owner,
    members,
    currentUserId,
    currentUserRole,
    onlineUsers,
    onMembersChange,
    onInviteClick
}: TeamPanelProps) {
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const isOnline = (userId: string) => {
        return onlineUsers.some((u: { _id: string }) => u._id === userId);
    };

    const handleRoleChange = async (memberId: string, newRole: 'editor' | 'viewer') => {
        setIsUpdating(memberId);
        try {
            await API.put(`/projects/${projectId}/members`, {
                memberId,
                newRole
            });
            onMembersChange();
        } catch (error) {
            console.error("Failed to update role", error);
            alert("Failed to update role");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveMember = async (memberId: string, memberName: string) => {
        if (!confirm(`Remove ${memberName} from this project?`)) return;

        try {
            await API.delete(`/projects/${projectId}/members?memberId=${memberId}`);
            onMembersChange();
        } catch (error) {
            console.error("Failed to remove member", error);
            alert("Failed to remove member");
        }
    };

    const handleLeaveProject = async () => {
        if (!confirm("Are you sure you want to leave this project?")) return;

        try {
            await API.delete(`/projects/${projectId}/members?memberId=${currentUserId}`);
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Failed to leave project", error);
            alert("Failed to leave project");
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#2b2b2b] flex items-center justify-between">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Team Members
                </div>
                {currentUserRole !== 'viewer' && (
                    <button
                        onClick={onInviteClick}
                        className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        + Invite
                    </button>
                )}
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {/* Owner */}
                {owner && (
                    <div className="p-2 rounded bg-[#2a2d2e] border border-[#333]">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                                    {owner.name?.slice(0, 2).toUpperCase() || 'OW'}
                                </div>
                                {isOnline(owner.userId) && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2d2e]"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-white truncate flex items-center gap-1">
                                    {owner.name}
                                    {owner.userId === currentUserId && (
                                        <span className="text-[9px] text-gray-500">(You)</span>
                                    )}
                                </div>
                                <div className="text-[10px] text-gray-500">@{owner.username}</div>
                            </div>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${roleColors.owner}`}>
                                Owner
                            </span>
                        </div>
                    </div>
                )}

                {/* Members */}
                {members.map((member) => (
                    <div key={member.userId} className="p-2 rounded bg-[#252526] border border-[#333] hover:border-[#444] transition-colors group">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-gray-600/20 flex items-center justify-center text-gray-400 font-bold text-xs">
                                    {member.name?.slice(0, 2).toUpperCase() || 'MB'}
                                </div>
                                {isOnline(member.userId) && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#252526]"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-200 truncate flex items-center gap-1">
                                    {member.name}
                                    {member.userId === currentUserId && (
                                        <span className="text-[9px] text-gray-500">(You)</span>
                                    )}
                                </div>
                                <div className="text-[10px] text-gray-500">@{member.username}</div>
                            </div>

                            {/* Role Badge / Selector */}
                            {currentUserRole === 'owner' && member.userId !== currentUserId ? (
                                <select
                                    value={member.role}
                                    onChange={(e) => handleRoleChange(member.userId, e.target.value as 'editor' | 'viewer')}
                                    disabled={isUpdating === member.userId}
                                    className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border bg-transparent cursor-pointer focus:outline-none disabled:opacity-50"
                                    style={{
                                        color: member.role === 'editor' ? '#60a5fa' : '#9ca3af',
                                        borderColor: member.role === 'editor' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                                        backgroundColor: member.role === 'editor' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(156, 163, 175, 0.1)'
                                    }}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            ) : (
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${roleColors[member.role]}`}>
                                    {member.role}
                                </span>
                            )}

                            {/* Remove Button (Owner only) */}
                            {currentUserRole === 'owner' && member.userId !== currentUserId && (
                                <button
                                    onClick={() => handleRemoveMember(member.userId, member.name)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all text-sm"
                                    title="Remove member"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {members.length === 0 && (
                    <div className="text-center py-6 text-gray-500 text-xs">
                        <p>No team members yet</p>
                        {currentUserRole !== 'viewer' && (
                            <button
                                onClick={onInviteClick}
                                className="mt-2 text-blue-400 hover:underline"
                            >
                                Invite someone
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Footer - Leave Project (for non-owners) */}
            {currentUserRole !== 'owner' && (
                <div className="px-3 py-2 border-t border-[#2b2b2b]">
                    <button
                        onClick={handleLeaveProject}
                        className="w-full py-1.5 text-[10px] font-bold text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    >
                        Leave Project
                    </button>
                </div>
            )}
        </div>
    );
}
