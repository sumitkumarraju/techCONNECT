import React, { useState, useEffect, useCallback } from 'react';
import API from "@/lib/api";

interface DiscussionPanelProps {
    projectId: string;
    user: any;
}

export default function DiscussionPanel({ projectId, user }: DiscussionPanelProps) {
    const [view, setView] = useState<"list" | "detail">("list");
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [activeDiscussion, setActiveDiscussion] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [commentText, setCommentText] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const fetchDiscussions = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await API.get(`/discussions?projectId=${projectId}`);
            setDiscussions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (view === "list") fetchDiscussions();
    }, [view, fetchDiscussions]);

    const fetchDiscussionDetail = async (id: string) => {
        setIsLoading(true);
        try {
            const { data } = await API.get(`/discussions/${id}`);
            setActiveDiscussion(data.discussion);
            setComments(data.comments);
            setView("detail");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateDiscussion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/discussions", {
                title: newTitle,
                content: newContent,
                projectId,
                type: "project",
                createdBy: user._id
            });
            setDiscussions([data, ...discussions]);
            setIsCreating(false);
            setNewTitle("");
            setNewContent("");
        } catch (err) {
            alert("Failed to create discussion");
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const { data } = await API.post("/comments", {
                discussionId: activeDiscussion._id,
                authorId: user._id,
                content: commentText
            });
            setComments([...comments, data]);
            setCommentText("");
        } catch (err) {
            alert("Failed to post comment");
        }
    };

    if (view === "list") {
        return (
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-3 border-b border-[#2b2b2b] flex justify-between items-center bg-[#252526]">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Discussions</h3>
                    <button onClick={() => setIsCreating(true)} className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-500">
                        + New
                    </button>
                </div>

                {isCreating && (
                    <div className="p-3 bg-[#1e1e1e] border-b border-[#2b2b2b]">
                        <form onSubmit={handleCreateDiscussion} className="flex flex-col gap-2">
                            <input
                                className="bg-[#333] border border-[#444] rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                placeholder="Topic Title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                autoFocus
                            />
                            <textarea
                                className="bg-[#333] border border-[#444] rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-16 resize-none"
                                placeholder="What's on your mind?"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsCreating(false)} className="text-[10px] text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" disabled={!newTitle} className="text-[10px] bg-blue-600 px-2 py-1 rounded text-white disabled:opacity-50">Post</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? <div className="p-4 text-center text-xs text-gray-500">Loading...</div> : discussions.map(d => (
                        <div
                            key={d._id}
                            onClick={() => fetchDiscussionDetail(d._id)}
                            className="p-3 border-b border-[#2b2b2b] hover:bg-[#2a2d2e] cursor-pointer group"
                        >
                            <div className="font-bold text-xs text-gray-200 mb-1 group-hover:text-blue-400 transition-colors">{d.title}</div>
                            <div className="text-[10px] text-gray-500 flex justify-between">
                                <span>{d.createdBy?.username || "Unknown"}</span>
                                <span>{d.commentCount || 0} 💬</span>
                            </div>
                        </div>
                    ))}
                    {discussions.length === 0 && !isLoading && <div className="p-4 text-center text-xs text-gray-500 italic">No discussions yet.</div>}
                </div>
            </div>
        );
    }

    // Detail View
    return (
        <div className="flex-1 overflow-hidden flex flex-col h-full bg-[#1e1e1e]">
            <div className="p-2 border-b border-[#2b2b2b] bg-[#252526] flex items-center gap-2">
                <button onClick={() => setView("list")} className="text-gray-400 hover:text-white text-xs px-1">←</button>
                <div className="font-bold text-xs text-gray-200 truncate flex-1">{activeDiscussion?.title}</div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Main Post */}
                <div className="border-b border-[#333] pb-3 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {activeDiscussion?.createdBy?.username?.[0] || "?"}
                        </div>
                        <span className="text-xs font-bold text-gray-300">{activeDiscussion?.createdBy?.username}</span>
                        <span className="text-[10px] text-gray-500">{new Date(activeDiscussion?.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-300 whitespace-pre-wrap pl-7">{activeDiscussion?.content}</p>
                </div>

                {/* Comments */}
                {comments.map(c => (
                    <div key={c._id} className="group">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-bold text-blue-400">{c.authorId?.username}</span>
                            <span className="text-[10px] text-gray-600">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="text-xs text-gray-300 pl-2 border-l-2 border-[#333] ml-1">{c.content}</div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#2b2b2b] bg-[#252526]">
                <form onSubmit={handlePostComment} className="flex gap-2">
                    <input
                        className="flex-1 bg-[#333] border border-[#444] rounded px-2 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="Reply..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button type="submit" disabled={!commentText.trim()} className="text-[10px] bg-blue-600 px-3 rounded text-white font-bold hover:bg-blue-500 disabled:opacity-50">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
