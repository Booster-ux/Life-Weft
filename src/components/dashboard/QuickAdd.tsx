"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
    Plus,
    Tag,
    Clock,
    AlertTriangle,
    CheckSquare,
    BookOpen,
    Library,
    Timer,
    GitFork,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface QuickAddProps {
    onOpenQuickCaptureModal?: (type?: "task" | "ledger" | "note" | "deadline" | "decision") => void;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ onOpenQuickCaptureModal }) => {
    const { addTask, addLedgerEntry, lifeAreas, ledgers } = useApp();
    const [title, setTitle] = useState("");
    const [quickMode, setQuickMode] = useState<"task" | "ledger">("task");
    const [priority, setPriority] = useState<"high" | "normal" | "low">("normal");
    const [selectedLifeArea, setSelectedLifeArea] = useState<string>("area-personal");
    const [time, setTime] = useState<"Morning" | "Afternoon" | "Evening" | undefined>("Morning");
    const [showOptions, setShowOptions] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const clean = title.trim();
        const todayStr = new Date().toISOString().split("T")[0];

        if (quickMode === "task") {
            addTask({
                title: clean,
                completed: false,
                priority,
                category: "Personal",
                time,
                dueDate: todayStr,
                lifeAreaId: selectedLifeArea,
            });
        } else {
            addLedgerEntry({
                title: clean,
                description: clean,
                date: todayStr,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                ledgerId: ledgers[0]?.id || "ldg-personal",
                lifeAreaId: selectedLifeArea,
                tags: ["QuickRecord"],
            });
        }

        setTitle("");
        setShowOptions(false);
    };

    return (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-lg shadow-black/10 space-y-3">
            {/* Header / Mode Switcher */}
            <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                    Universal Quick Capture
                </label>

                <div className="flex items-center gap-1 bg-brand-bg p-0.5 rounded-lg border border-brand-border text-xs">
                    <button
                        type="button"
                        onClick={() => setQuickMode("task")}
                        className={cn(
                            "px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer",
                            quickMode === "task"
                                ? "bg-brand-blue text-white"
                                : "text-brand-muted hover:text-brand-text"
                        )}
                    >
                        Task
                    </button>
                    <button
                        type="button"
                        onClick={() => setQuickMode("ledger")}
                        className={cn(
                            "px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer",
                            quickMode === "ledger"
                                ? "bg-brand-gold text-black font-bold"
                                : "text-brand-muted hover:text-brand-text"
                        )}
                    >
                        Ledger Record
                    </button>
                </div>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder={
                            quickMode === "task"
                                ? "What do you need to do today?"
                                : "What happened? (e.g. Met client, completed final draft...)"
                        }
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (e.target.value.length > 0 && !showOptions) {
                                setShowOptions(true);
                            }
                        }}
                        className="flex-1 bg-brand-bg text-brand-text border border-brand-border rounded-lg px-4 py-2.5 text-xs sm:text-sm placeholder:text-brand-muted/70 transition-all font-sans focus:border-brand-blue outline-none"
                    />
                    <Button type="submit" variant="primary" className="py-2.5 px-4 font-bold flex-shrink-0">
                        <Plus size={16} />
                        <span className="hidden sm:inline">Capture</span>
                    </Button>
                </div>

                {/* Expansion options when typing */}
                {showOptions && (
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-brand-border/40 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Life Area */}
                        <div className="flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-md border border-brand-border">
                            <Tag size={12} className="text-brand-blue" />
                            <select
                                value={selectedLifeArea}
                                onChange={(e) => setSelectedLifeArea(e.target.value)}
                                className="bg-transparent text-brand-muted hover:text-brand-text cursor-pointer focus:outline-none border-none outline-none font-medium py-0.5 text-xs"
                            >
                                {lifeAreas.map((area) => (
                                    <option key={area.id} value={area.id} className="bg-brand-surface text-brand-text">
                                        {area.name} Area
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priority Selector for Task */}
                        {quickMode === "task" && (
                            <div className="flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-md border border-brand-border">
                                <AlertTriangle size={12} className="text-brand-gold" />
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as any)}
                                    className="bg-transparent text-brand-muted hover:text-brand-text cursor-pointer focus:outline-none border-none outline-none font-medium py-0.5 text-xs"
                                >
                                    <option value="normal" className="bg-brand-surface text-brand-text">Normal Priority</option>
                                    <option value="high" className="bg-brand-surface text-brand-text">High Priority (Gold)</option>
                                    <option value="low" className="bg-brand-surface text-brand-text">Low Priority</option>
                                </select>
                            </div>
                        )}

                        {/* Time segment */}
                        {quickMode === "task" && (
                            <div className="flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-md border border-brand-border">
                                <Clock size={12} className="text-brand-muted" />
                                <select
                                    value={time || ""}
                                    onChange={(e) => setTime(e.target.value ? e.target.value as any : undefined)}
                                    className="bg-transparent text-brand-muted hover:text-brand-text cursor-pointer focus:outline-none border-none outline-none font-medium py-0.5 text-xs"
                                >
                                    <option value="Morning" className="bg-brand-surface text-brand-text">Morning Focus</option>
                                    <option value="Afternoon" className="bg-brand-surface text-brand-text">Afternoon Focus</option>
                                    <option value="Evening" className="bg-brand-surface text-brand-text">Evening Wind-down</option>
                                    <option value="" className="bg-brand-surface text-brand-text">Unscheduled</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}
            </form>

            {/* Quick Action Shortcuts Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-brand-border/40">
                <button
                    type="button"
                    onClick={() => onOpenQuickCaptureModal?.("task")}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-brand-bg/50 hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-brand-text border border-brand-border/50 rounded-lg transition-all cursor-pointer"
                >
                    <CheckSquare size={13} className="text-brand-blue" />
                    <span>Task</span>
                </button>

                <button
                    type="button"
                    onClick={() => onOpenQuickCaptureModal?.("ledger")}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-brand-bg/50 hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-brand-text border border-brand-border/50 rounded-lg transition-all cursor-pointer"
                >
                    <BookOpen size={13} className="text-brand-gold" />
                    <span>Ledger</span>
                </button>

                <button
                    type="button"
                    onClick={() => onOpenQuickCaptureModal?.("deadline")}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-brand-bg/50 hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-brand-text border border-brand-border/50 rounded-lg transition-all cursor-pointer"
                >
                    <Timer size={13} className="text-rose-400" />
                    <span>Deadline</span>
                </button>

                <button
                    type="button"
                    onClick={() => onOpenQuickCaptureModal?.("decision")}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-brand-bg/50 hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-brand-text border border-brand-border/50 rounded-lg transition-all cursor-pointer"
                >
                    <GitFork size={13} className="text-indigo-400" />
                    <span>Decision</span>
                </button>

                <button
                    type="button"
                    onClick={() => onOpenQuickCaptureModal?.("note")}
                    className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-brand-bg/50 hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-brand-text border border-brand-border/50 rounded-lg transition-all cursor-pointer"
                >
                    <Library size={13} className="text-teal-400" />
                    <span>Note</span>
                </button>
            </div>
        </div>
    );
};
