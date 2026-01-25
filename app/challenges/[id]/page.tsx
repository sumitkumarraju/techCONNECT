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


    if (!challenge) return <div className="h-screen bg-[#1e1e1e] flex items-center justify-center text-gray-500">Loading Problem...</div>;

    return (
        <div className="h-screen bg-[#1e1e1e] text-gray-300 font-mono flex flex-col">

            {/* Header */}
            <header className="h-12 border-b border-[#2b2b2b] bg-[#252526] flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href="/challenges" className="text-gray-500 hover:text-white transition-colors">← Back</Link>
                    <h1 className="font-bold text-sm text-white">{challenge.title}</h1>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-gray-600 text-gray-400 uppercase">{challenge.difficulty}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isRunning}
                        className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${isRunning ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-[0_0_15px_-5px_#22c55e]'}`}
                    >
                        {isRunning ? "Running Tests..." : "Run & Submit"}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">

                {/* 👈 Problem Description */}
                <div className="w-1/3 border-r border-[#2b2b2b] bg-[#1e1e1e] flex flex-col">
                    <div className="p-6 overflow-y-auto flex-1 prose prose-invert prose-sm max-w-none">
                        <h2 className="text-xl font-bold text-white mb-4">{challenge.title}</h2>
                        <p>{challenge.description}</p>

                        <div className="mt-8">
                            <h3 className="font-bold text-white mb-2">Example 1</h3>
                            <div className="bg-[#2d2d2d] p-3 rounded-lg text-xs font-mono">
                                <div className="mb-1"><span className="text-gray-500">Input:</span> {challenge.testCases?.[0]?.input || "N/A"}</div>
                                <div><span className="text-gray-500">Output:</span> {challenge.testCases?.[0]?.output || "N/A"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🧠 Code Editor */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    <CodeEditor
                        ref={editorRef}
                        file={{ name: "solution.js", language: "javascript", content: code }}
                        onCodeChange={setCode}
                    />
                </div>

                {/* 👉 Output Panel */}
                <div className="w-1/4 border-l border-[#2b2b2b] bg-[#252526] flex flex-col">
                    <div className="p-3 border-b border-[#2b2b2b] font-bold text-xs uppercase text-gray-500">Test Results</div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {!result && <div className="text-xs text-gray-600 italic">Run your code to see results.</div>}

                        {result && (
                            <div className={`rounded-lg p-4 border ${result.status === "accepted" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                                <h3 className={`font-bold mb-2 flex items-center gap-2 ${result.status === "accepted" ? "text-green-400" : "text-red-400"}`}>
                                    {result.status === "accepted" ? "✅ Passed" : "❌ Failed"}
                                </h3>
                                <pre className="text-xs whitespace-pre-wrap text-gray-300 font-mono">
                                    {result.output}
                                </pre>
                            </div>
                        )}

                        {result?.status === 'accepted' && (
                            <div className="mt-4 text-center animate-bounce">
                                <span className="text-4xl">🎉</span>
                                <div className="text-sm font-bold text-purple-400 mt-2">+{challenge.points} XP Earned!</div>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
