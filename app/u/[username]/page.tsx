"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import API from "@/lib/api";
import Link from 'next/link';

export default function PublicProfilePage() {
    const { username } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (username) {
            setIsLoading(true);
            API.get(`/public-profile/${username}`)
                .then(res => {
                    setProfile(res.data.user);
                    setProjects(res.data.projects);
                })
                .catch(err => {
                    setError("User not found");
                })
                .finally(() => setIsLoading(false));
        }
    }, [username]);

    if (isLoading) return <div className="p-10 text-white text-center">Loading profile...</div>;
    if (error || !profile) return <div className="p-10 text-red-500 text-center">{error || "User not found"}</div>;

    return (
        <div className="min-h-screen bg-jules-bg text-jules-text font-sans overflow-y-auto">
            <div className="h-48 bg-gradient-to-r from-gray-900 to-blue-900 opacity-50"></div>

            <div className="max-w-5xl mx-auto px-6 -mt-16 pb-20 animate-slide-up">
                {/* Header */}
                <div className="flex items-end gap-6 mb-10">
                    <div className="w-32 h-32 rounded-full bg-black p-1">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-gray-500 to-blue-500 flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden">
                            {profile.avatar ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                profile.username.substring(0, 2).toUpperCase()
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-white mb-1">{profile.username}</h1>
                        <p className="text-jules-muted mb-2">{profile.name}</p>
                        <div className="flex gap-4">
                            {profile.githubUrl && <a href={profile.githubUrl} target="_blank" className="text-xs text-blue-400 hover:underline">GitHub</a>}
                            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" className="text-xs text-blue-400 hover:underline">LinkedIn</a>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Stats/Skills */}
                    <div className="space-y-6">
                        <div className="bg-jules-surface border border-jules-border rounded-2xl p-5">
                            <h3 className="text-sm font-bold uppercase text-jules-muted mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills?.length > 0 ? profile.skills.map((skill: string) => (
                                    <span key={skill} className="text-xs bg-[#2a2a2a] px-3 py-1 rounded-full text-white">{skill}</span>
                                )) : <span className="text-xs text-gray-500">No skills listed</span>}
                            </div>
                        </div>
                    </div>

                    {/* Right: Bio & Projects */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-jules-surface border border-jules-border rounded-2xl p-6">
                            <h3 className="text-sm font-bold uppercase text-jules-muted mb-4">About</h3>
                            <p className="text-sm leading-relaxed text-jules-text whitespace-pre-wrap">
                                {profile.bio || "This user hasn't written a bio yet."}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Public Projects</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {projects.map(project => (
                                    <Link href={`/projects/${project._id}`} key={project._id} className="block group">
                                        <div className="bg-jules-surface border border-jules-border rounded-xl p-5 hover:border-blue-500/50 transition-all h-full">
                                            <h4 className="font-bold text-white mb-2 group-hover:text-blue-400">{project.name}</h4>
                                            <p className="text-xs text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {project.techStack?.slice(0, 3).map((t: string) => (
                                                    <span key={t} className="text-[10px] bg-[#111] px-2 py-0.5 rounded text-gray-500">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {projects.length === 0 && (
                                    <div className="col-span-full text-center py-8 bg-jules-surface border border-jules-border rounded-xl text-gray-500 text-sm">
                                        No public projects showcased.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
