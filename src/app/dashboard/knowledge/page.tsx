"use client";

import React, { useState } from "react";
import { useApp, KnowledgeItem } from "@/context/AppContext";
import { Search, Plus, BookOpen, Trash2, Calendar, Folder, Tag, Library } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function KnowledgePage() {
    const { knowledge, deleteKnowledgeItem } = useApp();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<KnowledgeItem["category"] | "all">("all");

    // Local reading modal states for notes
    const [selectedNote, setSelectedNote] = useState<KnowledgeItem | null>(null);

    const handleOpenAddNote = () => {
        window.dispatchEvent(new Event("dd-open-note-modal"));
    };

    const filteredKnowledge = knowledge.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (cat: KnowledgeItem["category"]) => {
        switch (cat) {
            case "Notes":
                return "text-indigo-400 bg-indigo-950/20 border-indigo-900/30";
            case "Important Information":
                return "text-rose-400 bg-rose-950/20 border-rose-900/30";
            case "Ideas":
                return "text-brand-gold bg-brand-gold/10 border-brand-gold/20";
            case "References":
                return "text-brand-blue bg-brand-blue/10 border-brand-blue/20";
            default:
                return "text-teal-400 bg-teal-950/20 border-teal-900/30";
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <Library className="text-brand-blue" />
                        Knowledge Base
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Keep useful references, system passwords, brain dumps, and gate codes organized.
                    </p>
                </div>
                <Button onClick={handleOpenAddNote} variant="primary" size="sm" className="font-bold flex items-center gap-1">
                    <Plus size={16} />
                    Create File
                </Button>
            </div>

            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Search size={16} />
                </div>
                <input
                    type="text"
                    placeholder="Search your notes, reference manuals, or brain dumps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-brand-muted/70 focus:border-brand-blue outline-none transition-all"
                />
            </div>

            {/* Category selector Tab pills */}
            <div className="flex overflow-x-auto gap-2.5 pb-2 scrollbar-thin">
                {([
                    { id: "all", label: "All Items" },
                    { id: "Notes", label: "Notes" },
                    { id: "Important Information", label: "Important Info" },
                    { id: "Ideas", label: "Ideas" },
                    { id: "References", label: "References" },
                    { id: "Saved Items", label: "Saved Items" },
                ] as const).map((tab) => {
                    const isActive = activeCategory === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveCategory(tab.id as any)}
                            className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border cursor-pointer ${isActive
                                    ? "bg-brand-blue text-white border-brand-blue"
                                    : "bg-brand-surface text-brand-muted hover:text-brand-text border-brand-border"
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Notes Grid */}
            {filteredKnowledge.length === 0 ? (
                <div className="text-center p-12 bg-brand-surface/30 border border-dashed border-brand-border rounded-xl">
                    <Folder className="mx-auto text-brand-muted mb-3" size={32} />
                    <p className="text-xs text-brand-muted">No knowledge entries match your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredKnowledge.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedNote(item)}
                            className="bg-brand-surface border border-brand-border hover:border-brand-blue/20 rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-sm relative overflow-hidden"
                        >
                            <div>
                                {/* Meta details Header */}
                                <div className="flex justify-between items-start gap-4 mb-2.5">
                                    <span className={`px-2 py-0.5 text-[9px] rounded border font-semibold ${getCategoryColor(item.category)}`}>
                                        {item.category}
                                    </span>

                                    {/* Cancel trash button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteKnowledgeItem(item.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-brand-muted hover:text-red-400 hover:bg-brand-border/40 rounded transition-all cursor-pointer"
                                        title="Remove item"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                <h3 className="font-bold text-sm text-white group-hover:text-brand-blue transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-brand-muted mt-2 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                                    {item.content}
                                </p>
                            </div>

                            {/* Note Footer */}
                            <div className="mt-4 pt-3.5 border-t border-brand-border/40 flex items-center text-[10px] text-brand-muted gap-1">
                                <Calendar size={10} />
                                <span>Added: {item.createdAt}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* -------------------- DYNAMIC DETAIL NOTE VIEWER MODAL -------------------- */}
            <Modal
                isOpen={selectedNote !== null}
                onClose={() => setSelectedNote(null)}
                title={selectedNote?.title || "Knowledge File Viewer"}
            >
                {selectedNote && (
                    <div className="space-y-4 font-sans select-text">
                        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-brand-border/40">
                            <span className={`px-2 py-0.5 rounded border font-bold uppercase tracking-wide ${getCategoryColor(selectedNote.category)}`}>
                                {selectedNote.category}
                            </span>
                            <span className="text-brand-muted">
                                Created: {selectedNote.createdAt}
                            </span>
                        </div>

                        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Content</p>
                        <div className="bg-brand-bg/50 border border-brand-border/60 rounded-lg p-4 font-mono text-xs text-brand-text leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                            {selectedNote.content}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={() => setSelectedNote(null)} variant="secondary" size="sm">
                                Close Viewer
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
