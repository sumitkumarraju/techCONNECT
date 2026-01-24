"use client";

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import socket from "@/lib/socket";

interface CodeEditorProps {
    file: any;
    onCodeChange: (value: string) => void;
    onSave?: () => void;
}

export interface CodeEditorHandle {
    insertCode: (text: string) => void;
}

const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(({ file, onCodeChange, onSave }, ref) => {
    const editorRef = useRef<any>(null);
    const isRemoteUpdate = useRef(false);

    useImperativeHandle(ref, () => ({
        insertCode: (text: string) => {
            if (editorRef.current) {
                const editor = editorRef.current;
                const selection = editor.getSelection();
                // const id = { major: 1, minor: 1 }; // Not strictly needed for executeEdits
                const op = { range: selection, text: text, forceMoveMarkers: true };
                editor.executeEdits("my-source", [op]);
                editor.focus();
            }
        }
    }));

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Custom Keybinding for Ctrl+S / Cmd+S
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            if (onSave) {
                onSave();
            }
        });

        // Listen for code updates from other users
        socket.on("code-update", ({ fileId, content }: { fileId: string; content: string }) => {
            // Only update if this event is for the CURRENTLY open file
            if (fileId === file._id) {
                if (content !== editor.getValue()) {
                    isRemoteUpdate.current = true;
                    const position = editor.getPosition();
                    editor.setValue(content);
                    if (position) editor.setPosition(position);
                    isRemoteUpdate.current = false;
                }
            }
        });
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            // 1. Update Parent State (for saving etc)
            onCodeChange(value);

            // 2. Emit to Socket (if not a remote update)
            if (!isRemoteUpdate.current && file) {
                socket.emit("code-change", {
                    projectId: file.projectId,
                    fileId: file._id,
                    content: value
                });
            }
        }
    };

    // Update editor content when file changes (switching files)
    useEffect(() => {
        if (editorRef.current && file) {
            // Unsubscribe from previous file updates (handled by parent joining/leaving rooms ideally, 
            // but here we just ensure we listen. Actually socket.on is global.
            // We should cleanup on unmount.

            // Inform server we opened this file
            socket.emit("file-open", {
                projectId: file.projectId,
                fileId: file._id
            });

            const currentContent = editorRef.current.getValue();
            if (currentContent !== file.content) {
                isRemoteUpdate.current = true;
                editorRef.current.setValue(file.content || "");
                isRemoteUpdate.current = false;
            }
        }
    }, [file?._id]); // Only reset when ID changes

    useEffect(() => {
        return () => {
            socket.off("code-update");
        };
    }, []);

    if (!file) {
        return (
            <div className="h-full flex items-center justify-center text-zinc-500 bg-[#1e1e1e] border border-zinc-800 rounded-xl">
                <div className="text-center">
                    <p>Select a file to start editing</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#1e1e1e] flex flex-col">
            <div className="bg-[#252526] px-4 py-2 flex items-center gap-2 border-b border-zinc-800 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <span className="text-xs text-zinc-400 ml-2 font-mono">{file.name}</span>
            </div>
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={file.language || 'javascript'}
                    // value={file.content} // Controlled value from parent potentially? No, using setValue. 
                    // Actually, if we pass `value` prop, it becomes controlled. 
                    // To use setValue manually, better to use `defaultValue` or let `useEffect` handle it.
                    // But Monaco `value` prop is safe if we ignore echo.
                    // Let's remove `value` prop to avoid conflict with setValue? 
                    // No, `value={file.content}` ensures initial load.
                    // But for real-time, `setValue` is better.
                    // I will use `defaultValue` + `useEffect` (above) for file switching.
                    // Removing `value` prop to let `setValue` take full control.
                    defaultValue={file.content}
                    theme="vs-dark"
                    onMount={handleEditorDidMount}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16, bottom: 16 },
                        fontFamily: "JetBrains Mono, monospace",
                        automaticLayout: true
                    }}
                />
            </div>
        </div>
    );
});

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
