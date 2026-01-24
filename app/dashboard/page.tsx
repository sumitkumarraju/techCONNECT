"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]); // Initialize as empty array
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const fetchProjects = async () => {
        try {
          const res = await API.get("/projects/my");
          // Ensure response data is an array before setting
          if (Array.isArray(res.data)) {
            setProjects(res.data);
          } else {
            setProjects([]);
            console.warn("Unexpected API response format for projects:", res.data);
          }
        } catch (err) {
          console.error(err);
          setProjects([]); // Fallback to empty array on error
        }
      };
      fetchProjects();
    }
  }, [user, loading, router]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      const { data } = await API.post("/projects", {
        name: newProjectName,
        description: newProjectDesc,
        isPublic: false // Default to private
      });
      setProjects([data, ...projects]);
      setShowNewProjectModal(false);
      setNewProjectName("");
      setNewProjectDesc("");
      router.push(`/projects/${data._id}`); // Direct access to workspace after creation
    } catch (error) {
      console.error("Failed to create project", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-jules-bg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jules-accent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-jules-bg text-jules-primary font-mono antialiased relative overflow-hidden">
      {/* Decorative Assets */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <header className="flex justify-between items-center mb-16 border-b border-jules-border/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-lg rounded-none">&lt;/&gt;</div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, <span className="text-jules-accent">{user?.name}</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/explore" className="px-5 py-2.5 rounded-none font-bold text-sm bg-jules-surface border border-jules-border hover:bg-jules-border/50 transition-all shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-0.5">
              Explore
            </Link>
            <Link href="/community" className="px-5 py-2.5 rounded-none font-bold text-sm bg-jules-surface border border-jules-border hover:bg-jules-border/50 transition-all shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-0.5">
              Community
            </Link>
          </div>
        </header>

        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">My Projects</h2>
              <p className="text-jules-primary/60 text-sm">Review your active projects and workspaces.</p>
            </div>

            <button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-jules-accent text-jules-bg px-6 py-3 font-bold shadow-[6px_6px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-1 transition-all border-2 border-transparent hover:border-jules-primary/20"
            >
              + New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-jules-surface/30 border-2 border-dashed border-jules-border/50 rounded-lg">
                <p className="text-xl font-bold text-jules-muted mb-2">No projects yet</p>
                <p className="text-sm text-jules-primary/50 mb-6">Create your first project to get started.</p>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="text-jules-accent font-bold hover:underline"
                >
                  Create a Project
                </button>
              </div>
            ) : (
              projects.map((p: any) => (
                <Link
                  href={`/projects/${p._id}`}
                  key={p._id}
                  className="group block bg-jules-surface/50 border border-jules-border hover:border-jules-accent p-6 relative transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#2A0A55]"
                >
                  <div className="absolute top-4 right-4">
                    {p.isPublic ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">Public</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-jules-muted bg-jules-muted/10 px-2 py-1 rounded-full border border-jules-muted/20">Private</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-jules-accent transition-colors pr-10">{p.name}</h3>
                  <p className="text-sm text-jules-primary/60 line-clamp-2 h-10 mb-4">{p.description || "No description provided."}</p>

                  <div className="flex items-center justify-between text-xs text-jules-primary/40 pt-4 border-t border-jules-border/30">
                    <span>Updated recently</span>
                    <span className="font-bold group-hover:text-jules-accent">Open Workspace &rarr;</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowNewProjectModal(false)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-jules-surface border border-jules-border p-8 w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(123,44,191,0.2)]"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-jules-muted mb-2">Project Name</label>
                <input
                  type="text"
                  className="w-full bg-[#0A0A23] border border-jules-border p-3 text-jules-primary focus:outline-none focus:border-jules-accent"
                  placeholder="e.g. My Awesome App"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-jules-muted mb-2">Description (Optional)</label>
                <textarea
                  className="w-full bg-[#0A0A23] border border-jules-border p-3 text-jules-primary focus:outline-none focus:border-jules-accent h-24 resize-none"
                  placeholder="What's this project about?"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1 py-3 font-bold text-jules-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-jules-accent text-jules-bg font-bold py-3 hover:bg-white transition-colors disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
