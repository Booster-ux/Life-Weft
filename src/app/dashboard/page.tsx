"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { DeadlineCard } from "@/components/dashboard/DeadlineCard";
import { QuickAdd } from "@/components/dashboard/QuickAdd";
import {
    CalendarDays,
    ClipboardList,
    Clock,
    BookOpen,
    Sparkles,
    CheckCircle2,
    Layers,
    ArrowRight,
    Plus,
    Target,
    GitBranch,
    Circle,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function DashboardOverview() {
    const {
        userName,
        tasks,
        deadlines,
        ledgerEntries,
        planner,
        goals,
        toggleGoalStatus,
        lifeAreas,
        activeLifeArea,
        setActiveLifeArea,
    } = useApp();

    const todayDateString = "2026-08-08";

    // Filter tasks by active life area (if set) and due date
    const areaFilteredTasks = activeLifeArea === "all"
        ? tasks
        : tasks.filter(t => t.lifeAreaId === activeLifeArea);

    const todayTasks = areaFilteredTasks.filter(
        (t) => t.dueDate === todayDateString || (!t.completed && t.priority === "high")
    );
    const completedToday = todayTasks.filter((t) => t.completed).length;
    const totalToday = todayTasks.length;

    // Filter goals
    const areaFilteredGoals = activeLifeArea === "all"
        ? goals
        : goals.filter((g) => g.lifeAreaId === activeLifeArea);

    const todayGoals = areaFilteredGoals.filter(
        (g) => g.goalType === "daily" || (g.goalType === "weekly" && g.status === "active")
    );

    // Top priority tasks
    const priorityToday = areaFilteredTasks
        .filter((t) => !t.completed)
        .sort((a, b) => {
            if (a.priority === "high" && b.priority !== "high") return -1;
            if (a.priority !== "high" && b.priority === "high") return 1;
            return 0;
        })
        .slice(0, 4);

    // Upcoming deadlines
    const upcomingDeadlines = deadlines
        .filter((d) => !d.completed && (activeLifeArea === "all" || d.lifeAreaId === activeLifeArea))
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 3);

    // Recent Ledger entries
    const recentLedger = ledgerEntries
        .filter((e) => activeLifeArea === "all" || e.lifeAreaId === activeLifeArea)
        .sort((a, b) => new Date(`${b.date}T${b.time || "00:00"}`).getTime() - new Date(`${a.date}T${a.time || "00:00"}`).getTime())
        .slice(0, 2);

    // Today's scheduled planner sessions
    const todayPlannerSessions = planner.filter((p) => p.day === "Saturday"); // Base date Sat Aug 8

    // Trigger universal capture modal
    const handleOpenCapture = (type?: "task" | "ledger" | "note" | "deadline" | "decision") => {
        window.dispatchEvent(new CustomEvent("lw-open-quick-capture", { detail: { type } }));
    };

    return (
        <div className="space-y-6">
            {/* Greetings & Date Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        Good day, {userName}.
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-none select-text">
                        Here is your central life-management and memory command center.
                    </p>
                </div>

                <div className="text-left sm:text-right">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-widest font-mono">
                        {new Date(todayDateString).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                    <p className="text-[10px] text-brand-gold uppercase font-bold tracking-widest mt-1">
                        Personal Workspace Layer
                    </p>
                </div>
            </div>

            {/* Life Areas Horizontal Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1 pr-2 border-r border-brand-border/60">
                    <Layers size={13} className="text-brand-blue" />
                    Areas
                </span>

                <button
                    onClick={() => setActiveLifeArea("all")}
                    className={cn(
                        "py-1.5 px-3 rounded-md text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer",
                        activeLifeArea === "all"
                            ? "bg-brand-surface text-white border-brand-blue shadow-sm font-bold"
                            : "bg-brand-surface text-brand-muted hover:text-brand-text border-brand-border"
                    )}
                >
                    All Life Areas
                </button>

                {lifeAreas.map((area) => {
                    const isActive = activeLifeArea === area.id;
                    return (
                        <button
                            key={area.id}
                            onClick={() => setActiveLifeArea(area.id)}
                            className={cn(
                                "flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer",
                                isActive
                                    ? "bg-brand-surface text-white border-brand-gold shadow-sm font-bold"
                                    : "bg-brand-surface text-brand-muted hover:text-brand-text border-brand-border"
                            )}
                        >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: area.color }} />
                            <span>{area.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Progress & Quick Capture Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ProgressCard completedCount={completedToday} totalCount={totalToday} className="h-full" />
                </div>
                <div className="lg:col-span-2">
                    <QuickAdd onOpenQuickCaptureModal={handleOpenCapture} />
                </div>
            </div>

            {/* Today's Strategic Goals & Actions Widget */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
                            <Target size={15} className="text-brand-gold" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider leading-none">
                                Today's Goals & Strategic Actions
                            </h3>
                            <p className="text-[10px] text-brand-muted mt-0.5">
                                Milestone actions driving your yearly objectives forward.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/goals"
                        className="text-[11px] text-brand-gold font-bold tracking-wide uppercase hover:underline flex items-center gap-1"
                    >
                        Goals Roadmap ({goals.length}) <ArrowRight size={11} />
                    </Link>
                </div>

                {todayGoals.length === 0 ? (
                    <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border/40 text-center text-xs text-brand-muted flex items-center justify-between gap-4">
                        <span>No active daily milestones scheduled today. Break down a yearly vision to generate today's actions!</span>
                        <Link href="/dashboard/goals">
                            <Button type="button" variant="primary" className="text-[11px] py-1 px-3">
                                <Sparkles size={11} className="mr-1" /> View Roadmap
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {todayGoals.slice(0, 4).map((goal) => {
                            const parent = goals.find((g) => g.id === goal.parentGoalId);
                            const isCompleted = goal.status === "completed";

                            return (
                                <div
                                    key={goal.id}
                                    className={cn(
                                        "p-3.5 bg-brand-bg border border-brand-border/80 hover:border-brand-border rounded-xl transition-all flex items-start justify-between gap-3 group",
                                        isCompleted && "opacity-60"
                                    )}
                                >
                                    <div className="flex items-start gap-2.5 min-w-0">
                                        <button
                                            type="button"
                                            onClick={() => toggleGoalStatus(goal.id)}
                                            className="mt-0.5 text-brand-muted hover:text-brand-gold transition-colors flex-shrink-0"
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : (
                                                <Circle size={16} className="text-brand-muted group-hover:text-brand-blue" />
                                            )}
                                        </button>
                                        <div className="min-w-0">
                                            {parent && (
                                                <p className="text-[10px] text-brand-gold flex items-center gap-1 font-mono leading-none mb-1">
                                                    <GitBranch size={10} />
                                                    <span className="truncate max-w-[180px]">{parent.title}</span>
                                                </p>
                                            )}
                                            <h4 className={cn("text-xs font-semibold text-white leading-snug truncate", isCompleted && "line-through text-brand-muted")}>
                                                {goal.title}
                                            </h4>
                                        </div>
                                    </div>

                                    <span className="text-[10px] font-mono font-bold text-brand-muted flex-shrink-0">
                                        {goal.progress}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Main Content Multi-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Priority Today & Scheduled Activities */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Priority Today Tasks */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5 leading-none">
                                <ClipboardList size={13} className="text-brand-blue" />
                                Today's Priorities
                            </h3>
                            <Link
                                href="/dashboard/tasks"
                                className="text-[11px] text-brand-blue font-bold tracking-wide uppercase hover:underline leading-none flex items-center gap-1"
                            >
                                All Tasks ({areaFilteredTasks.length}) <ArrowRight size={11} />
                            </Link>
                        </div>

                        <div className="space-y-2.5">
                            {priorityToday.length === 0 ? (
                                <div className="bg-brand-surface/40 border border-brand-border/40 border-dashed rounded-xl p-8 text-center text-brand-muted text-xs">
                                    No pending priorities. Use Quick Capture to record today's tasks!
                                </div>
                            ) : (
                                priorityToday.map((task) => (
                                    <TaskItem key={task.id} task={task} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Personal Ledger Recent Memory Timeline Snippet */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5 leading-none">
                                <BookOpen size={13} className="text-brand-gold" />
                                Recent Personal Ledger Chronicle
                            </h3>
                            <Link
                                href="/dashboard/ledger"
                                className="text-[11px] text-brand-gold font-bold tracking-wide uppercase hover:underline leading-none flex items-center gap-1"
                            >
                                Open Ledger <ArrowRight size={11} />
                            </Link>
                        </div>

                        <div className="space-y-2.5">
                            {recentLedger.length === 0 ? (
                                <div className="bg-brand-surface/40 border border-brand-border/40 border-dashed rounded-xl p-6 text-center text-brand-muted text-xs">
                                    No timeline memories logged yet. Record what happened in your life!
                                </div>
                            ) : (
                                recentLedger.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="bg-brand-surface border border-brand-border rounded-xl p-4 space-y-1.5 hover:border-brand-gold/30 transition-colors"
                                    >
                                        <div className="flex items-center justify-between text-[10px] text-brand-muted">
                                            <span className="font-bold text-brand-gold uppercase tracking-wider">
                                                {entry.date} {entry.time && `• ${entry.time}`}
                                            </span>
                                            {entry.tags && entry.tags[0] && (
                                                <span className="bg-brand-bg px-2 py-0.5 rounded border border-brand-border/60">
                                                    #{entry.tags[0]}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-xs font-bold text-white leading-snug">{entry.title}</h4>
                                        <p className="text-[11px] text-brand-muted line-clamp-2 leading-relaxed">
                                            {entry.description}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Deadlines, Scheduled Blocks, and Ask Lifeweft Widget */}
                <div className="space-y-5">
                    {/* Upcoming Deadlines */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5 leading-none">
                                <Clock size={13} className="text-rose-400" />
                                Upcoming Deadlines
                            </h3>
                            <Link
                                href="/dashboard/deadlines"
                                className="text-[11px] text-rose-400 font-bold tracking-wide uppercase hover:underline leading-none"
                            >
                                View ({deadlines.length})
                            </Link>
                        </div>

                        <div className="space-y-2.5">
                            {upcomingDeadlines.length === 0 ? (
                                <div className="bg-brand-surface/40 border border-brand-border/40 border-dashed rounded-xl p-6 text-center text-brand-muted text-xs">
                                    No immediate deadlines due.
                                </div>
                            ) : (
                                upcomingDeadlines.map((deadline) => (
                                    <DeadlineCard key={deadline.id} deadline={deadline} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Scheduled Activities / Planner Focus */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-4.5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-brand-bg border border-brand-border flex items-center justify-center">
                                    <CalendarDays size={13} className="text-brand-blue" />
                                </div>
                                <h4 className="text-xs font-bold text-white leading-none">Scheduled Focus Blocks</h4>
                            </div>
                            <Link
                                href="/dashboard/planner"
                                className="text-[10px] text-brand-blue font-bold tracking-wide uppercase hover:underline"
                            >
                                Week View
                            </Link>
                        </div>

                        {todayPlannerSessions.length === 0 ? (
                            <p className="text-[11px] text-brand-muted">
                                You have <b>{planner.length} focus sessions</b> planned this week.
                            </p>
                        ) : (
                            <div className="space-y-1.5">
                                {todayPlannerSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="p-2 rounded-lg bg-brand-bg border border-brand-border/60 text-[11px] flex justify-between items-center"
                                    >
                                        <span className="font-semibold text-brand-text truncate">{session.title}</span>
                                        <span className="text-[9px] text-brand-muted font-mono">{session.time}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Ask Lifeweft Intelligence Card */}
                    <div className="bg-gradient-to-br from-brand-surface to-brand-blue/10 border border-brand-blue/30 rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-brand-gold animate-pulse" />
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                Ask Lifeweft Assistant
                            </h4>
                        </div>
                        <p className="text-[11px] text-brand-muted leading-relaxed">
                            Query your entire personal memory layer, deadlines, priorities, strategic goals, and journal insights instantly.
                        </p>
                        <Link
                            href="/dashboard/ask"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-white uppercase tracking-wider transition-colors pt-1"
                        >
                            <span>Open Query Engine</span>
                            <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
