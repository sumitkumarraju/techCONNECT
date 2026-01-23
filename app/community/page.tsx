"use client";
import React from "react";
import Link from "next/link";

export default function Community() {
  return (
    <div className="font-mono min-h-screen bg-jules-bg text-jules-primary flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="text-4xl font-bold">Community Discussions</h1>
        <p className="text-jules-primary/70">Ask questions, share knowledge, and connect with other developers.</p>
        <div className="pt-8">
          <Link href="/" className="text-jules-accent hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
