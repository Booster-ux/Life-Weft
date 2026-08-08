"use client";

import React, { useState } from "react";
import { useApp, PlannerSession } from "@/context/AppContext";
import { Calendar, Plus, BookOpen, Laptop, Heart, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage() {
    const { planner, tasks, deadlines, addPlannerSession, deletePlannerSession } = useApp();

    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [sessionDay, setSessionDay] = useState("Monday");
    const [sessionTitle, setSessionTitle] = useState("");
    const [sessionTime, setSessionTime] = useState("09:00 - 11:00");
    const [sessionType, setSessionType] = useState<PlannerSession["type"]>("work");

    const handleOpenAddSession = (day: string) => {
        setSessionDay(day);
        setIsAddSessionOpen(true);
    };

    const handleSessionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionTitle.trim() || !sessionTime.trim()) return;

        addPlannerSession({
            day: sessionDay,
            title: sessionTitle.trim(),
            time: sessionTime.trim(),
            type: sessionType,
        });

        setSessionTitle("");
        setIsAddSessionOpen(false);
    };

    const getTypeIcon = (type: PlannerSession["type"]) => {
        switch (type) {
            case "work":
                return <Laptop size={12} className="text-brand-blue" />;
            case "study":
                return <BookOpen size={12} className="text-emerald-400" />;
            case "health":
                return <Heart size={12} className="text-rose-400" />;
            default:
                return <User size={12} className="text-brand-gold" />;
        }
    };

    const getSessionColorClass = (type: PlannerSession["type"]) => {
        switch (type) {
            case "work":
                return "bg-brand-blue/5 border-brand-blue/20 text-brand-blue hover:bg-brand-blue/10";
            case "study":
                return "bg-emerald-950/20 border-emerald-900/30 text-emerald-400 hover:bg-emerald-950/30";
            case "health":
                return "bg-rose-950/20 border-rose-900/30 text-rose-400 hover:bg-rose-950/30";
            default:
                return "bg-brand-gold/5 border-brand-gold/20 text-brand-gold hover:bg-brand-gold/10";
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        Weekly Planner
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Organize core study sessions and work sprints alongside deadlines.
                    </p>
                </div>
            </div>

            {/* Grid: 7 columns or vertical blocks layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {DAYS_OF_WEEK.map((day) => {
                    // Filter sessions
                    const daySessions = planner.filter((s) => s.day === day);

                    // Tasks scheduled for this day (mock setup: map mon->sun based on index range,
                    // or matching simple date maps. Let's map if task exists. For visual correctness, we print
                    // tasks with mock maps or matching date strings)
                    // Mon: 2026-08-03, Tue: 08-04, Wed: 08-05, Thu: 08-06, Fri: 08-07, Sat: 08-08, Sun: 08-09
                    // Today Sat August 8 matching.
                    const dateMap: Record<string, string> = {
                        Monday: "2026-08-10", // next week
                        Tuesday: "2026-08-11",
                        Wednesday: "2026-08-12",
                        Thursday: "2026-08-13",
                        Friday: "2026-08-14",
                        Saturday: "2026-08-08", // Today
                        Sunday: "2026-08-09",   // Tomorrow
                    };

                    const dayTasks = tasks.filter((t) => t.dueDate === dateMap[day]);
                    const dayDeadlines = deadlines.filter((d) => d.dueDate === dateMap[day] && !d.completed);

                    return (
                        <div
                            key={day}
                            className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-col min-h-[350px] relative group transition-all hover:border-brand-border/80"
                        >
                            {/* Day title */}
                            <div className="flex items-center justify-between pb-2 border-b border-brand-border/40 mb-3.5">
                                <span className="font-bold text-sm text-white tracking-tight">{day}</span>
                                {day === "Saturday" && (
                                    <span className="text-[9px] bg-brand-blue/20 text-brand-blue border border-brand-blue/30 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide">
                                        Today
                                    </span>
                                )}
                            </div>

                            {/* Day Contents container */}
                            <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[220px]">
                                {/* 1. Show Deadlines (Critical alert status) */}
                                {dayDeadlines.length > 0 && (
                                    <div className="space-y-1.5">
                                        <p className="text-[9px] font-bold text-brand-gold uppercase tracking-wider">Deadlines</p>
                                        {dayDeadlines.map(d => (
                                            <div key={d.id} className="p-2 border border-brand-gold/30 bg-brand-gold/5 text-brand-gold rounded-lg leading-tight">
                                                <p className="text-[11px] font-bold truncate">{d.title}</p>
                                                <p className="text-[8.5px] opacity-80 mt-0.5">⚠️ Milestone Due</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 2. Show Scheduled Planner Sessions */}
                                <div className="space-y-1.5">
                                    <p className="text-[9px] font-bold text-brand-muted uppercase tracking-wider">Sessions</p>
                                    {daySessions.length === 0 && dayTasks.length === 0 && dayDeadlines.length === 0 ? (
                                        <p className="text-[10px] text-brand-muted/50 italic py-1">Empty block</p>
                                    ) : (
                                        daySessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className={`p-2 border rounded-lg leading-normal group/item relative transition-all ${getSessionColorClass(
                                                    session.type
                                                )}`}
                                            >
                                                <div className="flex justify-between items-start gap-1">
                                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                        {getTypeIcon(session.type)}
                                                        <p className="text-[11px] font-semibold truncate leading-none mt-0.5">
                                                            {session.title}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => deletePlannerSession(session.id)}
                                                        className="bg-transparent hover:text-red-400 hover:scale-105 pointer cursor-pointer opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5"
                                                    >
                                                        <Trash2 size={9} />
                                                    </button>
                                                </div>
                                                <p className="text-[8.5px] mt-1 font-mono uppercase tracking-wider">
                                                    {session.time}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* 3. Show associated Today tasks */}
                                {dayTasks.length > 0 && (
                                    <div className="space-y-1.5">
                                        <p className="text-[9px] font-bold text-teal-400 uppercase tracking-wider">Tasks</p>
                                        {dayTasks.map(t => (
                                            <div key={t.id} className="p-2 border border-brand-border bg-brand-bg rounded-lg text-brand-muted leading-tight">
                                                <p className={`text-[10.5px] font-medium truncate ${t.completed && "line-through text-brand-muted/50"}`}>{t.title}</p>
                                                <span className="text-[8.5px] text-brand-muted block mt-0.5">{t.category}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add Session action button */}
                            <button
                                onClick={() => handleOpenAddSession(day)}
                                className="mt-3.5 w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-brand-border/60 hover:border-brand-blue/30 text-[10.5px] font-bold uppercase tracking-wider text-brand-muted hover:text-white rounded-lg transition-all cursor-pointer bg-brand-bg/20"
                            >
                                <Plus size={11} />
                                Add Session
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* -------------------- LOCAL ADD PLANNED BLOCK -------------------- */}
            <Modal
                isOpen={isAddSessionOpen}
                onClose={() => setIsAddSessionOpen(false)}
                title={`Plan Focus Block: ${sessionDay}`}
            >
                <form onSubmit={handleSessionSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Block Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Deep Work: Redesign landing hero"
                            value={sessionTitle}
                            onChange={(e) => setSessionTitle(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Time Window
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 09:00 - 11:30"
                                value={sessionTime}
                                onChange={(e) => setSessionTime(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Block Category
                            </label>
                            <select
                                value={sessionType}
                                onChange={(e) => setSessionType(e.target.value as any)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue"
                            >
                                <option value="work">Work Session (Blue)</option>
                                <option value="study">Study Session (Green)</option>
                                <option value="health">Recovery / Gym (Red)</option>
                                <option value="personal">Personal Blocks (Gold)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-brand-border/40">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAddSessionOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm">
                            Schedule block
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
