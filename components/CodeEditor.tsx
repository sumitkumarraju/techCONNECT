"use client";

import React, { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import socket from "@/lib/socket";

interface CodeEditorProps {
    projectId: string;
}

export default function CodeEditor({ projectId }: CodeEditorProps) {
    const editorRef = useRef<any>(null);
    const isLocalChange = useRef(false);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Listen for code updates from other users
        socket.on("code-update", (code: string) => {
            if (code !== editor.getValue()) {
                isLocalChange.current = true; // Prevent loop
                const position = editor.getPosition();
                editor.setValue(code);
                editor.setPosition(position || { lineNumber: 1, column: 1 });
                isLocalChange.current = false;
            }
        });
    };

    const handleEditorChange = (value: string | undefined) => {
        if (!isLocalChange.current) {
            socket.emit("code-change", {
                projectId,
                code: value
            });
        }
    };

    useEffect(() => {
        return () => {
            socket.off("code-update");
        };
    }, []);

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#1e1e1e]">
            <div className="bg-[#252526] px-4 py-2 flex items-center gap-2 border-b border-zinc-800">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <span className="text-xs text-zinc-400 ml-2 font-mono">main.js</span>
            </div>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                defaultValue="// Start collaborating..."
                theme="vs-dark"
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: "JetBrains Mono, monospace"
                }}
            />
        </div>
    );
}
