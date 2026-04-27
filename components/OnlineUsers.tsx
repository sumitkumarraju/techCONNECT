import React from "react";

export default function OnlineUsers({ users }: { users: any[] }) {
    const count = users.length;
    const statusText = count === 0
        ? "No one in room"
        : count === 1
            ? "1 person in room"
            : `${count} people in room`;

    return (
        <div className="flex items-center gap-2 mr-4 bg-[#1e1e1e] px-3 py-1.5 rounded-lg border border-zinc-800">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider mr-2">Online:</span>
            <div className="flex -space-x-2">
                {users.map((u, i) => (
                    <div
                        key={i}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#0A0A23] relative group cursor-pointer"
                        style={{ background: u.color || '#6366f1' }}
                        title={u.name}
                    >
                        {u.name?.[0]?.toUpperCase()}

                        {/* Tooltip */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {u.name}
                        </div>
                    </div>
                ))}
            </div>
            <span className={`text-xs ${count > 0 ? "text-emerald-400" : "text-zinc-600 italic"}`}>
                {statusText}
            </span>
        </div>
    );
}
