"use client";
import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
        fill="#00AA45"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#219653"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z"
        fill="#24292E"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 11H29.0769C36.2141 11 42 16.5716 42 23.4444C42 30.3173 36.2141 35.8889 29.0769 35.8889H25.3846V43H18V11ZM25.3846 28.7778H29.0769C32.1357 28.7778 34.6154 26.39 34.6154 23.4444C34.6154 20.4989 32.1357 18.1111 29.0769 18.1111H25.3846V28.7778Z"
        fill="white"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 10H29.0769C36.7305 10 43 15.984 43 23.4444C43 30.9048 36.7305 36.8889 29.0769 36.8889H26.3846V44H17V10ZM19 12V42H24.3846V34.8889H29.0769C35.6978 34.8889 41 29.7298 41 23.4444C41 17.1591 35.6978 12 29.0769 12H19ZM24.3846 17.1111H29.0769C32.6521 17.1111 35.6154 19.9114 35.6154 23.4444C35.6154 26.9775 32.6521 29.7778 29.0769 29.7778H24.3846V17.1111ZM26.3846 19.1111V27.7778H29.0769C31.6194 27.7778 33.6154 25.8024 33.6154 23.4444C33.6154 21.0864 31.6194 19.1111 29.0769 19.1111H26.3846Z"
        fill="#24292E"
      ></path>
    </svg>
  );
};

export default function Home() {
  return (
    <div className="bg-jules-bg text-jules-text font-sans antialiased">
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-jules-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-jules-text flex items-center justify-center text-jules-bg font-bold text-xs font-mono">
              &lt;/&gt;
            </div>
            <span className="font-medium text-lg tracking-tight">TechConnect</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-jules-muted">
            <a href="/dashboard" className="hover:text-jules-text transition-colors">Dashboard</a>
            <a href="/challenges" className="hover:text-jules-text transition-colors">Challenges</a>
            <a href="/community" className="hover:text-jules-text transition-colors">Community</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium hover:text-white transition-colors">Log in</a>
            <a
              href="/register"
              className="bg-jules-primary text-black text-sm font-medium px-5 py-2 rounded-full hover:bg-white transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              Sign up
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-hero-glow pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="fade-in inline-flex items-center gap-2 px-3 py-1 rounded-full border border-jules-border bg-jules-surface/50 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-mono text-jules-muted uppercase tracking-wider">
              v1.0 Live Beta
            </span>
          </div>

          <h1 className="fade-in delay-100 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
            Code together.
            <br />
            <span className="text-jules-muted">Build the future.</span>
          </h1>

          <p className="fade-in delay-200 text-lg md:text-xl text-jules-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            The collaborative platform for students to build projects, solve challenges, and ship code in real-time. Powered by community.
          </p>

          <div className="fade-in delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="/register"
              className="bg-jules-primary text-black font-medium px-8 py-3.5 rounded-full hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Start Coding
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </a>
            <a
              href="https://github.com"
              className="bg-transparent border border-jules-border text-jules-text font-medium px-8 py-3.5 rounded-full hover:bg-jules-surface transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        {/* Macbook Scroll Component Integration */}
        <div className="overflow-hidden w-full bg-jules-bg">
          <MacbookScroll
            title={
              <span className="text-4xl md:text-5xl font-bold dark:text-white text-neutral-800">
                Ship projects faster. <br /> No kidding.
              </span>
            }
            badge={
              <a href="https://peerlist.io/manuarora">
                <Badge className="h-10 w-10 -rotate-12 transform" />
              </a>
            }
            src={`/linear.webp`}
            showGradient={true}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-32">
          <h2 className="text-3xl font-semibold mb-12">
            Everything you need to <span className="text-jules-accent">ship projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-8 rounded-3xl bg-jules-surface border border-jules-border hover:border-jules-muted/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#2c2c2c] flex items-center justify-center mb-6 text-jules-text group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Live Collaboration</h3>
              <p className="text-jules-muted leading-relaxed">
                Multi-user code editors with instant cursor tracking. Works exactly like Google Docs, but for IDEs.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-jules-surface border border-jules-border hover:border-jules-muted/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#2c2c2c] flex items-center justify-center mb-6 text-jules-text group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Project Hubs</h3>
              <p className="text-jules-muted leading-relaxed">
                Create task boards, manage sprints, and document APIs. Integrated discussion forums for every repo.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-jules-surface border border-jules-border hover:border-jules-muted/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#2c2c2c] flex items-center justify-center mb-6 text-jules-text group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Global Leaderboards</h3>
              <p className="text-jules-muted leading-relaxed">
                Compete in daily coding challenges. Earn badges and climb the ranks to showcase your skills to recruiters.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 bg-jules-bg">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-medium text-lg tracking-tight">TechConnect</span>
            <span className="text-jules-muted text-sm ml-2">© 2026</span>
          </div>
          <div className="flex gap-8 text-sm text-jules-muted">
            <a href="#" className="hover:text-jules-text">Privacy</a>
            <a href="#" className="hover:text-jules-text">Terms</a>
            <a href="#" className="hover:text-jules-text">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
