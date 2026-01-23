"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import socket from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import OnlineUsers from "@/components/OnlineUsers";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id: projectId } = params;
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [project, setProject] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'code'>('tasks');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    // Fetch Initial Data
    API.get(`/projects/${projectId}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err));

    API.get(`/projects/${projectId}/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));

    API.get(`/projects/${projectId}/messages`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    // Socket Connection
    socket.connect();
    socket.emit("join-project", {
      projectId,
      user: { username: user.username, name: user.name, _id: user._id }
    });

    // Listeners
    socket.on("receive-message", (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("task-sync", (updatedTask) => {
      setTasks(prev => {
        // Check if task exists, if so update it, else add it
        const exists = prev.find((t: any) => t._id === updatedTask._id);
        if (exists) {
          return prev.map((t: any) => t._id === updatedTask._id ? updatedTask : t);
        } else {
          return [updatedTask, ...prev];
        }
      });
    });

    return () => {
      socket.off("receive-message");
      socket.off("online-users");
      socket.off("task-sync");
      socket.disconnect();
    };
  }, [projectId, user]);

  const sendMessage = async () => {
    if (!chatText.trim()) return;

    const payload = {
      projectId,
      message: {
        content: chatText,
        senderId: { _id: user._id, username: user.username, name: user.name }
      }
    };

    setMessages(prev => [...prev, { ...payload.message, createdAt: new Date().toISOString() }]);
    setChatText("");

    try {
      await API.post(`/projects/${projectId}/messages`, { content: payload.message.content });
      socket.emit("send-message", payload);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const createTask = async () => {
    if (!taskTitle.trim()) return;
    try {
      const { data } = await API.post(`/projects/${projectId}/tasks`, { title: taskTitle });
      setTasks([data, ...tasks]);
      setTaskTitle("");

      socket.emit("task-updated", { projectId, task: data });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask = async (task: any) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    // Optimistic update
    const updatedTask = { ...task, status: newStatus };
    setTasks(prev => prev.map((t: any) => t._id === task._id ? updatedTask : t));

    try {
      const { data } = await API.put(`/tasks/${task._id}`, { status: newStatus });
      socket.emit("task-updated", { projectId, task: data });
    } catch (error) {
      console.error("Failed to toggle task", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">

      {/* LEFT PANEL: Tasks & Code Switcher */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#27272a]">
        <div className="h-14 border-b border-[#27272a] flex items-center justify-between px-6 bg-[#0c0c0e]">
          <h1 className="font-bold text-lg truncate pr-4">{project?.name || 'Loading...'}</h1>
          <div className="flex gap-2 bg-[#18181b] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'tasks' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'code' ? 'bg-blue-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Code Editor <span className="text-[9px] bg-red-500 text-white px-1 rounded ml-1 animate-pulse">LIVE</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'tasks' ? (
            <div className="h-full p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <div className="flex gap-2 mb-8">
                  <input
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="flex-1 bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Add a new task..."
                    onKeyDown={(e) => e.key === 'Enter' && createTask()}
                  />
                  <button onClick={createTask} className="bg-blue-600 hover:bg-blue-500 px-6 rounded-xl text-sm font-bold transition-colors">
                    Add
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.map((t: any) => (
                    <div key={t._id} className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] flex justify-between items-center group hover:border-zinc-700 transition-all">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTask(t)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${t.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600 hover:border-zinc-500'}`}
                        >
                          {t.status === 'done' && <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </button>
                        <span className={`text-sm ${t.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>{t.title}</span>
                      </div>
                      <span className={`text-[10px] uppercase px-2 py-1 rounded font-bold ${t.status === 'done' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                  {tasks.length === 0 && <div className="text-center py-12 text-zinc-500">No tasks yet. Create one above!</div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full p-4 bg-[#1e1e1e]">
              <CodeEditor projectId={projectId} />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Chat & Online Users */}
      <div className="w-80 flex flex-col border-l border-[#27272a] bg-[#0c0c0e]">
        <div className="h-14 border-b border-[#27272a] flex items-center justify-between px-4 bg-[#0c0c0e]">
          <span className="font-bold text-sm text-zinc-400">Team Chat</span>
          <OnlineUsers users={onlineUsers} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m: any, i) => {
            const isMe = m.senderId?._id === user._id || m.senderId === user._id;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#18181b] border border-[#27272a] text-zinc-200 rounded-bl-none'
                  }`}>
                  {!isMe && <p className="text-[10px] text-zinc-500 mb-1 font-bold">{m.senderId?.username || 'User'}</p>}
                  <p>{m.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[#27272a] bg-[#09090b]">
          <input
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-600"
            placeholder="Type a message..."
          />
        </div>
      </div>

    </div>
  );
}
