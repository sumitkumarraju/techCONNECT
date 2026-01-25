"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import CodeEditor, { CodeEditorHandle } from "@/components/CodeEditor";

export default function ChallengeSolverPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const [challenge, setChallenge] = useState<any>(null);
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const editorRef = useRef<CodeEditorHandle>(null);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const { data } = await API.get(`/challenges/${id}`);
                setChallenge(data);
                setCode(data.starterCode || "// Write your solution here\n\nfunction solution(input) {\n    return input;\n}");
            } catch (err) {
                console.error("Failed to load challenge", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChallenge();
    }, [id]);

    const { user } = useAuth();

    const handleSubmit = async () => {
        if (!user) return alert("Please log in");

        setIsRunning(true);
        setResult(null);

        try {
            const { data } = await API.post("/challenges/submit", {
                challengeId: id,
                code,
                language: "javascript",
                userId: user._id
            });
            setResult(data);
        } catch (error: any) {
            console.error("Submission failed", error);
            setResult({ status: "error", output: `Error: ${error.response?.data?.error || "Unknown Error"}` });
        } finally {
            setIsRunning(false);
        }
    };


    if (!challenge) {
        if (isLoading) return <div className="h-screen bg-jules-bg flex items-center justify-center text-jules-accent font-mono animate-pulse">Initializing Environment...</div>;
        return <div className="h-screen bg-jules-bg flex items-center justify-center text-red-500">Problem not found.</div>;
    }

    return (
        <div className="h-screen bg-jules-bg text-jules-primary font-sans flex flex-col overflow-hidden selection:bg-purple-500/30">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none bg-hero-glow z-0 opacity-50"></div>

            {/* Header */}
            <header className="h-14 border-b border-jules-border bg-jules-surface/80 backdrop-blur flex items-center justify-between px-4 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/challenges" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
                        <span>←</span> Back
                    </Link>
                    <div className="h-6 w-px bg-jules-border/50"></div>
                    <h1 className="font-bold text-sm text-white tracking-wide">{challenge.title}</h1>
                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${challenge.difficulty === 'easy' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                        challenge.difficulty === 'medium' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                            'text-red-400 border-red-500/30 bg-red-500/10'
                        }`}>{challenge.difficulty}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isRunning}
                        className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isRunning
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.6)] hover:scale-105'
                            }`}
                    >
                        {isRunning ? (
                            <>
                                <span className="animate-spin">⚡</span> Running...
                            </>
                        ) : (
                            <>
                                <span>▶</span> Run Code
                            </>
                        )}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden z-10">

                {/* 👈 Problem Description */}
                <div className="w-1/3 border-r border-jules-border bg-jules-bg/50 backdrop-blur-sm flex flex-col">
                    <div className="p-6 overflow-y-auto flex-1 prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-jules-accent">
                        <h2 className="text-xl font-bold text-white mb-4">{challenge.title}</h2>
                        <p>{challenge.description}</p>

                        <div className="mt-8">
                            <h3 className="font-bold text-white mb-2 text-xs uppercase tracking-widest text-jules-muted">Example Case</h3>
                            <div className="bg-black/40 border border-jules-border p-4 rounded-lg text-xs font-mono shadow-inner">
                                <div className="mb-2"><span className="text-purple-400">Input:</span> <span className="text-green-300">{challenge.testCases?.[0]?.input || "N/A"}</span></div>
                                <div><span className="text-purple-400">Output:</span> <span className="text-green-300">{challenge.testCases?.[0]?.output || "N/A"}</span></div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-2">
                            {challenge.tags?.map((t: string) => (
                                <span key={t} className="text-[10px] bg-jules-surface border border-jules-border px-2 py-1 rounded text-gray-400">#{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 🧠 Code Editor */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
                    <div className="absolute inset-0">
                        <CodeEditor
                            ref={editorRef}
                            file={{ name: "solution.js", language: "javascript", content: code }}
                            onCodeChange={setCode}
                        />
                    </div>
                </div>

                {/* 👉 Output Panel */}
                <div className="w-1/4 border-l border-jules-border bg-jules-surface/30 backdrop-blur-md flex flex-col">
                    <div className="p-3 border-b border-jules-border font-bold text-[10px] uppercase text-jules-muted tracking-widest bg-black/20">
                        Console / Test Results
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {!result && <div className="text-xs text-gray-500 italic text-center mt-10 opacity-50">Ready to execute...</div>}

                        {result && (
                            <div className={`rounded-xl p-4 border shadow-lg animation-fade-in ${result.status === "accepted"
                                ? "bg-green-500/10 border-green-500/30 shadow-[0_0_20px_-5px_rgba(34,197,94,0.2)]"
                                : "bg-red-500/10 border-red-500/30 shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]"
                                }`}>
                                <h3 className={`font-bold mb-2 flex items-center gap-2 ${result.status === "accepted" ? "text-green-400" : "text-red-400"}`}>
                                    {result.status === "accepted" ? "✅ Success" : "❌ Failed"}
                                </h3>
                                <pre className="text-xs whitespace-pre-wrap text-gray-300 font-mono bg-black/30 p-2 rounded border border-white/5">
                                    {result.output}
                                </pre>
                            </div>
                        )}

                        {result?.status === 'accepted' && (
                            <div className="mt-6 text-center animate-bounce">
                                <span className="text-5xl drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">🎉</span>
                                <div className="text-sm font-bold text-jules-accent mt-3">+{challenge.points} XP Earned!</div>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
