"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

function JoinContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefilledCode = searchParams.get("code") || "";

    const [code, setCode] = useState(prefilledCode);
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push(`/login?redirect=/join${prefilledCode ? `?code=${prefilledCode}` : ""}`);
        }
    }, [loading, user, router, prefilledCode]);

    const handleJoin = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!code.trim()) return;

        setIsJoining(true);
        setError("");
        setSuccess("");

        try {
            const { data } = await API.post("/projects/join-by-code", { code: code.trim() });

            if (data.alreadyMember) {
                setSuccess(`You're already a member of "${data.projectName}"! Redirecting...`);
            } else {
                setSuccess(`Successfully joined "${data.projectName}"! Redirecting...`);
            }

            setTimeout(() => {
                router.push(`/projects/${data.projectId}`);
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || "Invalid room code. Please try again.");
        } finally {
            setIsJoining(false);
        }
    }, [code, router]);

    // Auto-join if code is prefilled and user is logged in
    useEffect(() => {
        if (prefilledCode && user && !isJoining) {
            handleJoin();
        }
    }, [prefilledCode, user, isJoining, handleJoin]);

    const handleCodeInput = (value: string) => {
        // Only allow alphanumeric, auto uppercase, max 6 chars
        const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
        setCode(cleaned);
        setError("");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A23] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A23] text-white font-mono flex flex-col relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Nav */}
            <nav className="p-6 flex justify-between items-center z-10">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-[#0A0A23] font-bold text-xs">&lt;/&gt;</div>
                    <span className="font-medium tracking-tight">TechConnect</span>
                </Link>
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                    ← Dashboard
                </Link>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 z-10">
                <div className="w-full max-w-md">
                    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                                🤝
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Join a Project</h1>
                            <p className="text-sm text-gray-400">Enter the 6-character room code shared by your friend.</p>
                        </div>

                        <form onSubmit={handleJoin} className="space-y-6">
                            {/* Code Input — Large Character Boxes */}
                            <div className="flex justify-center">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => handleCodeInput(e.target.value)}
                                    placeholder="XXXXXX"
                                    maxLength={6}
                                    className="w-full text-center text-3xl font-mono font-black tracking-[0.4em] bg-[#0d1117] border-2 border-[#30363d] rounded-xl px-4 py-5 text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 transition-colors uppercase"
                                    autoFocus
                                />
                            </div>

                            <div className="text-center text-xs text-gray-500">
                                {code.length}/6 characters
                            </div>

                            {error && (
                                <div className="text-sm text-center p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="text-sm text-center p-3 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={code.length !== 6 || isJoining}
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isJoining ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⏳</span> Joining...
                                    </span>
                                ) : (
                                    "Join Project"
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-[#30363d] text-center text-xs text-gray-500">
                            Don&apos;t have a code?{" "}
                            <Link href="/dashboard" className="text-blue-400 hover:underline">
                                Create your own project
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function JoinPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A0A23] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        }>
            <JoinContent />
        </Suspense>
    );
}
