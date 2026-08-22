"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { DeadlineCard } from "@/components/dashboard/DeadlineCard";
import { QuickAdd } from "@/components/dashboard/QuickAdd";
import {
    CalendarDays,
    ClipboardList,
    Clock,
    BookOpen,
    CheckCircle2,
    Layers,
    ArrowRight,
    Plus,
    Moon,
    Sparkles,
    Sun,
    Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getLocalDateString, formatLocalDate } from "@/lib/utils/dateTime";

export default function DashboardOverview() {
    const {
        userName,
        userTimezone,
        tasks,
        deadlines,
        ledgerEntries,
        planner,
        goals,
        lifeAreas,
        activeLifeArea,
        setActiveLifeArea,
    } = useApp();

    const todayDateString = getLocalDateString(new Date(), userTimezone);
    const todayDayOfWeek = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: userTimezone }).format(new Date());
    const currentHour = new Date().getHours();
    const isEvening = currentHour >= 17;

    // Filter tasks by active life area and due date
    const areaFilteredTasks = activeLifeArea === "all"
        ? tasks
        : tasks.filter((t) => t.lifeAreaId === activeLifeArea);

    const todayTasks = areaFilteredTasks.filter(
        (t) => t.dueDate === todayDateString || (!t.completed && t.priority === "high")
    );
    const completedToday = todayTasks.filter((t) => t.completed).length;
    const totalToday = todayTasks.length;

    // Top priority tasks
    const priorityToday = areaFilteredTasks
        .filter((t) => !t.completed)
        .sort((a, b) => {
            if (a.priority === "high" && b.priority !== "high") return -1;
            if (a.priority !== "high" && b.priority === "high") return 1;
            return 0;
        })
        .slice(0, 5);

    // Upcoming deadlines
    const upcomingDeadlines = deadlines
        .filter((d) => !d.completed && (activeLifeArea === "all" || d.lifeAreaId === activeLifeArea))
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 3);

    // Today's scheduled planner sessions
    const todayPlannerSessions = planner.filter((p) => p.day.toLowerCase() === todayDayOfWeek.toLowerCase());

    const handleOpenReflection = () => {
        window.dispatchEvent(new CustomEvent("lw-open-reflection"));
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header: Date, Greeting, and Reflection Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        {isEvening ? "Good evening" : "Good day"}, {userName}.
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-muted">
                        {formatLocalDate(todayDateString, userTimezone, {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleOpenReflection}
                        className={cn(
                            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                            isEvening
                                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30 shadow-sm"
                                : "bg-brand-surface text-brand-muted hover:text-white border-brand-border hover:bg-brand-bg"
                        )}
                    >
                        <Moon size={14} className={isEvening ? "text-indigo-400" : "text-brand-gold"} />
                        <span>Daily Reflection</span>
                    </button>
                </div>
            </div>

            {/* Life Areas Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1 pr-2 border-r border-brand-border/60">
                    <Layers size={13} className="text-brand-blue" />
                    Areas
                </span>

                <button
                    onClick={() => setActiveLifeArea("all")}
                    className={cn(
                        "py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer",
                        activeLifeArea === "all"
                            ? "bg-brand-surface text-white border-brand-blue shadow-sm font-bold"
                            : "bg-brand-surface text-brand-muted hover:text-brand-text border-brand-border"
                    )}
                >
                    All Areas
                </button>

                {lifeAreas.map((area) => (
                    <button
                        key={area.id}
                        onClick={() => setActiveLifeArea(area.id)}
                        className={cn(
                            "py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer",
                            activeLifeArea === area.id
                                ? "bg-brand-surface text-white border-brand-blue shadow-sm font-bold"
                                : "bg-brand-surface text-brand-muted hover:text-brand-text border-brand-border"
                        )}
                    >
                        {area.name}
                    </button>
                ))}
            </div>

            {/* Quick Add Capture Bar */}
            <QuickAdd />

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Priority Tasks & Focus Blocks */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Priority Today Tasks */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5 leading-none">
                                <ClipboardList size={13} className="text-brand-blue" />
                                Important Tasks
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
                                    No pending tasks. Use Quick Capture to record what matters today!
                                </div>
                            ) : (
                                priorityToday.map((task) => (
                                    <TaskItem key={task.id} task={task} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Today's Schedule / Focus Sessions */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5 leading-none">
                                <CalendarDays size={13} className="text-brand-blue" />
                                Today's Schedule ({todayDayOfWeek})
                            </h3>
                            <Link
                                href="/dashboard/planner"
                                className="text-[11px] text-brand-blue font-bold tracking-wide uppercase hover:underline leading-none flex items-center gap-1"
                            >
                                Open Planner <ArrowRight size={11} />
                            </Link>
                        </div>

                        {todayPlannerSessions.length === 0 ? (
                            <div className="bg-brand-surface/40 border border-brand-border/40 border-dashed rounded-xl p-6 text-center text-brand-muted text-xs">
                                No specific focus blocks scheduled for today.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {todayPlannerSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="p-3 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-semibold text-white truncate">{session.title}</p>
                                            <span className="text-[10px] text-brand-muted font-mono">{session.time}</span>
                                        </div>
                                        <span className="text-[9px] px-2 py-0.5 rounded uppercase font-bold bg-brand-bg text-brand-blue border border-brand-border">
                                            {session.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Upcoming Deadlines & Evening Check-in Prompt */}
                <div className="space-y-6">
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
                                View All ({deadlines.length})
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

                    {/* Evening Reflection Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-brand-surface to-brand-surface border border-indigo-500/30 space-y-3">
                        <div className="flex items-center gap-2">
                            <Moon size={16} className="text-indigo-400" />
                            <h4 className="text-xs font-bold text-white">Daily Reflection</h4>
                        </div>
                        <p className="text-[11px] text-brand-muted leading-relaxed">
                            Capture what was accomplished, what you learned, and log moments directly into your Personal Ledger.
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenReflection}
                            className="w-full py-2 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <Sparkles size={12} />
                            <span>Start Evening Reflection</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
