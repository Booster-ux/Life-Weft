"use client";

import React, { useState } from "react";
import { useApp, KnowledgeItem } from "@/context/AppContext";
import {
    Search,
    Plus,
    BookOpen,
    Trash2,
    Calendar,
    Folder,
    Tag,
    Library,
    Link as LinkIcon,
    Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export default function KnowledgePage() {
    const { knowledge, addKnowledgeItem, deleteKnowledgeItem, lifeAreas } = useApp();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<KnowledgeItem["category"] | "all">("all");
    const [selectedLifeArea, setSelectedLifeArea] = useState<string>("all");

    // Modals
    const [selectedNote, setSelectedNote] = useState<KnowledgeItem | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form states
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newCategory, setNewCategory] = useState<KnowledgeItem["category"]>("Notes");
    const [newLifeArea, setNewLifeArea] = useState("area-personal");
    const [newTags, setNewTags] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const filteredKnowledge = knowledge.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesCategory = activeCategory === "all" || item.category === activeCategory;
        const matchesLifeArea = selectedLifeArea === "all" || item.lifeAreaId === selectedLifeArea;

        return matchesSearch && matchesCategory && matchesLifeArea;
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        addKnowledgeItem({
            title: newTitle.trim(),
            content: newContent.trim(),
            category: newCategory,
            lifeAreaId: newLifeArea,
            tags: newTags ? newTags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
            url: newUrl.trim() || undefined,
        });

        setNewTitle("");
        setNewContent("");
        setNewTags("");
        setNewUrl("");
        setIsCreateModalOpen(false);
    };

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <Library className="text-teal-400" />
                        Knowledge Base
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Organize curated references, code snippets, notes, and web resources.
                    </p>
                </div>

                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    variant="primary"
                    size="sm"
                    className="font-bold flex items-center gap-1.5"
                >
                    <Plus size={16} />
                    New Knowledge Document
                </Button>
            </div>

            {/* Search & Life Area Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                        <Search size={15} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search your notes, reference manuals, tags, or brain dumps..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg pl-10 pr-4 py-2.5 text-xs placeholder:text-brand-muted/70 focus:border-brand-blue outline-none transition-all"
                    />
                </div>

                <div>
                    <select
                        value={selectedLifeArea}
                        onChange={(e) => setSelectedLifeArea(e.target.value)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-xs focus:border-brand-blue outline-none cursor-pointer"
                    >
                        <option value="all">All Life Areas</option>
                        {lifeAreas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.name} Area
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none border-b border-brand-border/40">
                {[
                    { id: "all", label: "All Items" },
                    { id: "Notes", label: "Notes" },
                    { id: "Important Information", label: "Important Info" },
                    { id: "Ideas", label: "Ideas" },
                    { id: "References", label: "References" },
                    { id: "Saved Items", label: "Saved Items" },
                ].map((tab) => {
                    const isActive = activeCategory === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveCategory(tab.id as KnowledgeItem["category"] | "all")}
                            className={cn(
                                "py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border cursor-pointer",
                                isActive
                                    ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                                    : "bg-brand-surface text-brand-muted hover:text-brand-text border-brand-border"
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Knowledge Cards Grid */}
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
                            className="bg-brand-surface border border-brand-border hover:border-brand-blue/30 rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-sm relative overflow-hidden"
                        >
                            <div>
                                <div className="flex justify-between items-start gap-4 mb-2.5">
                                    <span className={cn("px-2 py-0.5 text-[9px] rounded border font-semibold", getCategoryColor(item.category))}>
                                        {item.category}
                                    </span>

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

                                <p className="text-xs text-brand-muted mt-2 line-clamp-3 leading-relaxed whitespace-pre-wrap select-text">
                                    {item.content}
                                </p>
                            </div>

                            {/* Tags & Footer */}
                            <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center justify-between text-[10px] text-brand-muted">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={10} />
                                    <span>{item.createdAt}</span>
                                </div>

                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex gap-1">
                                        {item.tags.slice(0, 2).map((t, idx) => (
                                            <span key={idx} className="bg-brand-bg px-1.5 py-0.2 rounded border border-brand-border/60">
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Note Reader Modal */}
            <Modal
                isOpen={selectedNote !== null}
                onClose={() => setSelectedNote(null)}
                title={selectedNote?.title || "Knowledge Document"}
            >
                {selectedNote && (
                    <div className="space-y-4 font-sans select-text">
                        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-brand-border/40">
                            <span className={cn("px-2 py-0.5 rounded border font-bold uppercase tracking-wide", getCategoryColor(selectedNote.category))}>
                                {selectedNote.category}
                            </span>
                            <span className="text-brand-muted">
                                Recorded: {selectedNote.createdAt}
                            </span>
                        </div>

                        <div className="bg-brand-bg/60 border border-brand-border/60 rounded-lg p-4 font-mono text-xs text-brand-text leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto">
                            {selectedNote.content}
                        </div>

                        {selectedNote.url && (
                            <div className="flex items-center gap-2 text-xs text-brand-blue">
                                <LinkIcon size={13} />
                                <a href={selectedNote.url} target="_blank" rel="noreferrer" className="hover:underline truncate">
                                    {selectedNote.url}
                                </a>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button onClick={() => setSelectedNote(null)} variant="secondary" size="sm">
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create Knowledge Document Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create Knowledge Document"
            >
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Document Title</label>
                        <input
                            type="text"
                            placeholder="e.g. System Design Architecture Specs"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Category</label>
                            <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value as KnowledgeItem["category"])}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                <option value="Notes">Notes (Quick write ups)</option>
                                <option value="Important Information">Important Info (Gatecodes, IPs)</option>
                                <option value="Ideas">Ideas (Scattered inspiration)</option>
                                <option value="References">References (Manuals, Guides)</option>
                                <option value="Saved Items">Saved Items (Web highlights)</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Life Area</label>
                            <select
                                value={newLifeArea}
                                onChange={(e) => setNewLifeArea(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                {lifeAreas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Content / Notes</label>
                        <textarea
                            rows={5}
                            placeholder="Type or paste content here..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg p-3 text-xs focus:border-brand-blue outline-none resize-none font-mono"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Tags (Comma-separated)</label>
                            <input
                                type="text"
                                placeholder="Docs, Architecture, API"
                                value={newTags}
                                onChange={(e) => setNewTags(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Reference URL (Optional)</label>
                            <input
                                type="url"
                                placeholder="https://example.com/docs"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-brand-border/40">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" className="font-semibold">
                            Save Document
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
