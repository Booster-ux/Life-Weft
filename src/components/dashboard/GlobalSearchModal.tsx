"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
    Search,
    CheckSquare,
    Timer,
    BookOpen,
    GitFork,
    Library,
    Calendar,
    ArrowRight,
    X,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const { tasks, deadlines, ledgerEntries, decisions, knowledge, planner, lifeAreas } = useApp();
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery("");
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const lowerQuery = query.toLowerCase().trim();

    // Search across all data stores
    const matchedTasks = lowerQuery ? tasks.filter(t => t.title.toLowerCase().includes(lowerQuery) || t.category.toLowerCase().includes(lowerQuery)) : [];
    const matchedDeadlines = lowerQuery ? deadlines.filter(d => d.title.toLowerCase().includes(lowerQuery)) : [];
    const matchedLedger = lowerQuery ? ledgerEntries.filter(e => e.title.toLowerCase().includes(lowerQuery) || e.description.toLowerCase().includes(lowerQuery) || e.tags.some(t => t.toLowerCase().includes(lowerQuery))) : [];
    const matchedDecisions = lowerQuery ? decisions.filter(dec => dec.title.toLowerCase().includes(lowerQuery) || dec.situation.toLowerCase().includes(lowerQuery)) : [];
    const matchedKnowledge = lowerQuery ? knowledge.filter(k => k.title.toLowerCase().includes(lowerQuery) || k.content.toLowerCase().includes(lowerQuery)) : [];
    const matchedPlanner = lowerQuery ? planner.filter(p => p.title.toLowerCase().includes(lowerQuery)) : [];

    const totalResults =
        matchedTasks.length +
        matchedDeadlines.length +
        matchedLedger.length +
        matchedDecisions.length +
        matchedKnowledge.length +
        matchedPlanner.length;

    const handleNavigate = (path: string) => {
        router.push(path);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#04060b]/80 backdrop-blur-md animate-in fade-in duration-150"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
                {/* Search Input Bar */}
                <div className="flex items-center px-4 border-b border-brand-border h-14 bg-brand-surface">
                    <Search size={18} className="text-brand-muted flex-shrink-0 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search tasks, ledger timeline, deadlines, decisions, knowledge..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent text-brand-text placeholder:text-brand-muted/60 text-sm focus:outline-none border-none outline-none"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="p-1 text-brand-muted hover:text-brand-text rounded mr-2"
                        >
                            <X size={15} />
                        </button>
                    )}
                    <span className="text-[10px] bg-brand-bg px-2 py-0.5 rounded border border-brand-border text-brand-muted font-mono">
                        ESC
                    </span>
                </div>

                {/* Search Results / Suggestions */}
                <div className="p-4 overflow-y-auto flex-1 space-y-4">
                    {!query ? (
                        <div className="py-8 text-center space-y-3">
                            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                                Unified Lifeweft Search Layer
                            </p>
                            <p className="text-xs text-brand-muted/70 max-w-md mx-auto">
                                Type any keyword to search simultaneously across your tasks, personal ledger, deadlines, decisions, planner sessions, and knowledge notes.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 pt-2">
                                {["Client meeting", "Supabase", "Statistics", "Workout", "Design system"].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setQuery(suggestion)}
                                        className="text-xs bg-brand-bg hover:bg-brand-border/60 text-brand-muted hover:text-brand-text px-3 py-1 rounded-full border border-brand-border transition-colors cursor-pointer"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : totalResults === 0 ? (
                        <div className="py-12 text-center text-xs text-brand-muted">
                            No records found matching "{query}". Try checking another spelling or ask Lifeweft!
                        </div>
                    ) : (
                        <div className="space-y-4 text-xs">
                            {/* Tasks Results */}
                            {matchedTasks.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5">
                                        <CheckSquare size={12} />
                                        Tasks ({matchedTasks.length})
                                    </span>
                                    {matchedTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            onClick={() => handleNavigate("/dashboard/tasks")}
                                            className="flex items-center justify-between p-2.5 bg-brand-bg hover:bg-brand-border/40 rounded-lg border border-brand-border transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className={cn("h-2 w-2 rounded-full", task.completed ? "bg-emerald-400" : "bg-brand-blue")} />
                                                <span className={cn("text-brand-text font-medium truncate", task.completed && "line-through text-brand-muted")}>
                                                    {task.title}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-brand-muted uppercase font-semibold group-hover:text-brand-blue">
                                                {task.category}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Ledger Entries Results */}
                            {matchedLedger.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                                        <BookOpen size={12} />
                                        Personal Ledger ({matchedLedger.length})
                                    </span>
                                    {matchedLedger.map((entry) => (
                                        <div
                                            key={entry.id}
                                            onClick={() => handleNavigate("/dashboard/ledger")}
                                            className="p-2.5 bg-brand-bg hover:bg-brand-border/40 rounded-lg border border-brand-border transition-all cursor-pointer group space-y-1"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-brand-text group-hover:text-brand-gold transition-colors truncate">
                                                    {entry.title}
                                                </span>
                                                <span className="text-[10px] text-brand-muted font-mono">{entry.date}</span>
                                            </div>
                                            <p className="text-[11px] text-brand-muted line-clamp-1">{entry.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Deadlines Results */}
                            {matchedDeadlines.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Timer size={12} />
                                        Deadlines ({matchedDeadlines.length})
                                    </span>
                                    {matchedDeadlines.map((d) => (
                                        <div
                                            key={d.id}
                                            onClick={() => handleNavigate("/dashboard/deadlines")}
                                            className="flex items-center justify-between p-2.5 bg-brand-bg hover:bg-brand-border/40 rounded-lg border border-brand-border transition-all cursor-pointer group"
                                        >
                                            <span className="font-medium text-brand-text group-hover:text-rose-400 transition-colors truncate">
                                                {d.title}
                                            </span>
                                            <span className="text-[10px] text-brand-muted font-mono">{d.dueDate}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Decisions Results */}
                            {matchedDecisions.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <GitFork size={12} />
                                        Decisions ({matchedDecisions.length})
                                    </span>
                                    {matchedDecisions.map((dec) => (
                                        <div
                                            key={dec.id}
                                            onClick={() => handleNavigate("/dashboard/decisions")}
                                            className="p-2.5 bg-brand-bg hover:bg-brand-border/40 rounded-lg border border-brand-border transition-all cursor-pointer group space-y-1"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-brand-text group-hover:text-indigo-400 transition-colors truncate">
                                                    {dec.title || dec.situation}
                                                </span>
                                                <span className="text-[9px] bg-brand-surface px-1.5 py-0.5 rounded border border-brand-border text-brand-muted uppercase">
                                                    {dec.status}
                                                </span>
                                            </div>
                                            {dec.chosenOption && (
                                                <p className="text-[11px] text-brand-muted line-clamp-1">Chosen: {dec.chosenOption}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Knowledge Results */}
                            {matchedKnowledge.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Library size={12} />
                                        Knowledge Base ({matchedKnowledge.length})
                                    </span>
                                    {matchedKnowledge.map((k) => (
                                        <div
                                            key={k.id}
                                            onClick={() => handleNavigate("/dashboard/knowledge")}
                                            className="p-2.5 bg-brand-bg hover:bg-brand-border/40 rounded-lg border border-brand-border transition-all cursor-pointer group space-y-1"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-brand-text group-hover:text-teal-400 transition-colors truncate">
                                                    {k.title}
                                                </span>
                                                <span className="text-[10px] text-brand-muted">{k.category}</span>
                                            </div>
                                            <p className="text-[11px] text-brand-muted line-clamp-1">{k.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Planner Results */}
                            {matchedPlanner.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        Planner Sessions ({matchedPlanner.length})
                                    </span>
                                    {matchedPlanner.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => handleNavigate("/dashboard/planner")}
                                            className="flex items-center justify-between p-2.5 bg-brand-bg hover:bg-brand-border/40 rounded-lg border border-brand-border transition-all cursor-pointer group"
                                        >
                                            <span className="font-medium text-brand-text truncate">{p.title}</span>
                                            <span className="text-[10px] text-brand-muted font-mono">{p.day} • {p.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Quick Link to Ask Lifeweft */}
                <div className="p-3 bg-brand-bg/80 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
                    <div className="flex items-center gap-2">
                        <Sparkles size={13} className="text-brand-gold" />
                        <span>Need intelligent answers across your records?</span>
                    </div>
                    <button
                        onClick={() => handleNavigate("/dashboard/ask")}
                        className="text-brand-blue font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                        Ask Lifeweft <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};
