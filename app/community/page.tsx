"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Community() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    API.get("/community/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to fetch posts", err));
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    setIsPosting(true);
    try {
      await API.post("/community/posts", newPost);
      setShowNewPostModal(false);
      setNewPost({ title: "", content: "" });
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setIsPosting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A23] flex items-center justify-center text-jules-primary">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A23] text-jules-primary font-mono antialiased relative overflow-hidden">
      {/* Decorative Assets */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto p-8 relative z-10">

        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-jules-border/30 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-lg rounded-none group-hover:bg-jules-accent transition-colors">&lt;/&gt;</div>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Community Forum</h1>
              <p className="text-sm text-jules-primary/60">Discuss code, share ideas, and get help.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-5 py-2.5 rounded-none font-bold text-sm bg-jules-surface border border-jules-border hover:bg-jules-border/50 transition-all shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-0.5">
              Dashboard
            </Link>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="bg-jules-accent text-jules-bg px-6 py-2.5 font-bold shadow-[4px_4px_0px_0px_#2A0A55] hover:shadow-none hover:translate-y-1 transition-all border-2 border-transparent hover:border-jules-primary/20"
            >
              + New Post
            </button>
          </div>
        </header>

        {/* Posts Feed */}
        <div className="grid gap-6 max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="py-20 text-center bg-jules-surface/30 border-2 border-dashed border-jules-border/50 rounded-lg">
              <p className="text-xl font-bold text-jules-muted mb-2">No discussions yet.</p>
              <p className="text-sm text-jules-primary/50">Be the first to start a conversation!</p>
            </div>
          ) : (
            posts.map((p: any) => (
              <div key={p._id} className="bg-jules-surface/50 border border-jules-border hover:border-jules-accent p-6 relative transition-all hover:bg-[#120129] group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                      {p.authorId?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-jules-accent">{p.authorId?.username || "Unknown User"}</div>
                      <div className="text-[10px] text-jules-primary/40">{new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {/* Add visual badges or tags here later */}
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-jules-accent transition-colors">{p.title}</h3>
                <p className="text-sm text-jules-primary/70 whitespace-pre-wrap leading-relaxed">{p.content}</p>

                {/* Visual Interactive Footer */}
                <div className="mt-6 pt-4 border-t border-jules-border/30 flex gap-6 text-xs font-bold text-jules-muted">
                  <button className="flex items-center gap-2 hover:text-green-400 transition-colors">
                    <span>▲</span> Upvote
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <span>💬</span> Comment
                  </button>
                  <button className="ml-auto hover:text-white transition-colors">
                    Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowNewPostModal(false)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-jules-surface border border-jules-border p-8 w-full max-w-2xl relative z-10 shadow-[0_0_50px_rgba(123,44,191,0.2)]"
          >
            <h2 className="text-2xl font-bold mb-6">Start a New Discussion</h2>
            <form onSubmit={createPost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-jules-muted mb-2">Title</label>
                <input
                  type="text"
                  className="w-full bg-[#0A0A23] border border-jules-border p-3 text-jules-primary focus:outline-none focus:border-jules-accent placeholder-jules-primary/20"
                  placeholder="What's on your mind?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-jules-muted mb-2">Content</label>
                <textarea
                  className="w-full bg-[#0A0A23] border border-jules-border p-3 text-jules-primary focus:outline-none focus:border-jules-accent h-40 resize-none placeholder-jules-primary/20"
                  placeholder="Share your thoughts, code snippets, or questions..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 py-3 font-bold text-jules-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPosting}
                  className="flex-1 bg-jules-accent text-jules-bg font-bold py-3 hover:bg-white transition-colors disabled:opacity-50"
                >
                  {isPosting ? "Posting..." : "Post Discussion"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
