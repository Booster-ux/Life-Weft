"use client";

import React, { useState } from "react";
import { useApp, Task } from "@/context/AppContext";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { Plus, Sun, Sunrise, Sunset, PlusCircle, ArrowUpDown, ChevronRight, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getLocalDateString, formatLocalDate } from "@/lib/utils/dateTime";

export default function MyDayPage() {
    const { tasks, addTask, updateTask, userTimezone } = useApp();
    const [newTitle, setNewTitle] = useState("");
    const [taskTime, setTaskTime] = useState("");
    const [activeSegment, setActiveSegment] = useState<"Morning" | "Afternoon" | "Evening">("Morning");

    // Dynamic user-local today date
    const todayDateString = getLocalDateString(new Date(), userTimezone);
    const todayTasks = tasks.filter(t => t.dueDate === todayDateString);

    // Auto-detect timeline segment from time string (HH:mm)
    const classifyTimeSegment = (timeStr: string): "Morning" | "Afternoon" | "Evening" => {
        if (!timeStr) return "Morning";
        const [hours] = timeStr.split(":").map(Number);
        if (isNaN(hours)) return "Morning";
        if (hours < 12) return "Morning";
        if (hours < 17) return "Afternoon";
        return "Evening";
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTaskTime(val);
        if (val) {
            setActiveSegment(classifyTimeSegment(val));
        }
    };

    const handleSegmentClick = (seg: "Morning" | "Afternoon" | "Evening") => {
        setActiveSegment(seg);
        // Set a reasonable default time if empty
        if (!taskTime) {
            if (seg === "Morning") setTaskTime("09:00");
            else if (seg === "Afternoon") setTaskTime("14:00");
            else setTaskTime("19:00");
        }
    };

    // Quick insertion of a task into a specific timeline segment
    const handleAddNewTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        addTask({
            title: newTitle.trim(),
            completed: false,
            priority: "normal",
            category: "Personal",
            time: taskTime ? `${activeSegment} • ${taskTime}` : activeSegment,
            dueDate: todayDateString,
        });

        setNewTitle("");
        setTaskTime("");
    };

    // Group tasks by their timeline segments
    const morningTasks = todayTasks.filter(t => t.time && t.time.includes("Morning"));
    const afternoonTasks = todayTasks.filter(t => t.time && t.time.includes("Afternoon"));
    const eveningTasks = todayTasks.filter(t => t.time && t.time.includes("Evening"));
    const unscheduledTasks = todayTasks.filter(t => !t.time || (!t.time.includes("Morning") && !t.time.includes("Afternoon") && !t.time.includes("Evening")));

    // Mock interaction: Move a task to a different timeline segment
    const moveTaskSegment = (task: Task, newTime: "Morning" | "Afternoon" | "Evening" | undefined) => {
        updateTask({
            ...task,
            time: newTime,
        });
    };

    // Mock interaction: Toggle priority level
    const raisePriority = (task: Task) => {
        const nextPriorityMap: Record<Task["priority"], Task["priority"]> = {
            low: "normal",
            normal: "high",
            high: "low",
        };
        updateTask({
            ...task,
            priority: nextPriorityMap[task.priority],
        });
    };

    const getTimelineSegmentHeader = (title: string, icon: React.ReactNode, count: number) => (
        <div className="flex items-center justify-between pb-2 border-b border-brand-border/40">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="font-bold text-sm text-brand-text">{title}</h3>
                <span className="text-[10px] bg-brand-surface border border-brand-border px-2 py-0.5 rounded-full font-bold text-brand-muted">
                    {count}
                </span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <Sun className="text-brand-gold" />
                        My Day Focus
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-none select-text">
                        Align morning, afternoon, and evening checkpoints to stay focused.
                    </p>
                </div>
            </div>

            {/* Grid: Day planner and capture */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Side: Dynamic focus Capture form */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider block">
                                Quick Schedule Task
                            </h3>
                            <span className="text-[10px] text-brand-gold font-bold px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/20 rounded">
                                {activeSegment}
                            </span>
                        </div>

                        <form onSubmit={handleAddNewTask} className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Task Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Finish client proposal..."
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                                    required
                                />
                            </div>

                            {/* Time input + Auto classification */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Time (Optional)</label>
                                    <span className="text-[9px] text-brand-muted">Auto-sorts into segment</span>
                                </div>
                                <input
                                    type="time"
                                    value={taskTime}
                                    onChange={handleTimeChange}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                                />
                            </div>

                            {/* Segment Toggles */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Segment</label>
                                <div className="grid grid-cols-3 gap-1 bg-brand-bg p-1 rounded-lg border border-brand-border">
                                    {(["Morning", "Afternoon", "Evening"] as const).map(seg => (
                                        <button
                                            key={seg}
                                            type="button"
                                            onClick={() => handleSegmentClick(seg)}
                                            className={`py-1.5 px-2 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center ${activeSegment === seg
                                                ? "bg-brand-blue text-white shadow-sm font-bold"
                                                : "text-brand-muted hover:text-brand-text bg-transparent"
                                                }`}
                                        >
                                            {seg}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" variant="primary" className="w-full py-2 justify-center text-xs font-bold uppercase tracking-wider mt-2">
                                Add to {activeSegment}
                            </Button>
                        </form>
                    </div>

                    {/* Prompt / Guide information */}
                    <div className="bg-brand-surface/40 border border-brand-border/60 rounded-xl p-4.5 space-y-2">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-brand-gold/10 px-2 py-0.5 border border-brand-gold/20 rounded w-fit block">
                            Daily Philosophy
                        </span>
                        <p className="text-xs text-brand-muted leading-relaxed">
                            "A long checklist is a list of distractions. Break your obligations into time capsules so you can single-task effectively."
                        </p>
                    </div>
                </div>

                {/* Right Side: Timeline Grid */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Segment 1: Morning */}
                    <div className="space-y-3">
                        {getTimelineSegmentHeader("Morning Checkpoint", <Sunrise size={16} className="text-brand-gold" />, morningTasks.length)}
                        <div className="space-y-2.5">
                            {morningTasks.length === 0 ? (
                                <p className="text-xs text-brand-muted italic pl-6 py-2">No tasks scheduled for morning.</p>
                            ) : (
                                morningTasks.map(task => (
                                    <div key={task.id} className="relative group">
                                        <TaskItem task={task} />
                                        {/* Control float overlay menu for mobile interactions */}
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-surface px-2.5 py-1 rounded-lg border border-brand-border">
                                            <button
                                                onClick={() => moveTaskSegment(task, "Afternoon")}
                                                className="text-[10.5px] hover:text-brand-blue font-bold tracking-wide uppercase transition-colors"
                                                title="Move to Afternoon"
                                            >
                                                Later
                                            </button>
                                            <span className="text-brand-muted text-[10px]">|</span>
                                            <button
                                                onClick={() => raisePriority(task)}
                                                className="text-[10.5px] text-brand-gold font-bold tracking-wide uppercase transition-colors"
                                                title="Rotate Priority"
                                            >
                                                Priority
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Segment 2: Afternoon */}
                    <div className="space-y-3">
                        {getTimelineSegmentHeader("Afternoon Focus", <Sunset size={16} className="text-brand-blue" />, afternoonTasks.length)}
                        <div className="space-y-2.5">
                            {afternoonTasks.length === 0 ? (
                                <p className="text-xs text-brand-muted italic pl-6 py-2">No tasks scheduled for afternoon.</p>
                            ) : (
                                afternoonTasks.map(task => (
                                    <div key={task.id} className="relative group">
                                        <TaskItem task={task} />
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-surface px-2.5 py-1 rounded-lg border border-brand-border">
                                            <button
                                                onClick={() => moveTaskSegment(task, "Evening")}
                                                className="text-[10.5px] hover:text-brand-blue font-bold tracking-wide uppercase transition-colors"
                                                title="Move to Evening"
                                            >
                                                Later
                                            </button>
                                            <span className="text-brand-muted text-[10px]">|</span>
                                            <button
                                                onClick={() => moveTaskSegment(task, "Morning")}
                                                className="text-[10.5px] hover:text-brand-blue font-bold tracking-wide uppercase transition-colors"
                                                title="Move to Morning"
                                            >
                                                Earlier
                                            </button>
                                            <span className="text-brand-muted text-[10px]">|</span>
                                            <button
                                                onClick={() => raisePriority(task)}
                                                className="text-[10.5px] text-brand-gold font-bold tracking-wide uppercase transition-colors"
                                            >
                                                Priority
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Segment 3: Evening */}
                    <div className="space-y-3">
                        {getTimelineSegmentHeader("Evening Wind Down", <Moon size={16} className="text-indigo-400" />, eveningTasks.length)}
                        <div className="space-y-2.5">
                            {eveningTasks.length === 0 ? (
                                <p className="text-xs text-brand-muted italic pl-6 py-2">No evening responsibilities scheduled.</p>
                            ) : (
                                eveningTasks.map(task => (
                                    <div key={task.id} className="relative group">
                                        <TaskItem task={task} />
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-surface px-2.5 py-1 rounded-lg border border-brand-border">
                                            <button
                                                onClick={() => moveTaskSegment(task, "Afternoon")}
                                                className="text-[10.5px] hover:text-brand-blue font-bold tracking-wide uppercase transition-colors"
                                                title="Move to Afternoon"
                                            >
                                                Earlier
                                            </button>
                                            <span className="text-brand-muted text-[10px]">|</span>
                                            <button
                                                onClick={() => raisePriority(task)}
                                                className="text-[10.5px] text-brand-gold font-bold tracking-wide uppercase transition-colors"
                                            >
                                                Priority
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Unscheduled Today */}
                    {unscheduledTasks.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-brand-border/40">
                            <h3 className="font-bold text-xs text-brand-muted flex items-center gap-2 uppercase tracking-wide">
                                Unscheduled Items Scheduled Today ({unscheduledTasks.length})
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {unscheduledTasks.map(task => (
                                    <div key={task.id} className="flex gap-2">
                                        <div className="flex-1">
                                            <TaskItem task={task} />
                                        </div>
                                        <div className="flex flex-col gap-1 align-middle justify-center">
                                            <button
                                                onClick={() => moveTaskSegment(task, "Morning")}
                                                className="text-[9px] font-bold text-brand-blue uppercase bg-brand-blue/5 hover:bg-brand-blue/15 px-2 py-1 rounded border border-brand-blue/20 cursor-pointer"
                                            >
                                                Morning
                                            </button>
                                            <button
                                                onClick={() => moveTaskSegment(task, "Afternoon")}
                                                className="text-[9px] font-bold text-brand-gold uppercase bg-brand-gold/5 hover:bg-brand-gold/15 px-2 py-1 rounded border border-brand-gold/20 cursor-pointer"
                                            >
                                                Afternoon
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
