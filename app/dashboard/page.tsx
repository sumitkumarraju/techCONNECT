"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  description: string;
  owner: { username: string };
}

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        setShowModal(false);
        setNewProject({ title: '', description: '' });
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <div className="p-8 text-white">Loading or Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-jules-bg text-jules-text font-sans flex flex-col overflow-hidden">
      <nav className="border-b border-jules-border bg-jules-bg z-40 shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-5 h-5 rounded bg-jules-text text-jules-bg flex items-center justify-center font-mono font-bold text-[10px]">&lt;/&gt;</div>
                    <span className="font-medium tracking-tight">TechConnect</span>
                </div>

                <div className="hidden md:flex items-center gap-1 bg-jules-surface/50 p-1 rounded-full border border-jules-border/50">
                    <Link href="/dashboard" className="nav-btn px-4 py-1.5 rounded-full text-xs font-medium text-jules-text bg-jules-surface transition-all">Dashboard</Link>
                    <Link href="/challenges" className="nav-btn px-4 py-1.5 rounded-full text-xs font-medium text-jules-muted hover:text-jules-text hover:bg-jules-surface transition-all">Challenges</Link>
                    <Link href="/community" className="nav-btn px-4 py-1.5 rounded-full text-xs font-medium text-jules-muted hover:text-jules-text hover:bg-jules-surface transition-all">Community</Link>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link href="/profile" className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 cursor-pointer flex items-center justify-center font-bold text-white text-xs">
                    {user.username.substring(0, 2).toUpperCase()}
                </Link>
                <button onClick={logout} className="text-xs text-jules-muted hover:text-white">Log Out</button>
            </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-10 animate-slide-up">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold mb-2">Good afternoon, {user.username}.</h1>
                        <p className="text-jules-muted">You have 2 pending code reviews and 1 active challenge.</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="bg-jules-primary text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white transition-all flex items-center gap-2">
                        <span>+</span> New Project
                    </button>
                </div>

                <div className="bg-jules-surface border border-jules-border rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-medium">Coding Activity</h3>
                        <div className="text-xs text-jules-muted">Last 7 Days</div>
                    </div>
                    <div className="flex items-end justify-between h-24 gap-2">
                        <div className="w-full bg-[#252525] rounded-t-sm h-[30%] hover:bg-jules-accent/50 transition-colors"></div>
                        <div className="w-full bg-[#252525] rounded-t-sm h-[60%] hover:bg-jules-accent/50 transition-colors"></div>
                        <div className="w-full bg-jules-accent/20 rounded-t-sm h-[40%] hover:bg-jules-accent/50 transition-colors"></div>
                        <div className="w-full bg-jules-accent rounded-t-sm h-[85%] shadow-[0_0_10px_rgba(168,199,250,0.3)]"></div>
                        <div className="w-full bg-[#252525] rounded-t-sm h-[50%] hover:bg-jules-accent/50 transition-colors"></div>
                        <div className="w-full bg-[#252525] rounded-t-sm h-[20%] hover:bg-jules-accent/50 transition-colors"></div>
                        <div className="w-full bg-[#252525] rounded-t-sm h-[45%] hover:bg-jules-accent/50 transition-colors"></div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-medium mb-4">Recent Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {projects.map((project) => (
                           <Link href={`/projects/${project._id}`} key={project._id} className="group bg-jules-surface border border-jules-border rounded-2xl p-5 hover:bg-jules-surfaceHover transition-all cursor-pointer block">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono text-xs">JS</div>
                                  <span className="text-[10px] border border-jules-border px-2 py-0.5 rounded-full text-jules-muted">Private</span>
                              </div>
                              <h3 className="font-medium mb-1 group-hover:text-jules-accent transition-colors">{project.title}</h3>
                              <p className="text-xs text-jules-muted mb-4 line-clamp-2">{project.description}</p>
                              <div className="flex items-center -space-x-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-600 border border-[#1c1c1c]"></div>
                              </div>
                           </Link>
                        ))}

                         <div onClick={() => setShowModal(true)} className="border border-dashed border-jules-border rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-jules-muted transition-colors cursor-pointer min-h-[200px]">
                            <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center mb-2 text-jules-muted">+</div>
                            <p className="text-sm font-medium">Create New</p>
                        </div>
                    </div>
                </div>
            </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-jules-surface border border-jules-border rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Create New Project</h3>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="bg-[#252525] border border-jules-border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-jules-accent"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-bold mb-2">Description</label>
                <textarea
                  className="bg-[#252525] border border-jules-border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-jules-accent"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-transparent hover:bg-white/10 text-gray-300 font-bold py-2 px-4 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-jules-primary hover:bg-white text-black font-bold py-2 px-4 rounded transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
