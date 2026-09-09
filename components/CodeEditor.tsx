"use client";

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import socket from "@/lib/socket";

export interface ProjectFile {
    _id?: string;
    projectId?: string;
    name: string;
    content: string;
    language?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface CodeEditorProps {
    file: ProjectFile | null;
    onCodeChange: (value: string) => void;
    onSave?: () => void;
    readOnly?: boolean;
}

export interface CodeEditorHandle {
    insertCode: (text: string) => void;
}

const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(({ file, onCodeChange, onSave, readOnly = false }, ref) => {
    // any is needed for standalone monaco editor ref unless we import full monaco types which we don't have
    const editorRef = useRef<any>(null);
    const isRemoteUpdate = useRef(false);

    useImperativeHandle(ref, () => ({
        insertCode: (text: string) => {
            if (editorRef.current) {
                const editor = editorRef.current;
                const selection = editor.getSelection();
                if (selection) {
                    const op = { range: selection, text: text, forceMoveMarkers: true };
                    editor.executeEdits("my-source", [op]);
                    editor.focus();
                }
            }
        }
    }));

    const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
        editorRef.current = editor;

        // Custom Keybinding for Ctrl+S / Cmd+S
        editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
            if (onSave) {
                onSave();
            }
        });

        // Emit Cursor Position
        editor.onDidChangeCursorPosition((e: any) => {
            if (file && file.projectId) {
                socket.emit("cursor-move", {
                    projectId: file.projectId,
                    cursor: {
                        line: e.position.lineNumber,
                        column: e.position.column,
                    },
                });
            }
        });

        // Listen for remote cursors
        socket.on("cursor-update", ({ socketId, cursor }: any) => {
            const model = editor.getModel();
            if (model) {
                monacoInstance.editor.setModelMarkers(model, `cursor-${socketId}`, [
                    {
                        startLineNumber: cursor.line,
                        startColumn: cursor.column,
                        endLineNumber: cursor.line,
                        endColumn: cursor.column + 1,
                        message: `User ${socketId.substring(0, 4)}`,
                        severity: monacoInstance.MarkerSeverity.Info,
                    },
                ]);
            }
        });

        // Listen for code updates from other users
        socket.on("code-update", ({ fileId, content }: { fileId: string; content: string }) => {
            if (file && file._id && fileId === file._id) {
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
            onCodeChange(value);

            if (!isRemoteUpdate.current && file && file.projectId && file._id) {
                socket.emit("code-change", {
                    projectId: file.projectId,
                    fileId: file._id,
                    content: value
                });
            }
        }
    };

    useEffect(() => {
        if (editorRef.current && file && file._id && file.projectId) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file?._id]);

    useEffect(() => {
        return () => {
            socket.off("code-update");
            socket.off("cursor-update");
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
                {readOnly && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        View Only
                    </span>
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={file.language || 'javascript'}
                    defaultValue={file.content}
                    theme="vs-dark"
                    onMount={handleEditorDidMount}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16, bottom: 16 },
                        fontFamily: "JetBrains Mono, monospace",
                        automaticLayout: true,
                        readOnly: readOnly,
                        domReadOnly: readOnly
                    }}
                />
            </div>
        </div>
    );
});

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
