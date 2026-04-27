"use client";

import Link from "next/link";
// import React from "react"; // Not strictly needed in Next 14 app dir if using JSX transform, but good for safety
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="h-screen w-full bg-[#0A0A23] flex items-center justify-center text-white relative overflow-hidden font-mono">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="z-10 text-center space-y-6">
                <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-gray-300">Page Not Found</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                    The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="pt-4">
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors border border-blue-400/50 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
