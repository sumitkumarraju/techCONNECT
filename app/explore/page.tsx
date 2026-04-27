"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Explore() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = (query = "") => {
        setLoading(true);
        const url = query ? `/explore/projects?search=${query}` : "/explore/projects";
        API.get(url)
            .then(res => setProjects(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProjects(search);
    };

    return (
        <div className="min-h-screen bg-[#0A0A23] text-jules-primary font-mono antialiased relative overflow-hidden">
            {/* Decorative Assets */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto p-8 relative z-10">

                {/* Header */}
                <header className="flex justify-between items-center mb-12 border-b border-jules-border/30 pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-lg rounded-none group-hover:bg-jules-accent transition-colors">&lt;/&gt;</div>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Explore Projects</h1>
                            <p className="text-sm text-jules-primary/60">Discover what the community is building.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/dashboard" className="px-5 py-2.5 rounded-none font-bold text-sm bg-jules-surface border border-jules-border hover:bg-jules-border/50 transition-all shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-0.5">
                            Dashboard
                        </Link>
                    </div>
                </header>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-12 max-w-2xl mx-auto flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects..."
                            className="w-full bg-[#0E0E1E] border border-jules-border/50 rounded-none px-6 py-4 text-white focus:outline-none focus:border-jules-accent placeholder-jules-primary/30 font-bold"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-jules-primary/30 text-xl">🔍</div>
                    </div>
                    <button className="bg-jules-accent text-jules-bg px-8 py-4 font-bold shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-1 transition-all border-2 border-transparent hover:border-jules-primary/20">
                        Search
                    </button>
                </form>

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-20 text-jules-primary/50 animate-pulse">Loading projects...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-jules-primary/50">
                                No projects found. Try a different search!
                            </div>
                        ) : (
                            projects.map((p: any) => (
                                <div key={p._id} className="bg-jules-surface/50 border border-jules-border hover:border-jules-accent p-6 flex flex-col group relative transition-all hover:bg-[#120129] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#2A0A55]">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold group-hover:text-jules-accent transition-colors truncate pr-4">{p.name}</h3>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                            {p.ownerId?.username?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    </div>

                                    <p className="text-sm text-jules-primary/70 line-clamp-3 mb-6 h-14">{p.description || "No description provided."}</p>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {p.techStack && p.techStack.length > 0 ? (
                                                p.techStack.map((tech: string) => (
                                                    <span key={tech} className="text-[10px] font-bold uppercase bg-[#0A0A23] border border-jules-border/50 px-2 py-1 text-jules-primary/60">
                                                        {tech}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] italic text-jules-primary/30">No tags</span>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-jules-border/30 flex justify-between items-center text-xs">
                                            <span className="text-jules-primary/40">by <strong className="text-jules-primary/70">{p.ownerId?.username || 'Unknown'}</strong></span>
                                            <Link href={`/projects/${p._id}`} className="font-bold text-jules-accent hover:underline">
                                                View Code &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
