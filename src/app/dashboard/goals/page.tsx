"use client";

import React, { useState } from "react";
import { useApp, Goal } from "@/context/AppContext";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { GoalDetailModal } from "@/components/dashboard/GoalDetailModal";
import { GoalBreakdownWizard } from "@/components/dashboard/GoalBreakdownWizard";
import { GoalCreateModal } from "@/components/dashboard/GoalCreateModal";
import {
    Target,
    Plus,
    Sparkles,
    Layers,
    GitBranch,
    Calendar,
    CheckCircle2,
    Clock,
    TrendingUp,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "yearly" | "quarterly" | "monthly" | "weekly" | "daily" | "active" | "completed";

export default function GoalsPage() {
    const { goals, lifeAreas, activeLifeArea, setActiveLifeArea } = useApp();

    const [activeTab, setActiveTab] = useState<FilterTab>("all");
    const [viewMode, setViewMode] = useState<"grid" | "hierarchy">("grid");

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
    const [selectedGoalForBreakdown, setSelectedGoalForBreakdown] = useState<Goal | null>(null);
    const [selectedGoalForDetail, setSelectedGoalForDetail] = useState<Goal | null>(null);

    // Filter goals
    const areaFilteredGoals = activeLifeArea === "all"
        ? goals
        : goals.filter((g) => g.lifeAreaId === activeLifeArea);

    const filteredGoals = areaFilteredGoals.filter((g) => {
        if (activeTab === "all") return true;
        if (activeTab === "active") return g.status === "active";
        if (activeTab === "completed") return g.status === "completed";
        return g.goalType === activeTab;
    });

    // Overview Stats
    const yearlyCount = goals.filter((g) => g.goalType === "yearly").length;
    const activeCount = goals.filter((g) => g.status === "active").length;
    const completedCount = goals.filter((g) => g.status === "completed").length;
    const overallProgress = goals.length > 0
        ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
        : 0;

    const handleOpenBreakdown = (goal?: Goal) => {
        setSelectedGoalForBreakdown(goal || null);
        setIsBreakdownOpen(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center">
                            <Target size={18} className="text-brand-blue" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Goals & Milestones</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-muted">
                        Transform yearly vision into quarterly milestones, weekly focus, and daily actions.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleOpenBreakdown()}
                        className="text-xs font-bold uppercase tracking-wider"
                    >
                        <Sparkles size={13} className="mr-1.5 text-brand-gold" />
                        Breakdown Wizard
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => setIsCreateOpen(true)}
                        className="text-xs font-bold uppercase tracking-wider"
                    >
                        <Plus size={14} className="mr-1.5" />
                        New Goal
                    </Button>
                </div>
            </div>

            {/* Overview Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                        Yearly Visions
                    </span>
                    <p className="text-xl font-bold text-white font-mono">{yearlyCount}</p>
                </div>

                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                        Active Goals
                    </span>
                    <p className="text-xl font-bold text-brand-blue font-mono">{activeCount}</p>
                </div>

                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                        Completed
                    </span>
                    <p className="text-xl font-bold text-emerald-400 font-mono">{completedCount}</p>
                </div>

                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                        Average Velocity
                    </span>
                    <p className="text-xl font-bold text-brand-gold font-mono">{overallProgress}%</p>
                </div>
            </div>

            {/* Life Areas Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                    type="button"
                    onClick={() => setActiveLifeArea("all")}
                    className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border",
                        activeLifeArea === "all"
                            ? "bg-brand-blue/20 text-brand-blue border-brand-blue/40"
                            : "bg-brand-surface text-brand-muted border-brand-border hover:text-white"
                    )}
                >
                    All Areas
                </button>
                {lifeAreas.map((area) => (
                    <button
                        key={area.id}
                        type="button"
                        onClick={() => setActiveLifeArea(area.id)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border",
                            activeLifeArea === area.id
                                ? "bg-brand-border/60 text-white font-bold"
                                : "bg-brand-surface text-brand-muted border-brand-border hover:text-white"
                        )}
                        style={
                            activeLifeArea === area.id
                                ? {
                                      backgroundColor: `${area.color}25`,
                                      borderColor: `${area.color}60`,
                                      color: area.color,
                                  }
                                : undefined
                        }
                    >
                        {area.name}
                    </button>
                ))}
            </div>

            {/* Level Tabs & View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {(
                        [
                            { id: "all", label: "All Levels" },
                            { id: "yearly", label: "Yearly" },
                            { id: "quarterly", label: "Quarterly" },
                            { id: "monthly", label: "Monthly" },
                            { id: "weekly", label: "Weekly" },
                            { id: "daily", label: "Daily Actions" },
                            { id: "active", label: "Active" },
                            { id: "completed", label: "Completed" },
                        ] as const
                    ).map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-brand-blue text-white shadow-sm font-bold"
                                    : "text-brand-muted hover:text-white hover:bg-brand-surface"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1 bg-brand-surface p-1 rounded-lg border border-brand-border self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={cn(
                            "px-2.5 py-1 rounded text-xs font-semibold transition-all",
                            viewMode === "grid" ? "bg-brand-border text-white" : "text-brand-muted hover:text-white"
                        )}
                    >
                        Grid
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("hierarchy")}
                        className={cn(
                            "px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1",
                            viewMode === "hierarchy" ? "bg-brand-border text-white" : "text-brand-muted hover:text-white"
                        )}
                    >
                        <GitBranch size={12} />
                        Tree
                    </button>
                </div>
            </div>

            {/* Goals Content View */}
            {filteredGoals.length === 0 ? (
                <div className="p-12 bg-brand-surface border border-brand-border rounded-2xl text-center space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mx-auto text-brand-blue">
                        <Target size={24} />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                        <h3 className="text-sm font-bold text-white">No goals matching filter</h3>
                        <p className="text-xs text-brand-muted">
                            Start by defining a yearly vision or generate an actionable roadmap using the breakdown wizard.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => setIsCreateOpen(true)}
                        className="text-xs font-bold uppercase tracking-wider mt-2"
                    >
                        <Plus size={14} className="mr-1.5" /> Create First Goal
                    </Button>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGoals.map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onOpenDetail={(g) => setSelectedGoalForDetail(g)}
                            onOpenBreakdown={(g) => handleOpenBreakdown(g)}
                        />
                    ))}
                </div>
            ) : (
                /* Hierarchy Tree View */
                <div className="space-y-6">
                    {goals
                        .filter((g) => g.goalType === "yearly" && (activeLifeArea === "all" || g.lifeAreaId === activeLifeArea))
                        .map((yearly) => {
                            const quarterlyChildren = goals.filter((g) => g.parentGoalId === yearly.id && g.goalType === "quarterly");

                            return (
                                <div
                                    key={yearly.id}
                                    className="p-6 bg-brand-surface border border-brand-border rounded-2xl space-y-4 shadow-sm"
                                >
                                    {/* Yearly Parent */}
                                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-brand-border">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-purple-800/40 bg-purple-950/30 text-purple-400 uppercase tracking-wider font-mono">
                                                    Yearly Vision ({yearly.period || "2026"})
                                                </span>
                                            </div>
                                            <h2
                                                onClick={() => setSelectedGoalForDetail(yearly)}
                                                className="text-base font-bold text-white hover:text-brand-blue cursor-pointer transition-colors"
                                            >
                                                {yearly.title}
                                            </h2>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xs font-mono font-bold text-white bg-brand-bg px-2 py-1 rounded border border-brand-border">
                                                {yearly.progress}%
                                            </span>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => handleOpenBreakdown(yearly)}
                                                className="text-[11px] py-1 px-2.5"
                                            >
                                                <Sparkles size={11} className="mr-1 text-brand-gold" /> Breakdown
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Quarterly Children */}
                                    {quarterlyChildren.length === 0 ? (
                                        <div className="p-3 bg-brand-bg rounded-xl border border-brand-border/40 text-xs text-brand-muted text-center">
                                            No quarterly milestones created under this vision yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-brand-border/60">
                                            {quarterlyChildren.map((q) => {
                                                const monthlyChildren = goals.filter((g) => g.parentGoalId === q.id);

                                                return (
                                                    <div key={q.id} className="space-y-2">
                                                        <div
                                                            onClick={() => setSelectedGoalForDetail(q)}
                                                            className="p-3 bg-brand-bg hover:bg-brand-border/20 border border-brand-border rounded-xl flex items-center justify-between cursor-pointer transition-all"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border border-blue-800/40 bg-blue-950/30 text-blue-400 uppercase font-mono">
                                                                    {q.period || "Quarterly"}
                                                                </span>
                                                                <h4 className="text-xs font-semibold text-white truncate max-w-[280px]">
                                                                    {q.title}
                                                                </h4>
                                                            </div>
                                                            <span className="text-[10px] font-mono text-brand-muted font-bold">
                                                                {q.progress}%
                                                            </span>
                                                        </div>

                                                        {/* Monthly / Weekly / Daily sub-items */}
                                                        {monthlyChildren.length > 0 && (
                                                            <div className="pl-4 sm:pl-6 space-y-1.5 border-l border-brand-border/40">
                                                                {monthlyChildren.map((m) => (
                                                                    <div
                                                                        key={m.id}
                                                                        onClick={() => setSelectedGoalForDetail(m)}
                                                                        className="p-2 bg-brand-surface hover:bg-brand-border/40 border border-brand-border/40 rounded-lg flex items-center justify-between text-xs cursor-pointer"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[9px] font-bold px-1 py-0.2 rounded border border-emerald-800/40 bg-emerald-950/30 text-emerald-400 uppercase font-mono">
                                                                                {m.goalType}
                                                                            </span>
                                                                            <span className="text-white truncate max-w-[240px]">
                                                                                {m.title}
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-[10px] font-mono text-brand-muted">
                                                                            {m.progress}%
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            )}

            {/* Modals */}
            <GoalCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onLaunchBreakdown={(g) => handleOpenBreakdown(g)}
            />

            <GoalDetailModal
                goal={selectedGoalForDetail}
                onClose={() => setSelectedGoalForDetail(null)}
                onOpenBreakdown={(g) => handleOpenBreakdown(g)}
            />

            {isBreakdownOpen && (
                <GoalBreakdownWizard
                    baseGoal={selectedGoalForBreakdown}
                    onClose={() => {
                        setIsBreakdownOpen(false);
                        setSelectedGoalForBreakdown(null);
                    }}
                />
            )}
        </div>
    );
}
