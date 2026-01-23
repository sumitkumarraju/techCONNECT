"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Link from "next/link";

export default function Explore() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = (query = "") => {
        const url = query ? `/explore/projects?search=${query}` : "/explore/projects";
        API.get(url).then(res => setProjects(res.data));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProjects(search);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Explore Projects
                </h1>
                <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    &larr; Back to Dashboard
                </Link>
            </header>

            <div className="max-w-6xl mx-auto">
                <form onSubmit={handleSearch} className="mb-10 flex gap-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects by name..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button className="bg-purple-600 hover:bg-purple-500 px-8 rounded-xl font-bold transition-colors">
                        Search
                    </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projects.map((p: any) => (
                        <div key={p._id} className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">{p.name}</h3>
                                </div>
                                <p className="text-zinc-400 text-sm mb-6 line-clamp-3">{p.description}</p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {p.techStack.map((tech: string) => (
                                        <span key={tech} className="text-[10px] uppercase bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-zinc-900/50 p-4 border-t border-zinc-800 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                                    <span className="text-xs text-zinc-400">by {p.ownerId?.username || 'Unknown'}</span>
                                </div>
                                <button className="text-xs font-bold text-purple-400 hover:text-purple-300">View Project &rarr;</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
