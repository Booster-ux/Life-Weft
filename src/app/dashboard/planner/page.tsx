"use client";

import React, { useState } from "react";
import { useApp, PlannerSession } from "@/context/AppContext";
import {
    Calendar,
    Plus,
    BookOpen,
    Laptop,
    Heart,
    User,
    Trash2,
    Clock,
    Layers,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage() {
    const {
        planner,
        tasks,
        deadlines,
        lifeAreas,
        addPlannerSession,
        deletePlannerSession,
    } = useApp();

    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [sessionDay, setSessionDay] = useState("Monday");
    const [sessionTitle, setSessionTitle] = useState("");
    const [sessionTime, setSessionTime] = useState("09:00 - 11:00");
    const [sessionType, setSessionType] = useState<PlannerSession["type"]>("work");
    const [sessionLifeArea, setSessionLifeArea] = useState<string>("area-work");
    const [selectedLifeArea, setSelectedLifeArea] = useState<string>("all");

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
            lifeAreaId: sessionLifeArea,
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <Calendar className="text-brand-blue" />
                        Weekly Planner
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Organize structured focus blocks, work sprints, and recovery sessions alongside deadlines.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={selectedLifeArea}
                        onChange={(e) => setSelectedLifeArea(e.target.value)}
                        className="bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-1.5 text-xs focus:border-brand-blue outline-none cursor-pointer"
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

            {/* 7-Day Columns Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3.5">
                {DAYS_OF_WEEK.map((day) => {
                    const daySessions = planner.filter(
                        (s) => s.day === day && (selectedLifeArea === "all" || s.lifeAreaId === selectedLifeArea)
                    );

                    const dateMap: Record<string, string> = {
                        Monday: "2026-08-10",
                        Tuesday: "2026-08-11",
                        Wednesday: "2026-08-12",
                        Thursday: "2026-08-13",
                        Friday: "2026-08-14",
                        Saturday: "2026-08-08",
                        Sunday: "2026-08-09",
                    };

                    const dayTasks = tasks.filter(
                        (t) => t.dueDate === dateMap[day] && (selectedLifeArea === "all" || t.lifeAreaId === selectedLifeArea)
                    );
                    const dayDeadlines = deadlines.filter(
                        (d) => d.dueDate === dateMap[day] && !d.completed && (selectedLifeArea === "all" || d.lifeAreaId === selectedLifeArea)
                    );

                    const isToday = day === "Saturday";

                    return (
                        <div
                            key={day}
                            className={cn(
                                "bg-brand-surface border rounded-xl p-3.5 flex flex-col min-h-[360px] relative group transition-all",
                                isToday ? "border-brand-gold/60 shadow-lg shadow-brand-gold/5" : "border-brand-border hover:border-brand-border/80"
                            )}
                        >
                            {/* Day Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-brand-border/40 mb-3">
                                <span className="font-bold text-xs text-white tracking-tight">{day}</span>
                                {isToday && (
                                    <span className="text-[9px] bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider font-mono">
                                        Today
                                    </span>
                                )}
                            </div>

                            {/* Sessions & Elements Container */}
                            <div className="flex-1 space-y-3 overflow-y-auto max-h-[240px] pr-0.5 scrollbar-thin">
                                {/* Deadlines */}
                                {dayDeadlines.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Deadlines</p>
                                        {dayDeadlines.map((d) => (
                                            <div
                                                key={d.id}
                                                className="p-1.5 border border-rose-900/40 bg-rose-950/20 text-rose-300 rounded-md leading-tight text-[10px]"
                                            >
                                                <p className="font-bold truncate">{d.title}</p>
                                                <p className="text-[8px] opacity-80 mt-0.5">⚠️ Due Milestone</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Focus Blocks / Sessions */}
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-brand-muted uppercase tracking-wider">Focus Blocks</p>
                                    {daySessions.length === 0 && dayTasks.length === 0 && dayDeadlines.length === 0 ? (
                                        <p className="text-[10px] text-brand-muted/50 italic py-1">Open time window</p>
                                    ) : (
                                        daySessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className={cn(
                                                    "p-2 border rounded-md leading-normal group/item relative transition-all",
                                                    getSessionColorClass(session.type)
                                                )}
                                            >
                                                <div className="flex justify-between items-start gap-1">
                                                    <div className="flex items-center gap-1 min-w-0 flex-1">
                                                        {getTypeIcon(session.type)}
                                                        <p className="text-[10.5px] font-semibold truncate leading-none mt-0.5">
                                                            {session.title}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => deletePlannerSession(session.id)}
                                                        className="hover:text-red-400 cursor-pointer opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5"
                                                    >
                                                        <Trash2 size={9} />
                                                    </button>
                                                </div>
                                                <p className="text-[8.5px] mt-1 font-mono uppercase tracking-wider opacity-80">
                                                    {session.time}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Scheduled Tasks */}
                                {dayTasks.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-teal-400 uppercase tracking-wider">Scheduled Tasks</p>
                                        {dayTasks.map((t) => (
                                            <div
                                                key={t.id}
                                                className="p-1.5 border border-brand-border bg-brand-bg rounded-md text-brand-muted leading-tight text-[10px]"
                                            >
                                                <p className={cn("font-medium truncate", t.completed && "line-through text-brand-muted/50")}>
                                                    {t.title}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add Block Trigger */}
                            <button
                                onClick={() => handleOpenAddSession(day)}
                                className="mt-3 w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-brand-border/60 hover:border-brand-blue/40 text-[10px] font-bold uppercase tracking-wider text-brand-muted hover:text-white rounded-lg transition-all cursor-pointer bg-brand-bg/20"
                            >
                                <Plus size={11} />
                                Plan Block
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Plan Session Modal */}
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
                            placeholder="e.g. Deep Work: System Architecture & Database"
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
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
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
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                <option value="work">Work Focus (Blue)</option>
                                <option value="study">Study Session (Green)</option>
                                <option value="health">Fitness / Health (Red)</option>
                                <option value="personal">Personal Life (Gold)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Life Area
                        </label>
                        <select
                            value={sessionLifeArea}
                            onChange={(e) => setSessionLifeArea(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                        >
                            {lifeAreas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-brand-border/40">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddSessionOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" className="font-semibold">
                            Save Focus Block
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
