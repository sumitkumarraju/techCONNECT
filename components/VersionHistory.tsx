import React from 'react';

interface VersionHistoryProps {
    versions: any[];
    isLoading: boolean;
    onRestore: (versionId: string) => void;
    onPreview: (content: string) => void;
    activeVersionId: string | null;
}

export default function VersionHistory({ versions, isLoading, onRestore, onPreview, activeVersionId }: VersionHistoryProps) {
    if (isLoading) return <div className="p-4 text-xs text-gray-500 text-center">Loading versions...</div>;

    if (versions.length === 0) {
        return <div className="p-4 text-xs text-gray-500 text-center italic">No saved versions yet.</div>;
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-3 border-b border-[#2b2b2b]">
                <h3 className="text-xs font-bold text-gray-400 uppercase">Snapshot History</h3>
            </div>
            {versions.map((v, i) => (
                <div
                    key={v._id}
                    className={`p-3 border-b border-[#2b2b2b] hover:bg-[#2a2d2e] group transition-colors flex flex-col gap-1 cursor-pointer ${activeVersionId === v._id ? 'bg-[#37373d]' : ''}`}
                    onClick={() => onPreview(v.content)}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                                {v.createdBy?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="text-xs font-bold text-gray-300">
                                {v.createdBy?.username || "Unknown"}
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                            {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <div className="text-[10px] text-gray-500 pl-7">
                        {new Date(v.createdAt).toLocaleDateString()}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Restore this version? current changes will be overwritten.")) {
                                onRestore(v._id);
                            }
                        }}
                        className="text-[10px] text-blue-400 hover:underline self-end opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Rollback to here
                    </button>
                </div>
            ))}
        </div>
    );
}
