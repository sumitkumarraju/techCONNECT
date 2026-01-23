"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="font-mono min-h-screen bg-jules-bg text-jules-primary relative overflow-hidden flex flex-col scroll-smooth selection:bg-jules-accent selection:text-jules-bg">

      {/* Decorative Assets */}
      <motion.img
        src="https://jules.google/jules-pixelated.png"
        alt="Jules"
        className="fixed top-20 left-10 w-24 h-24 md:w-32 md:h-32 z-0 opacity-60 pointer-events-none hidden lg:block"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="https://jules.google/comic-computer.png"
        alt="Computer"
        className="fixed bottom-20 right-10 w-24 h-24 md:w-32 md:h-32 z-0 opacity-60 pointer-events-none hidden lg:block"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Header */}
      <header className="fixed w-full z-50 top-0 bg-jules-bg/90 backdrop-blur-md border-b border-jules-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-sm rounded-none group-hover:rotate-12 transition-transform">&lt;/&gt;</div>
            <span className="font-bold tracking-tight text-lg">TechConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-jules-accent transition-colors">Log in</Link>
            <Link href="/register" className="bg-jules-primary text-jules-bg text-sm font-bold px-5 py-2 hover:bg-white transition-all hover:shadow-[4px_4px_0px_0px_#7B2CBF] active:translate-y-1 active:shadow-none">Sign up</Link>
          </div>
        </div>
      </header>

      {/* 🟣 HERO SECTION */}
      <section className="pt-40 pb-20 px-6 relative z-10 text-center max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 text-jules-primary leading-[1.1]">
          Build. Collaborate. <br className="hidden md:block" />
          <span className="text-jules-accent">Ship faster.</span>
        </h1>
        <p className="text-lg md:text-xl text-jules-primary/80 max-w-3xl mx-auto mb-12 leading-relaxed">
          A collaborative coding platform for students to work on real projects, solve challenges, and grow together — in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
          <Link
            href="/register"
            className="bg-jules-accent text-jules-bg font-bold text-lg px-8 py-4 hover:bg-white transition-all transform shadow-[6px_6px_0px_0px_#2A0A55] hover:shadow-[8px_8px_0px_0px_#2A0A55] hover:-translate-y-1 active:translate-y-0 active:shadow-none border-2 border-transparent"
          >
            Start Coding
          </Link>
          <Link
            href="/login"
            className="bg-transparent text-jules-primary border-2 border-jules-primary/50 font-bold text-lg px-8 py-4 hover:bg-jules-primary/10 transition-all hover:-translate-y-1"
          >
            Explore Projects
          </Link>
        </div>
      </section>

      {/* 🔹 TRUST / STATUS STRIP (Restored) */}
      <section className="border-y border-jules-border/30 bg-jules-surface/50 py-4 mb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm md:text-base font-medium text-jules-primary/90 flex items-center justify-center gap-3">
            <span>🚀 Built for students</span>
            <span className="text-jules-border">•</span>
            <span>Real-time collaboration</span>
            <span className="text-jules-border">•</span>
            <span>Open-source friendly</span>
          </p>
        </div>
      </section>

      {/* 🔹 SAD FACE / TASKS SECTION (Jules) */}
      <section className="py-20 px-6 max-w-xl mx-auto mb-20">
        <div className="bg-[#120129] border-2 border-[#3C1661] p-10 relative shadow-[10px_10px_0px_0px_#2A0A55] group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300">
          {/* Pixelated Sad Face SVG */}
          <div className="flex justify-center mb-8">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D0B9FF]">
              <path d="M2 2H22V22H2V2Z" fill="transparent" />
              {/* Simplified Pixel Face */}
              <rect x="6" y="8" width="2" height="4" fill="currentColor" />
              <rect x="16" y="8" width="2" height="4" fill="currentColor" />
              <rect x="7" y="15" width="2" height="2" fill="currentColor" />
              <rect x="9" y="14" width="6" height="2" fill="currentColor" />
              <rect x="15" y="15" width="2" height="2" fill="currentColor" />
            </svg>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 leading-tight">
            TechConnect handles the setup you <br />
            <span className="text-white border-b-4 border-jules-accent inline-block pb-1 mt-2">don't want</span> to do.
          </h2>

          <div className="grid grid-cols-2 gap-4 font-bold text-sm text-center text-jules-bg">
            <div className="bg-[#E546CA] p-3 shadow-[4px_4px_0px_0px_#000000]">Environment</div>
            <div className="bg-[#00D7FF] p-3 shadow-[4px_4px_0px_0px_#000000]">Dependencies</div>
            <div className="bg-[#FFB800] p-3 shadow-[4px_4px_0px_0px_#000000]">Deployment</div>
            <div className="bg-[#9747FF] p-3 shadow-[4px_4px_0px_0px_#000000]">Boilerplate</div>
          </div>

          {/* Decorative corner pixels */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-[#1D0245]"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-[#1D0245]"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#1D0245]"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#1D0245]"></div>
        </div>
      </section>

      {/* 🧠 PROBLEM SECTION (Restored) */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center relative mb-20 text-jules-bg">
        <div className="bg-jules-surface border border-jules-border rounded-none p-8 md:p-12 shadow-[12px_12px_0px_0px_#2A0A55] relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-jules-primary">
            Coding is easier <br /> when you’re not alone.
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-8 text-jules-pink">
            Learning to code is one thing. <br />
            Building real projects with other people is another.
          </p>

          <p className="text-jules-primary/70 mb-8 max-w-2xl mx-auto">
            Students often struggle to find reliable collaborators, coordinate group projects, gain real-world development experience, and move beyond tutorials.
          </p>

          <div className="inline-block bg-jules-bg border-2 border-jules-border px-6 py-3 shadow-[4px_4px_0px_0px_#00D7FF]">
            <p className="font-bold text-jules-accent">
              TechConnect exists to make collaboration simple, structured, and effective.
            </p>
          </div>
        </div>
      </section>

      {/* 🐙 FEATURE GRID (Jules Octopus) */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

          {/* Left Column Features */}
          <div className="md:col-span-3 space-y-24">
            <div className="bg-[#2A0A55]/50 border border-jules-border/50 p-6 rounded-none relative group hover:bg-[#2A0A55] transition-colors">
              <div className="absolute -top-3 -left-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#FFB800]"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Real-time Collaboration</h3>
              <p className="text-sm text-jules-primary/70">Work on the same codebase together. See changes instantly.</p>
            </div>
            <div className="bg-[#2A0A55]/50 border border-jules-border/50 p-6 rounded-none relative group hover:bg-[#2A0A55] transition-colors">
              <div className="absolute -top-3 -left-3 text-jules-accent bg-jules-bg font-mono font-bold px-1">{">_"}</div>
              <h3 className="text-lg font-bold mb-2">Cloud Development</h3>
              <p className="text-sm text-jules-primary/70">No localhost setup. Your environment lives in the cloud.</p>
            </div>
          </div>

          {/* Center Octopus */}
          <div className="md:col-span-6 flex justify-center py-10 md:py-0">
            <img src="https://jules.google/squid.png" alt="Octopus" className="w-[280px] md:w-[400px] animate-[pulse_4s_ease-in-out_infinite]" />
          </div>

          {/* Right Column Features */}
          <div className="md:col-span-3 space-y-24">
            <div className="bg-[#2A0A55]/50 border border-jules-border/50 p-6 rounded-none relative group hover:bg-[#2A0A55] transition-colors">
              <div className="absolute -top-3 -left-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4ADE80]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Instant Feedback</h3>
              <p className="text-sm text-jules-primary/70">Automated tests and linting run on every save.</p>
            </div>
            <div className="bg-[#2A0A55]/50 border border-jules-border/50 p-6 rounded-none relative group hover:bg-[#2A0A55] transition-colors">
              <div className="absolute -top-3 -left-3 text-[#E546CA] bg-jules-bg font-mono font-bold px-1">URI</div>
              <h3 className="text-lg font-bold mb-2">Browser Based</h3>
              <p className="text-sm text-jules-primary/70">Code from any device. Your workspace travels with you.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 🟢 SOLUTION SECTION (Restored) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-jules-primary">
            TechConnect brings developers together.
          </h2>
          <p className="text-lg text-jules-primary/70 max-w-3xl mx-auto">
            TechConnect is a shared workspace designed for students to collaborate on real projects.
            It combines coding, communication, and project organization into one simple platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-jules-surface border border-jules-border p-8 rounded-none hover:border-jules-accent/50 transition-colors group shadow-[8px_8px_0px_0px_#2A0A55] hover:translate-y-1 hover:shadow-none">
            <div className="w-12 h-12 bg-jules-bg flex items-center justify-center mb-6 border border-jules-border">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Collaborate</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">
              Work on the same codebase together and see changes instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-jules-surface border border-jules-border p-8 rounded-none hover:border-jules-accent/50 transition-colors group shadow-[8px_8px_0px_0px_#2A0A55] hover:translate-y-1 hover:shadow-none">
            <div className="w-12 h-12 bg-jules-bg flex items-center justify-center mb-6 border border-jules-border">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Learn</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">
              Gain practical experience by working on real projects.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-jules-surface border border-jules-border p-8 rounded-none hover:border-jules-accent/50 transition-colors group shadow-[8px_8px_0px_0px_#2A0A55] hover:translate-y-1 hover:shadow-none">
            <div className="w-12 h-12 bg-jules-bg flex items-center justify-center mb-6 border border-jules-border">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Organize</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">
              Manage files, tasks, and discussions in one place.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-jules-surface border border-jules-border p-8 rounded-none hover:border-jules-accent/50 transition-colors group shadow-[8px_8px_0px_0px_#2A0A55] hover:translate-y-1 hover:shadow-none">
            <div className="w-12 h-12 bg-jules-bg flex items-center justify-center mb-6 border border-jules-border">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Grow</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">
              Join challenges and learn alongside other student developers.
            </p>
          </div>
        </div>
      </section>

      {/* 🔢 HOW IT WORKS STEPS (Jules) */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-20">How TechConnect Works</h2>

        <div className="space-y-12">

          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-[#9747FF] flex items-center justify-center font-bold text-3xl text-jules-bg shadow-[8px_8px_0px_0px_#2A0A55] border-2 border-white/20">
              1
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-[#9747FF]">Create a Project</h3>
              <p className="text-lg text-jules-primary/80">Start a new repo or import from GitHub. Your cloud environment spins up in seconds, ready with all dependencies pre-installed.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-[#FFB800] flex items-center justify-center font-bold text-3xl text-jules-bg shadow-[8px_8px_0px_0px_#2A0A55] border-2 border-white/20">
              2
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-[#FFB800]">Invite Collaborators</h3>
              <p className="text-lg text-jules-primary/80">Send a link to your teammates. They join the session instantly with their own cursor, terminal, and file access.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-[#00D7FF] flex items-center justify-center font-bold text-3xl text-jules-bg shadow-[8px_8px_0px_0px_#2A0A55] border-2 border-white/20">
              3
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-[#00D7FF]">Build & Ship</h3>
              <p className="text-lg text-jules-primary/80">Code together, chat in real-time, and deploy your project with a single click. Show off your work to the community.</p>
            </div>
          </div>

        </div>
      </section>

      <footer className="py-12 border-t border-jules-border/30 mt-12 bg-[#120129] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-jules-muted/60">
          <p>© 2026 TechConnect • Inspired by Jules</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-bold">
            <a href="#" className="hover:text-jules-accent transition-colors">GitHub</a>
            <a href="#" className="hover:text-jules-accent transition-colors">Discord</a>
            <a href="#" className="hover:text-jules-accent transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
