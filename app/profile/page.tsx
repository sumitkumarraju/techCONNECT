"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import API from "@/lib/api";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (authUser) {
      // Use standard API util which handles token automatically
      API.get('/auth/me') // Or /api/profile if it exists, but usually we just load current user
        .then(res => setProfile(res.data))
        .catch(err => console.error(err));
    }
  }, [authUser]);

  if (!profile) return <div className="p-10 text-white">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-jules-bg text-jules-text font-sans overflow-y-auto">
      <div className="h-48 bg-gradient-to-r from-blue-900 to-purple-900 opacity-50"></div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 pb-20 animate-slide-up">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-end gap-6">
            <div className="w-32 h-32 rounded-full bg-black p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden group">
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.username?.substring(0, 2).toUpperCase()
                )}
              </div>
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
              <p className="text-jules-muted">{profile.name}</p>
              {profile.githubUrl && <a href={profile.githubUrl} target="_blank" className="text-xs text-blue-400 hover:underline mr-2">GitHub</a>}
              {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" className="text-xs text-blue-400 hover:underline">LinkedIn</a>}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mb-4 border border-jules-border bg-[#1c1c1c] px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition-all text-white"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <div className="bg-jules-surface border border-jules-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs text-jules-muted mb-1">Bio (Max 500 chars)</label>
                <textarea
                  className="w-full bg-[#111] border border-[#333] rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-jules-muted mb-1">Skills (Comma separated)</label>
                <input
                  className="w-full bg-[#111] border border-[#333] rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="React, Node.js, Python..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-jules-muted mb-1">GitHub URL</label>
                  <input
                    className="w-full bg-[#111] border border-[#333] rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-jules-muted mb-1">LinkedIn URL</label>
                  <input
                    className="w-full bg-[#111] border border-[#333] rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                {/* Avatar edit is slightly more complex, skipping for MVP text inputs */}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-500"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

            <div className="md:col-span-2 space-y-6">
              <div className="bg-jules-surface border border-jules-border rounded-2xl p-5">
                <h3 className="text-sm font-bold uppercase text-jules-muted mb-4">About</h3>
                <p className="text-sm leading-relaxed text-jules-text whitespace-pre-wrap">
                  {profile.bio || "No bio yet."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
