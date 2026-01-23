"use client";

import React from "react";

export default function OnlineUsers({ users }: { users: any[] }) {
    // deduplicate users by _id or username if needed, though simpler is just to map
    const uniqueUsers = Array.from(new Set(users.map(u => u.username || u.name)))
        .map(username => {
            return users.find(u => (u.username || u.name) === username);
        });

    if (uniqueUsers.length === 0) return null;

    return (
        <div className="flex items-center gap-2 text-sm text-zinc-400 bg-[#18181b] px-3 py-1.5 rounded-full border border-zinc-800">
            <div className="flex -space-x-2">
                {uniqueUsers.map((u, i) => (
                    <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-[#18181b] flex items-center justify-center text-[10px] text-white font-bold uppercase"
                        title={u.username}
                    >
                        {u.username?.charAt(0)}
                    </div>
                ))}
            </div>
            <span className="text-xs">{uniqueUsers.length} online</span>
        </div>
    );
}
