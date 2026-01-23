"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="font-mono min-h-screen bg-jules-bg text-jules-primary relative overflow-hidden flex flex-col scroll-smooth">

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

      <header className="fixed w-full z-50 top-0 bg-jules-bg/80 backdrop-blur-md border-b border-jules-border/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-jules-primary flex items-center justify-center text-jules-bg font-bold text-xs">&lt;/&gt;</div>
            <span className="font-bold tracking-tight text-lg">TechConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-jules-accent transition-colors">Log in</Link>
            <Link href="/register" className="bg-jules-primary text-jules-bg text-sm font-bold px-4 py-2 rounded-full hover:bg-white transition-all">Sign up</Link>
          </div>
        </div>
      </header>

      {/* 🟣 HERO SECTION */}
      <section className="pt-32 pb-20 px-6 relative z-10 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 text-jules-primary leading-tight">
          Build. Collaborate. <br className="hidden md:block" />
          <span className="text-jules-accent">Ship faster.</span>
        </h1>
        <p className="text-lg md:text-xl text-jules-primary/80 max-w-3xl mx-auto mb-10 leading-relaxed">
          A collaborative coding platform for students to work on real projects, solve challenges, and grow together — in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/register"
            className="bg-jules-accent text-jules-bg font-bold text-lg px-8 py-4 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[4px_4px_0px_0px_#7B2CBF] active:translate-y-1 active:shadow-none border-2 border-transparent"
          >
            Start Coding
          </Link>
          <Link
            href="/register"
            className="bg-transparent text-jules-primary border-2 border-jules-primary/30 font-bold text-lg px-8 py-4 rounded-full hover:bg-jules-primary/10 transition-all hover:scale-105"
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
          <p className="text-sm md:text-base font-medium text-jules-primary/90 flex items-center justify-center gap-3">
            <span>🚀 Built for students</span>
            <span className="text-jules-border">•</span>
            <span>Real-time collaboration</span>
            <span className="text-jules-border">•</span>
            <span>Open-source friendly</span>
          </p>
        </div>
      </section>

      {/* 🧠 PROBLEM SECTION */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center relative mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-jules-primary">
            Coding is easier <br /> when you’re not alone.
          </h2>

          <div className="bg-jules-surface border border-jules-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <p className="text-xl md:text-2xl font-medium mb-8 text-jules-pink">
              Learning to code is one thing. <br />
              Building real projects with other people is another.
            </p>

            <p className="text-jules-primary/70 mb-8 max-w-2xl mx-auto">
              Students often struggle to find reliable collaborators, coordinate group projects, gain real-world development experience, and move beyond tutorials.
            </p>

            <div className="inline-block bg-jules-bg border border-jules-border px-6 py-3 rounded-xl">
              <p className="font-bold text-jules-accent">
                TechConnect exists to make collaboration simple, structured, and effective.
              </p>
            </div>

            <motion.img
              src="https://jules.google/squid.png"
              alt="Squid"
              className="absolute -bottom-10 -right-10 w-24 h-24 opacity-50 rotate-12"
            />
          </div>
        </motion.div>
      </section>

      {/* 🟢 SOLUTION SECTION */}
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
          <div className="bg-jules-surface border border-jules-border p-8 rounded-2xl hover:border-jules-accent/50 transition-colors group">
            <div className="w-12 h-12 bg-jules-bg rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Collaborate in real time</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">
              Work on the same codebase together and see changes instantly, just like Google Docs for code.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-jules-surface border border-jules-border p-8 rounded-2xl hover:border-jules-accent/50 transition-colors group">
            <div className="w-12 h-12 bg-jules-bg rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Learn by building</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">
              Gain practical experience by working on real projects instead of following isolated tutorials.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-jules-surface border border-jules-border p-8 rounded-2xl hover:border-jules-accent/50 transition-colors group">
            <div className="w-12 h-12 bg-jules-bg rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Stay organized</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">
              Manage files, tasks, and discussions in one place for every project.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-jules-surface border border-jules-border p-8 rounded-2xl hover:border-jules-accent/50 transition-colors group">
            <div className="w-12 h-12 bg-jules-bg rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-jules-primary">Grow with community</h3>
            <p className="text-sm text-jules-primary/60 leading-relaxed">
              Join challenges, explore open projects, and learn alongside other student developers.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm font-bold text-jules-muted uppercase tracking-widest">
            Built to support teamwork, learning, and real-world development workflows.
          </p>
        </div>
      </section>

      <footer className="py-12 border-t border-jules-border/30 mt-20 bg-jules-bg relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-jules-muted">
          <p>© 2026 TechConnect</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-jules-primary">Twitter</a>
            <a href="#" className="hover:text-jules-primary">GitHub</a>
            <a href="#" className="hover:text-jules-primary">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
