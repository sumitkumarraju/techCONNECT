"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error Caught:", error);
    }, [error]);

    return (
        <div className="h-screen w-full bg-[#0A0A23] flex items-center justify-center text-white font-mono p-4">
            <div className="max-w-md w-full bg-[#1e1e1e] border border-red-500/30 rounded-xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong!</h2>
                <div className="bg-black/30 p-4 rounded text-xs text-gray-400 mb-6 font-mono break-words border border-white/5">
                    {error.message || "Unknown error occurred"}
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => reset()}
                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded transition-colors"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/dashboard"
                        className="flex-1 px-4 py-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white font-bold rounded transition-colors text-center border border-white/10"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
