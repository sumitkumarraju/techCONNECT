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
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
                {profile.username.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
              <p className="text-jules-muted">Full Stack Developer • Student</p>
            </div>
          </div>
          <button className="mb-4 border border-jules-border bg-[#1c1c1c] px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition-all text-white">Edit Profile</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-jules-surface border border-jules-border rounded-2xl p-5">
              <h3 className="text-sm font-bold uppercase text-jules-muted mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="text-xs bg-[#2a2a2a] px-3 py-1 rounded-full text-white">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-jules-surface border border-jules-border rounded-2xl p-5">
              <h3 className="text-sm font-bold uppercase text-jules-muted mb-4">About</h3>
              <p className="text-sm leading-relaxed text-jules-text">{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
