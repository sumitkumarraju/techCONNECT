import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col text-center">
        <h1 className="text-6xl font-bold mb-8">TechConnect</h1>
        <p className="text-xl mb-12 max-w-2xl">
          A Collaborative Platform for Students to Share, Learn, and Code Together.
          Real-time coding, project management, and more.
        </p>
        <div className="flex gap-4">
          <Link href="/login" className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-8 py-3 bg-indigo-800 text-white font-bold rounded-lg hover:bg-indigo-900 transition-colors border border-indigo-400">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
