"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      API.get("/projects/my")
        .then((res) => setProjects(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Welcome, {user?.name}
          </h1>
          <div className="flex gap-4">
            <Link href="/explore" className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
              Explore
            </Link>
            <Link href="/community" className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
              Community
            </Link>
          </div>
        </header>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-zinc-200">My Projects</h2>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length === 0 ? (
              <p className="text-zinc-500 col-span-2 text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                You haven't created any projects yet.
              </p>
            ) : (
              projects.map((p: any) => (
                <Link
                  href={`/projects/${p._id}`}
                  key={p._id}
                  className="block p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-blue-500/50 hover:bg-zinc-900 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium group-hover:text-blue-400 transition-colors">{p.name}</h3>
                    {p.isPublic && <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">Public</span>}
                  </div>
                  <p className="text-zinc-400 text-sm line-clamp-2">{p.description}</p>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
