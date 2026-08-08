"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { DeadlineCard } from "@/components/dashboard/DeadlineCard";
import { QuickAdd } from "@/components/dashboard/QuickAdd";
import { CalendarDays, ClipboardList, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
    const { userName, tasks, deadlines } = useApp();

    // Filters for today (August 8, 2026 - metadata date)
    const todayDateString = "2026-08-08";

    // Tasks due today or not completed of high priority
    const todayTasks = tasks.filter(t => t.dueDate === todayDateString || (!t.completed && t.priority === "high"));
    const completedToday = todayTasks.filter(t => t.completed).length;
    const totalToday = todayTasks.length;

    // 3-4 most important tasks for "Priority Today" (high priority or upcoming deadlines)
    const priorityToday = tasks
        .filter(t => !t.completed)
        .sort((a, b) => {
            if (a.priority === "high" && b.priority !== "high") return -1;
            if (a.priority !== "high" && b.priority === "high") return 1;
            return 0;
        })
        .slice(0, 4);

    // Filter 3 active upcoming deadlines
    const upcomingDeadlines = deadlines
        .filter(d => !d.completed && d.daysLeft >= -2)
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 3);

    // Global event dispatchers to open modals inside DashboardLayout
    const handleOpenTask = () => window.dispatchEvent(new Event("dd-open-task-modal"));
    const handleOpenDeadline = () => window.dispatchEvent(new Event("dd-open-deadline-modal"));
    const handleOpenNote = () => window.dispatchEvent(new Event("dd-open-note-modal"));

    return (
        <div className="space-y-6">
            {/* Greetings section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        Good morning, {userName}.
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none select-text">
                        Here's what deserves your attention today.
                    </p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-widest font-mono">
                        {new Date(todayDateString).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                    <p className="text-[10px] text-brand-blue uppercase font-bold tracking-widest mt-1">
                        Global standard time
                    </p>
                </div>
            </div>

            {/* Welcome Message Empty State */}
            {tasks.length === 0 && (
                <div className="bg-brand-surface border border-brand-border rounded-xl p-6 text-center space-y-3">
                    <p className="text-sm text-brand-muted">Welcome to DailyDo! Capture your first task to get going.</p>
                </div>
            )}

            {/* Progress & Quick add row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ProgressCard completedCount={completedToday} totalCount={totalToday} className="h-full" />
                </div>
                <div className="lg:col-span-2">
                    <QuickAdd
                        onOpenAddTaskModal={handleOpenTask}
                        onOpenAddDeadlineModal={handleOpenDeadline}
                        onOpenAddNoteModal={handleOpenNote}
                    />
                </div>
            </div>

            {/* Main lists layout grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Priority Today List */}
                <div className="lg:col-span-2 space-y-3.5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5 leading-none">
                            <ClipboardList size={13} className="text-brand-blue" />
                            Priority Today
                        </h3>
                        <Link
                            href="/dashboard/tasks"
                            className="text-[11px] text-brand-blue font-bold tracking-wide uppercase hover:underline leading-none"
                        >
                            All Tasks ({tasks.length})
                        </Link>
                    </div>

                    <div className="space-y-2.5">
                        {priorityToday.length === 0 ? (
                            <div className="bg-brand-surface/40 border border-brand-border/40 border-dashed rounded-xl p-8 text-center text-brand-muted text-xs">
                                No active priorities scheduled. Great job clearing the list!
                            </div>
                        ) : (
                            priorityToday.map((task) => (
                                <TaskItem key={task.id} task={task} />
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Upcoming Deadlines & Action panel */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5 leading-none">
                            <Clock size={13} className="text-brand-gold" />
                            Upcoming
                        </h3>
                        <Link
                            href="/dashboard/deadlines"
                            className="text-[11px] text-brand-gold font-bold tracking-wide uppercase hover:underline leading-none"
                        >
                            Manage ({deadlines.length})
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {upcomingDeadlines.length === 0 ? (
                            <div className="bg-brand-surface/40 border border-brand-border/40 border-dashed rounded-xl p-8 text-center text-brand-muted text-xs">
                                No upcoming deadlines on the horizon.
                            </div>
                        ) : (
                            upcomingDeadlines.map((deadline) => (
                                <DeadlineCard key={deadline.id} deadline={deadline} />
                            ))
                        )}
                    </div>

                    {/* Quick Info Box (concept of simple dailydo overview) */}
                    <div className="bg-brand-surface border border-brand-border/80 rounded-xl p-4.5 space-y-2.5 relative overflow-hidden">
                        <div className="h-6 w-6 rounded bg-neutral-950/20 border border-brand-border flex items-center justify-center">
                            <CalendarDays size={13} className="text-brand-blue" />
                        </div>
                        <h4 className="text-xs font-bold text-white leading-none">Weekly Planner Segment</h4>
                        <p className="text-[11px] text-brand-muted leading-relaxed">
                            You have <b>6 planner blocks</b> scheduled this week. Head over to the Planner to view study, work and recovery blocks.
                        </p>
                        <Link
                            href="/dashboard/planner"
                            className="inline-flex text-[10px] text-brand-blue font-bold tracking-wide uppercase hover:underline"
                        >
                            Open week timeline
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

