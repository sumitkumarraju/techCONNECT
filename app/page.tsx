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

      {/* 🧭 NAVBAR */}
      <header className="fixed w-full z-50 top-0 bg-jules-bg/90 backdrop-blur-md border-b border-jules-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-sm rounded-none group-hover:rotate-12 transition-transform">&lt;/&gt;</div>
            <span className="font-bold tracking-tight text-lg">TechConnect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-bold text-sm">
            <Link href="/explore" className="hover:text-jules-accent transition-colors">Explore</Link>
            <Link href="/challenges" className="hover:text-jules-accent transition-colors">Challenges</Link>
            <Link href="/community" className="hover:text-jules-accent transition-colors">Community</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-jules-accent transition-colors">Log in</Link>
            <span className="text-jules-border">|</span>
            <Link href="/register" className="text-sm font-bold hover:text-jules-accent transition-colors">Sign up</Link>
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
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
            Create Your First Project
          </Link>
        </div>

        <div className="flex justify-center gap-6 text-sm font-bold text-jules-muted/70">
          <a href="#" className="hover:text-jules-primary transition-colors">View on GitHub</a>
          <span className="text-jules-border">•</span>
          <a href="#" className="hover:text-jules-primary transition-colors">Explore Community</a>
        </div>
      </section>

      {/* 🔹 TRUST / STATUS STRIP */}
      <section className="border-y border-jules-border/30 bg-jules-surface/50 py-4 mb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-jules-primary/90 flex items-center justify-center gap-3">
            <span>🚀 Built for students</span>
            <span className="text-jules-border">•</span>
            <span>Real-time collaboration</span>
            <span className="text-jules-border">•</span>
            <span>Open-source friendly</span>
          </p>
        </div>
      </section>

      {/* 🧠 PROBLEM SECTION (With Sad Face) */}
      <section className="py-20 px-6 max-w-4xl mx-auto mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-jules-primary">
            Coding is easier when you’re not alone.
          </h2>
          <p className="text-xl font-medium mb-4 text-jules-pink">
            Learning to code is one thing. <br />
            Building real projects with other people is another.
          </p>
          <p className="text-jules-primary/70 max-w-2xl mx-auto">
            Students often struggle to find reliable collaborators, coordinate group projects, and gain real-world development experience.
          </p>
        </div>

        {/* Sad Face Component (Moved here as Problem visual) */}
        <div className="bg-[#120129] border-2 border-[#3C1661] p-10 relative shadow-[10px_10px_0px_0px_#2A0A55] max-w-xl mx-auto group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300">
          <div className="flex justify-center mb-8">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D0B9FF]">
              <path d="M2 2H22V22H2V2Z" fill="transparent" />
              <rect x="6" y="8" width="2" height="4" fill="currentColor" />
              <rect x="16" y="8" width="2" height="4" fill="currentColor" />
              <rect x="7" y="15" width="2" height="2" fill="currentColor" />
              <rect x="9" y="14" width="6" height="2" fill="currentColor" />
              <rect x="15" y="15" width="2" height="2" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8 leading-tight">
            TechConnect handles the setup you <br />
            <span className="text-white border-b-4 border-jules-accent inline-block pb-1 mt-2">don&apos;t want</span> to do.
          </h2>
          <div className="grid grid-cols-2 gap-4 font-bold text-sm text-center text-jules-bg">
            <div className="bg-[#E546CA] p-3 shadow-[4px_4px_0px_0px_#000000]">Environment</div>
            <div className="bg-[#00D7FF] p-3 shadow-[4px_4px_0px_0px_#000000]">Dependencies</div>
            <div className="bg-[#FFB800] p-3 shadow-[4px_4px_0px_0px_#000000]">Deployment</div>
            <div className="bg-[#9747FF] p-3 shadow-[4px_4px_0px_0px_#000000]">Boilerplate</div>
          </div>
        </div>
      </section>

      {/* 🚀 SOLUTION SECTION */}
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
          <div className="bg-jules-surface border border-jules-border p-8 rounded-none hover:border-jules-accent/50 transition-colors group shadow-[8px_8px_0px_0px_#2A0A55] hover:translate-y-1 hover:shadow-none">
            <div className="w-12 h-12 bg-jules-bg flex items-center justify-center mb-6 border border-jules-border">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Live Collaboration</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">Work on the same codebase together and see changes instantly.</p>
          </div>
          <div className="bg-jules-surface border border-jules-border p-8 rounded-none hover:border-jules-accent/50 transition-colors group shadow-[8px_8px_0px_0px_#2A0A55] hover:translate-y-1 hover:shadow-none">
            <div className="w-12 h-12 bg-jules-bg flex items-center justify-center mb-6 border border-jules-border">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Learn by Building</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">Gain practical experience through real projects, not just tutorials.</p>
          </div>
          <div className="bg-jules-surface border border-jules-border p-8 rounded-none hover:border-jules-accent/50 transition-colors group shadow-[8px_8px_0px_0px_#2A0A55] hover:translate-y-1 hover:shadow-none">
            <div className="w-12 h-12 bg-jules-bg flex items-center justify-center mb-6 border border-jules-border">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Stay Organized</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">Manage files, tasks, and discussions in one place for every project.</p>
          </div>
          <div className="bg-jules-surface border border-jules-border p-8 rounded-none hover:border-jules-accent/50 transition-colors group shadow-[8px_8px_0px_0px_#2A0A55] hover:translate-y-1 hover:shadow-none">
            <div className="w-12 h-12 bg-jules-bg flex items-center justify-center mb-6 border border-jules-border">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Grow with Community</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">Join challenges, explore open projects, and learn with others.</p>
          </div>
        </div>
      </section>

      {/* 🖥️ PRODUCT PREVIEW SECTION */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-jules-primary">A workspace built for collaboration.</h2>
          <p className="text-lg text-jules-primary/70">Code, communicate, and manage projects — all in one place, designed for students.</p>
        </div>

        {/* CSS Mockup of Editor */}
        <div className="bg-[#0A0A23] border border-jules-border rounded-lg shadow-2xl overflow-hidden relative">
          <div className="h-8 bg-[#1D1D3D] border-b border-jules-border flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="ml-4 px-3 py-1 bg-[#0A0A23] text-xs text-jules-muted rounded-t-md border-t border-x border-jules-border/30">project-main.tsx</div>
          </div>
          <div className="flex h-[400px]">
            {/* Sidebar */}
            <div className="w-48 border-r border-jules-border/30 p-4 hidden md:block">
              <div className="text-xs font-bold text-jules-muted mb-2 uppercase">Files</div>
              <div className="space-y-2 text-sm text-jules-primary/80">
                <div className="flex items-center gap-2"><span className="text-blue-400">#</span> app</div>
                <div className="flex items-center gap-2 pl-4"><span className="text-yellow-400">JS</span> layout.tsx</div>
                <div className="flex items-center gap-2 pl-4 text-jules-accent"><span className="text-blue-400">React</span> page.tsx</div>
                <div className="flex items-center gap-2"><span className="text-blue-400">#</span> components</div>
              </div>
            </div>
            {/* Editor Area */}
            <div className="flex-1 p-6 font-mono text-sm">
              <div className="flex">
                <div className="w-8 text-jules-muted/50 text-right pr-4 select-none">1</div>
                <div><span className="text-purple-400">export default</span> <span className="text-blue-400">function</span> <span className="text-yellow-400">Home</span>() {"{"}</div>
              </div>
              <div className="flex">
                <div className="w-8 text-jules-muted/50 text-right pr-4 select-none">2</div>
                <div className="pl-4"><span className="text-purple-400">return</span> (</div>
              </div>
              <div className="flex bg-white/5">
                <div className="w-8 text-jules-muted/50 text-right pr-4 select-none">3</div>
                <div className="pl-8"><span className="text-blue-400">&lt;div</span> <span className="text-green-400">className</span>=<span className="text-orange-400">&quot;flex flex-col items-center&quot;</span>&gt;</div>
                <div className="absolute right-10 bg-jules-accent text-jules-bg px-2 text-xs rounded font-bold">You</div>
              </div>
              <div className="flex">
                <div className="w-8 text-jules-muted/50 text-right pr-4 select-none">4</div>
                <div className="pl-12"><span className="text-blue-400">&lt;h1&gt;</span>Hello World<span className="text-blue-400">&lt;/h1&gt;</span></div>
              </div>
              <div className="flex">
                <div className="w-8 text-jules-muted/50 text-right pr-4 select-none">5</div>
                <div className="pl-8"><span className="text-blue-400">&lt;/div&gt;</span></div>
              </div>
              <div className="flex">
                <div className="w-8 text-jules-muted/50 text-right pr-4 select-none">6</div>
                <div className="pl-4">);</div>
              </div>
              <div className="flex">
                <div className="w-8 text-jules-muted/50 text-right pr-4 select-none">7</div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>

          {/* Overlay Badges */}
          <div className="absolute top-20 right-20 bg-jules-accent text-jules-bg px-3 py-1 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transform rotate-3">Live Code Editor</div>
        </div>
      </section>

      {/* 🔄 HOW IT WORKS SECTION (Jules Steps) */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-20">How TechConnect Works</h2>
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-[#9747FF] flex items-center justify-center font-bold text-3xl text-jules-bg shadow-[8px_8px_0px_0px_#2A0A55] border-2 border-white/20">1</div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-[#9747FF]">Create or join a project</h3>
              <p className="text-lg text-jules-primary/80">Start a new project or collaborate on an existing one.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-[#FFB800] flex items-center justify-center font-bold text-3xl text-jules-bg shadow-[8px_8px_0px_0px_#2A0A55] border-2 border-white/20">2</div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-[#FFB800]">Code together in real time</h3>
              <p className="text-lg text-jules-primary/80">Edit code, discuss, and track progress as a team. Join the session instantly with your own cursor.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-[#00D7FF] flex items-center justify-center font-bold text-3xl text-jules-bg shadow-[8px_8px_0px_0px_#2A0A55] border-2 border-white/20">3</div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-[#00D7FF]">Organize, ship, and grow</h3>
              <p className="text-lg text-jules-primary/80">Manage tasks, complete projects, and build real experience to show off.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 FEATURES SECTION (Octopus Grid Reused) */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-jules-primary">Everything you need to build together</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

          {/* Left Column Features */}
          <div className="md:col-span-3 space-y-24">
            <div className="bg-[#2A0A55]/50 border border-jules-border/50 p-6 rounded-none relative group hover:bg-[#2A0A55] transition-colors">
              <div className="absolute -top-3 -left-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#FFB800]"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Live Collaboration</h3>
              <p className="text-sm text-jules-primary/70">Edit code together with teammates in real time.</p>
            </div>
            <div className="bg-[#2A0A55]/50 border border-jules-border/50 p-6 rounded-none relative group hover:bg-[#2A0A55] transition-colors">
              <div className="absolute -top-3 -left-3 text-jules-accent bg-jules-bg font-mono font-bold px-1">{">_"}</div>
              <h3 className="text-lg font-bold mb-2">Project Workspaces</h3>
              <p className="text-sm text-jules-primary/70">Files, tasks, and discussions — organized per project.</p>
            </div>
          </div>

          {/* Center Octopus */}
          <div className="md:col-span-6 flex justify-center py-10 md:py-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://jules.google/squid.png" alt="Octopus" className="w-[280px] md:w-[400px] animate-[pulse_4s_ease-in-out_infinite]" />
          </div>

          {/* Right Column Features */}
          <div className="md:col-span-3 space-y-24">
            <div className="bg-[#2A0A55]/50 border border-jules-border/50 p-6 rounded-none relative group hover:bg-[#2A0A55] transition-colors">
              <div className="absolute -top-3 -left-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4ADE80]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Built-in Chat</h3>
              <p className="text-sm text-jules-primary/70">Chat and review code without switching tools.</p>
            </div>
            <div className="bg-[#2A0A55]/50 border border-jules-border/50 p-6 rounded-none relative group hover:bg-[#2A0A55] transition-colors">
              <div className="absolute -top-3 -left-3 text-[#E546CA] bg-jules-bg font-mono font-bold px-1">URI</div>
              <h3 className="text-lg font-bold mb-2">Challenges</h3>
              <p className="text-sm text-jules-primary/70">Practice skills, compete, and track your progress.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 👥 WHO IT’S FOR SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-jules-border/30">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Built for learners and builders</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 bg-jules-surface/30 border border-jules-border/30 rounded-lg hover:bg-jules-surface/60 transition-colors">
            <h3 className="text-xl font-bold mb-2 text-[#00D7FF]">Students</h3>
            <p className="text-sm text-jules-primary/70">Learn collaboration and teamwork through real projects.</p>
          </div>
          <div className="p-6 bg-jules-surface/30 border border-jules-border/30 rounded-lg hover:bg-jules-surface/60 transition-colors">
            <h3 className="text-xl font-bold mb-2 text-[#E546CA]">Beginners</h3>
            <p className="text-sm text-jules-primary/70">Move beyond tutorials and gain hands-on experience.</p>
          </div>
          <div className="p-6 bg-jules-surface/30 border border-jules-border/30 rounded-lg hover:bg-jules-surface/60 transition-colors">
            <h3 className="text-xl font-bold mb-2 text-[#FFB800]">Hackathons</h3>
            <p className="text-sm text-jules-primary/70">Coordinate easily and ship faster together.</p>
          </div>
          <div className="p-6 bg-jules-surface/30 border border-jules-border/30 rounded-lg hover:bg-jules-surface/60 transition-colors">
            <h3 className="text-xl font-bold mb-2 text-[#9747FF]">Aspiring Pros</h3>
            <p className="text-sm text-jules-primary/70">Build a portfolio with real collaborative projects.</p>
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS SECTION */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-jules-muted mb-16 uppercase tracking-widest">Built by students, for students</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-xl italic mb-6">&quot;Finally a platform where group projects actually feel organized.&quot;</p>
            <p className="font-bold text-jules-accent">— Computer Science Student</p>
          </div>
          <div>
            <p className="text-xl italic mb-6">&quot;Great for hackathons and collaborative learning. The environment setup is magic.&quot;</p>
            <p className="font-bold text-jules-accent">— Frontend Developer</p>
          </div>
        </div>
      </section>

      {/* 🔥 FINAL CTA SECTION */}
      <section className="py-32 px-6 text-center bg-gradient-to-t from-[#2A0A55]/30 to-transparent">
        <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to build something real?</h2>
        <p className="text-xl text-jules-primary/80 mb-12">Join TechConnect and start collaborating today.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
          <Link
            href="/register"
            className="bg-jules-accent text-jules-bg font-bold text-lg px-10 py-4 hover:bg-white transition-all shadow-[6px_6px_0px_0px_#2A0A55]"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="text-jules-primary font-bold hover:text-white underline underline-offset-4 decoration-2"
          >
            Join the Community
          </Link>
        </div>
        <p className="mt-6 text-sm text-jules-muted">No credit card required.</p>
      </section>

      {/* 🧾 FOOTER */}
      <footer className="py-12 border-t border-jules-border/30 bg-[#120129] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-xs">&lt;/&gt;</div>
                <span className="font-bold tracking-tight text-lg">TechConnect</span>
              </Link>
              <p className="text-sm text-jules-muted">Built by students, for students.</p>
            </div>
            <div className="flex gap-8 text-sm font-bold text-jules-muted">
              <a href="#" className="hover:text-jules-primary">About</a>
              <a href="#" className="hover:text-jules-primary">Community</a>
              <a href="#" className="hover:text-jules-primary">GitHub</a>
              <a href="#" className="hover:text-jules-primary">Privacy</a>
            </div>
          </div>
          <div className="text-center md:text-left text-xs text-jules-muted/50">
            © 2026 TechConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
