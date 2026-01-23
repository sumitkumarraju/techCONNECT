"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    API.get("/community/posts").then(res => setPosts(res.data));
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.post("/community/posts", newPost);
    setShowForm(false);
    setNewPost({ title: "", content: "" });
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
          Community Forum
        </h1>
        <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
          &larr; Back to Dashboard
        </Link>
      </header>

      <div className="max-w-4xl mx-auto">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 mb-8 bg-zinc-900 border border-zinc-800 border-dashed rounded-xl text-zinc-400 hover:text-white hover:border-orange-500 transition-all font-medium"
          >
            + Start a New Discussion
          </button>
        ) : (
          <form onSubmit={createPost} className="bg-[#0c0c0e] border border-zinc-800 rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
            <input
              placeholder="Discussion Title"
              className="w-full bg-transparent text-xl font-bold mb-4 focus:outline-none placeholder-zinc-600"
              value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
            <textarea
              placeholder="What's on your mind?"
              className="w-full bg-zinc-900/50 rounded-lg p-4 min-h-[150px] mb-4 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/50 border-none resize-none"
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
              required
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
              <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors">Post Discussion</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {posts.map((p: any) => (
            <div key={p._id} className="bg-[#0c0c0e] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <h3 className="text-lg font-bold mb-2 text-zinc-200">{p.title}</h3>
              <p className="text-zinc-400 text-sm mb-4">{p.content}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-zinc-800"></div>
                  {p.authorId?.username}
                </span>
                <span>•</span>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                {/* Add Upvote button/count here later if needed */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
