"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Plus, Tag, Calendar, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuickAddProps {
    onOpenAddTaskModal: () => void;
    onOpenAddDeadlineModal: () => void;
    onOpenAddNoteModal: () => void;
}

export const QuickAdd: React.FC<QuickAddProps> = ({
    onOpenAddTaskModal,
    onOpenAddDeadlineModal,
    onOpenAddNoteModal,
}) => {
    const { addTask } = useApp();
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<"high" | "normal" | "low">("normal");
    const [category, setCategory] = useState<"Work" | "Personal" | "Student" | "Finance" | "Health">("Personal");
    const [time, setTime] = useState<"Morning" | "Afternoon" | "Evening" | undefined>("Morning");

    const [showOptions, setShowOptions] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTask({
            title: title.trim(),
            completed: false,
            priority,
            category,
            time,
            dueDate: new Date().toISOString().split("T")[0],
        });

        setTitle("");
        setShowOptions(false);
    };

    return (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-lg shadow-black/10">
            <form onSubmit={handleSubmit} className="space-y-3">
                <label htmlFor="quick-add" className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">
                    Quick Capture
                </label>
                <div className="flex gap-2">
                    <input
                        id="quick-add"
                        type="text"
                        placeholder="What do you need to do today?"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (e.target.value.length > 0 && !showOptions) {
                                setShowOptions(true);
                            }
                        }}
                        className="flex-1 bg-brand-bg text-brand-text border border-brand-border rounded-lg px-4 py-2.5 text-sm placeholder:text-brand-muted/70 transition-all font-sans focus:border-brand-blue"
                    />
                    <Button type="submit" variant="primary" className="py-2.5 px-4 block">
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add</span>
                    </Button>
                </div>

                {/* Dynamic expansion panel when user starts typing */}
                {showOptions && (
                    <div className="flex flex-wrap gap-4 pt-2 border-t border-brand-border/40 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Priority Selector */}
                        <div className="flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-md border border-brand-border">
                            <AlertTriangle size={12} className="text-brand-gold" />
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="bg-transparent text-brand-muted hover:text-brand-text cursor-pointer focus:outline-none border-none outline-none font-medium py-0.5"
                            >
                                <option value="low" className="bg-brand-surface text-brand-text">Low Priority</option>
                                <option value="normal" className="bg-brand-surface text-brand-text">Normal</option>
                                <option value="high" className="bg-brand-surface text-brand-text">High Priority</option>
                            </select>
                        </div>

                        {/* Category Selector */}
                        <div className="flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-md border border-brand-border">
                            <Tag size={12} className="text-brand-blue" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="bg-transparent text-brand-muted hover:text-brand-text cursor-pointer focus:outline-none border-none outline-none font-medium py-0.5"
                            >
                                <option value="Personal" className="bg-brand-surface text-brand-text">Personal</option>
                                <option value="Work" className="bg-brand-surface text-brand-text">Work</option>
                                <option value="Student" className="bg-brand-surface text-brand-text">Student</option>
                                <option value="Finance" className="bg-brand-surface text-brand-text">Finance</option>
                                <option value="Health" className="bg-brand-surface text-brand-text">Health</option>
                            </select>
                        </div>

                        {/* Time of day selector */}
                        <div className="flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-md border border-brand-border">
                            <Clock size={12} className="text-brand-muted" />
                            <select
                                value={time || ""}
                                onChange={(e) => setTime(e.target.value ? e.target.value as any : undefined)}
                                className="bg-transparent text-brand-muted hover:text-brand-text cursor-pointer focus:outline-none border-none outline-none font-medium py-0.5"
                            >
                                <option value="Morning" className="bg-brand-surface text-brand-text">Morning</option>
                                <option value="Afternoon" className="bg-brand-surface text-brand-text">Afternoon</option>
                                <option value="Evening" className="bg-brand-surface text-brand-text">Evening</option>
                                <option value="" className="bg-brand-surface text-brand-text">Not Scheduled</option>
                            </select>
                        </div>
                    </div>
                )}
            </form>

            {/* Quick Actions Shortcuts Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 pt-3 border-t border-brand-border/40">
                <button
                    onClick={onOpenAddTaskModal}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-bg/50 hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-brand-text border border-brand-border/50 rounded-lg transition-all"
                >
                    <Plus size={13} className="text-brand-blue" />
                    Add Task
                </button>
                <button
                    onClick={onOpenAddDeadlineModal}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-bg/50 hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-brand-text border border-brand-border/50 rounded-lg transition-all"
                >
                    <Calendar size={13} className="text-brand-gold" />
                    Add Deadline
                </button>
                <button
                    onClick={onOpenAddNoteModal}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-bg/50 hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-brand-text border border-brand-border/50 rounded-lg transition-all"
                >
                    <Plus size={13} className="text-brand-muted" />
                    Add Note
                </button>
                <a
                    href="/dashboard/my-day"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-bg/50 hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-brand-text border border-brand-border/50 rounded-lg transition-all text-center"
                >
                    <Clock size={13} className="text-brand-blue" />
                    Plan My Day
                </a>
            </div>
        </div>
    );
};
