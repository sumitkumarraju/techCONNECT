"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import Editor, { OnChange } from '@monaco-editor/react';
import io, { Socket } from 'socket.io-client';
import Link from 'next/link';

let socket: Socket;

interface Version {
  code: string;
  timestamp: string;
  _id: string;
}

export default function ProjectEditor() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [code, setCode] = useState('// Loading...');
  const [project, setProject] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<Version[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (id && token) {
      fetchProject();
      initSocket();
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [id, token]);

  const initSocket = async () => {
    await fetch('/api/socket'); // Ensure socket endpoint is hit (optional if using custom server directly)
    socket = io(); // Connects to the same host

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('join-project', id);
    });

    socket.on('code-update', (newCode: string) => {
      isRemoteUpdate.current = true;
      setCode(newCode);
    });
  };

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setCode(data.code || '// Start coding...');
        if (data.versionHistory) {
             setHistory(data.versionHistory);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditorChange: OnChange = (value, event) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    const newCode = value || '';
    setCode(newCode);
    socket.emit('code-change', { projectId: id, code: newCode });
  };

  const saveCode = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.versionHistory);
        alert('Saved successfully!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const restoreVersion = (versionCode: string) => {
      if(confirm("Are you sure? This will overwrite your current editor content.")) {
          setCode(versionCode);
          socket.emit('code-change', { projectId: id, code: versionCode });
          setShowHistory(false);
      }
  }

  if (!project) return <div className="p-8">Loading Project...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="text-lg font-bold">{project.title}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            {showHistory ? 'Hide History' : 'History'}
          </button>
          <button
            onClick={saveCode}
            disabled={saving}
            className="px-4 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-bold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
            />
        </div>

        {showHistory && (
            <div className="w-64 bg-gray-800 border-l border-gray-700 overflow-y-auto p-4">
                <h3 className="text-sm font-bold text-gray-400 mb-4">Version History</h3>
                <div className="space-y-3">
                    {history.slice().reverse().map((ver, idx) => (
                        <div key={ver._id || idx} className="p-3 bg-gray-700 rounded text-sm">
                            <div className="text-xs text-gray-400 mb-1">
                                {new Date(ver.timestamp).toLocaleString()}
                            </div>
                            <button
                                onClick={() => restoreVersion(ver.code)}
                                className="text-indigo-400 hover:text-indigo-300 text-xs"
                            >
                                Restore this version
                            </button>
                        </div>
                    ))}
                    {history.length === 0 && <p className="text-gray-500 text-xs">No saved versions yet.</p>}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
