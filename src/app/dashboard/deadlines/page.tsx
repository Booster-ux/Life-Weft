"use client";

import React, { useState } from "react";
import { useApp, Deadline } from "@/context/AppContext";
import { DeadlineCard } from "@/components/dashboard/DeadlineCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
    Timer,
    Plus,
    AlertCircle,
    CheckCircle,
    Clock,
    Calendar,
    AlertTriangle,
    Layers,
} from "lucide-react";

export default function DeadlinesPage() {
    const { deadlines, addDeadline, updateDeadline, tasks, lifeAreas } = useApp();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterTimeframe, setFilterTimeframe] = useState<"all" | "today" | "tomorrow" | "week" | "upcoming" | "overdue" | "completed">("all");
    const [selectedLifeArea, setSelectedLifeArea] = useState<string>("all");

    // Form states
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("2026-08-10");
    const [dueTime, setDueTime] = useState("18:00");
    const [priority, setPriority] = useState<"high" | "normal" | "low">("normal");
    const [lifeAreaId, setLifeAreaId] = useState("area-personal");
    const [notes, setNotes] = useState("");
    const [relatedTaskId, setRelatedTaskId] = useState("auto-create");

    // Segment deadlines by timeframe
    const filteredDeadlines = deadlines.filter((d) => {
        if (selectedLifeArea !== "all" && d.lifeAreaId !== selectedLifeArea) return false;

        if (filterTimeframe === "today") return !d.completed && d.daysLeft === 0;
        if (filterTimeframe === "tomorrow") return !d.completed && d.daysLeft === 1;
        if (filterTimeframe === "week") return !d.completed && d.daysLeft >= 0 && d.daysLeft <= 7;
        if (filterTimeframe === "upcoming") return !d.completed && d.daysLeft >= 0;
        if (filterTimeframe === "overdue") return !d.completed && d.daysLeft < 0;
        if (filterTimeframe === "completed") return d.completed;

        return true;
    });

    const overdueDeadlines = deadlines.filter((d) => !d.completed && d.daysLeft < 0);
    const activeDeadlines = deadlines.filter((d) => !d.completed && d.daysLeft >= 0).sort((a, b) => a.daysLeft - b.daysLeft);
    const completedDeadlines = deadlines.filter((d) => d.completed);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !dueDate) return;

        addDeadline({
            title: title.trim(),
            dueDate,
            priority,
            lifeAreaId,
            time: dueTime || undefined,
            notes: notes.trim() || undefined,
            relatedTaskId: relatedTaskId === "none" ? undefined : relatedTaskId,
        });

        setTitle("");
        setNotes("");
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <Timer className="text-rose-400" />
                        Deadline Tracker
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Keep clear visual tabs on critical milestones, client deliverables, and commitments.
                    </p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} variant="primary" size="sm" className="font-bold flex items-center gap-1.5">
                    <Plus size={16} />
                    Schedule Deadline
                </Button>
            </div>

            {/* Timeframe Tabs & Life Area Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-brand-border/40 pb-2">
                <div className="flex overflow-x-auto gap-1">
                    {[
                        { id: "all", label: "All Milestones" },
                        { id: "today", label: "Due Today" },
                        { id: "tomorrow", label: "Tomorrow" },
                        { id: "week", label: "This Week" },
                        { id: "upcoming", label: "Upcoming" },
                        { id: "overdue", label: `Overdue (${overdueDeadlines.length})` },
                        { id: "completed", label: "Completed" },
                    ].map((tab) => {
                        const isActive = filterTimeframe === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setFilterTimeframe(tab.id as any)}
                                className={`py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border cursor-pointer ${
                                    isActive
                                        ? "bg-brand-blue text-white border-brand-blue"
                                        : "bg-brand-surface text-brand-muted hover:text-brand-text border-brand-border"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <select
                    value={selectedLifeArea}
                    onChange={(e) => setSelectedLifeArea(e.target.value)}
                    className="bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-1.5 text-xs focus:border-brand-blue outline-none cursor-pointer"
                >
                    <option value="all">All Life Areas</option>
                    {lifeAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                            {area.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Deadlines Listing Grid */}
            <div className="space-y-6">
                {filterTimeframe === "all" ? (
                    <>
                        {/* Section 1: Overdue */}
                        {overdueDeadlines.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                    <AlertCircle size={14} className="animate-pulse" />
                                    Overdue Deadlines ({overdueDeadlines.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {overdueDeadlines.map((deadline) => (
                                        <div key={deadline.id} className="border-l-4 border-red-500 rounded-xl">
                                            <DeadlineCard deadline={deadline} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Section 2: Active / Upcoming */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                <Clock size={14} className="text-brand-blue" />
                                Upcoming Goals & Milestones ({activeDeadlines.length})
                            </h3>
                            {activeDeadlines.length === 0 ? (
                                <div className="text-center p-10 bg-brand-surface/30 border border-dashed border-brand-border rounded-xl">
                                    <Calendar className="mx-auto text-brand-muted mb-2.5" size={28} />
                                    <p className="text-xs text-brand-muted">No pending deadlines scheduled. Focus on today's priorities!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeDeadlines.map((deadline) => (
                                        <DeadlineCard key={deadline.id} deadline={deadline} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Section 3: Completed */}
                        {completedDeadlines.length > 0 && (
                            <div className="space-y-3 pt-4 border-t border-brand-border/40">
                                <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                    <CheckCircle size={14} className="text-emerald-400" />
                                    Completed Milestones ({completedDeadlines.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {completedDeadlines.map((deadline) => (
                                        <DeadlineCard key={deadline.id} deadline={deadline} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredDeadlines.length === 0 ? (
                            <div className="col-span-2 text-center p-10 bg-brand-surface/30 border border-dashed border-brand-border rounded-xl">
                                <p className="text-xs text-brand-muted">No deadlines match this timeframe filter.</p>
                            </div>
                        ) : (
                            filteredDeadlines.map((deadline) => (
                                <DeadlineCard key={deadline.id} deadline={deadline} />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Create Deadline Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Schedule Important Deadline"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Deadline Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Apex Alpha Release & Client Signoff"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Target Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-1.5 text-xs focus:border-brand-blue outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Target Time
                            </label>
                            <input
                                type="time"
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-1.5 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Life Area
                            </label>
                            <select
                                value={lifeAreaId}
                                onChange={(e) => setLifeAreaId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                {lifeAreas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Importance Level
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                <option value="normal">Normal Priority</option>
                                <option value="high">High Importance (Gold Urgency Alert)</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Notes / Submission Instructions
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Include regression tables & final presentation deck"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Linked Execution Task
                        </label>
                        <select
                            value={relatedTaskId}
                            onChange={(e) => setRelatedTaskId(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                        >
                            <option value="auto-create">Auto-create linked task ("Deliver: [Deadline]")</option>
                            <option value="none">Do not link task</option>
                            {tasks.filter(t => !t.completed).map((t) => (
                                <option key={t.id} value={t.id}>
                                    Link to: {t.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-brand-border/40">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" className="font-semibold">
                            Schedule Deadline
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
