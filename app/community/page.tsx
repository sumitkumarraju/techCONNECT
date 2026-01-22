"use client";
import React, { useEffect, useState } from 'react';

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    fetch('/api/community')
      .then(res => res.json())
      .then(data => setDiscussions(data));
  }, []);

  return (
    <div className="min-h-screen bg-jules-bg text-jules-text font-sans p-6 md:p-10">
      <div className="max-w-4xl mx-auto animate-slide-up mt-20">
        <h2 className="text-2xl font-semibold mb-6">Discussions</h2>

        <div className="space-y-4">
          {discussions.map((disc: any) => (
            <div key={disc._id} className="bg-jules-surface border border-jules-border rounded-2xl p-5 flex gap-4 hover:bg-jules-surfaceHover transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-1">
                <button className="text-jules-muted hover:text-jules-accent"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg></button>
                <span className="text-sm font-mono font-bold">42</span>
                <button className="text-jules-muted hover:text-red-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
              </div>
              <div>
                <h3 className="text-base font-medium mb-1">{disc.title}</h3>
                <p className="text-sm text-jules-muted line-clamp-2">{disc.content}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-jules-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span>{disc.author}</span>
                  </div>
                  <span>{disc.comments} comments</span>
                  {disc.tags.map((tag: string) => (
                    <span key={tag} className="bg-[#2a2a2a] px-2 py-0.5 rounded text-white">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
