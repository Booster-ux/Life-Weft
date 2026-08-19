"use client";

import React from "react";
import { Goal, useApp } from "@/context/AppContext";
import {
    Target,
    Calendar,
    CheckCircle2,
    Circle,
    Layers,
    GitBranch,
    Sparkles,
    ChevronRight,
    TrendingUp,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
    goal: Goal;
    onOpenDetail: (goal: Goal) => void;
    onOpenBreakdown?: (goal: Goal) => void;
    compact?: boolean;
}

const typeStyles: Record<Goal["goalType"], { label: string; bg: string; text: string; border: string }> = {
    yearly: { label: "Yearly Vision", bg: "bg-purple-950/40", text: "text-purple-400", border: "border-purple-800/40" },
    quarterly: { label: "Quarterly Milestone", bg: "bg-blue-950/40", text: "text-blue-400", border: "border-blue-800/40" },
    monthly: { label: "Monthly Goal", bg: "bg-emerald-950/40", text: "text-emerald-400", border: "border-emerald-800/40" },
    weekly: { label: "Weekly Focus", bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-800/40" },
    daily: { label: "Daily Action", bg: "bg-rose-950/40", text: "text-rose-400", border: "border-rose-800/40" },
    custom: { label: "Custom Goal", bg: "bg-brand-border/40", text: "text-brand-muted", border: "border-brand-border" },
};

export const GoalCard: React.FC<GoalCardProps> = ({
    goal,
    onOpenDetail,
    onOpenBreakdown,
    compact = false,
}) => {
    const { lifeAreas, goals, toggleGoalStatus } = useApp();

    const isCompleted = goal.status === "completed";
    const area = lifeAreas.find((a) => a.id === goal.lifeAreaId);
    const parentGoal = goals.find((g) => g.id === goal.parentGoalId);
    const childGoals = goals.filter((g) => g.parentGoalId === goal.id);

    const typeConfig = typeStyles[goal.goalType] || typeStyles.yearly;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleGoalStatus(goal.id);
    };

    const handleBreakdownClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onOpenBreakdown) onOpenBreakdown(goal);
    };

    if (compact) {
        return (
            <div
                onClick={() => onOpenDetail(goal)}
                className={cn(
                    "p-3.5 bg-brand-surface border border-brand-border/60 hover:border-brand-border rounded-xl transition-all cursor-pointer group flex items-center justify-between gap-3",
                    isCompleted && "opacity-60 bg-brand-bg"
                )}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        onClick={handleToggle}
                        className="text-brand-muted hover:text-brand-gold transition-colors flex-shrink-0"
                    >
                        {isCompleted ? (
                            <CheckCircle2 size={16} className="text-emerald-400" />
                        ) : (
                            <Circle size={16} className="text-brand-muted group-hover:text-brand-blue" />
                        )}
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className={cn("text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider", typeConfig.bg, typeConfig.text, typeConfig.border)}>
                                {typeConfig.label}
                            </span>
                            {parentGoal && (
                                <span className="text-[10px] text-brand-muted truncate max-w-[120px]">
                                    ↳ {parentGoal.title}
                                </span>
                            )}
                        </div>
                        <h4 className={cn("text-xs font-semibold text-white mt-1 truncate", isCompleted && "line-through text-brand-muted")}>
                            {goal.title}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                        <span className="text-[10px] font-mono font-bold text-brand-muted">{goal.progress}%</span>
                    </div>
                    <ChevronRight size={14} className="text-brand-muted group-hover:text-brand-text transition-colors" />
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => onOpenDetail(goal)}
            className={cn(
                "p-5 bg-brand-surface border border-brand-border hover:border-brand-blue/40 rounded-xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between space-y-4",
                isCompleted && "opacity-75 bg-brand-bg/60 border-brand-border/40"
            )}
        >
            {/* Top row: Badge & Life Area */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider", typeConfig.bg, typeConfig.text, typeConfig.border)}>
                        {typeConfig.label}
                    </span>

                    {goal.period && (
                        <span className="text-[10px] font-mono bg-brand-bg px-2 py-0.5 rounded border border-brand-border/60 text-brand-muted">
                            {goal.period}
                        </span>
                    )}

                    {area && (
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded border"
                            style={{
                                backgroundColor: `${area.color}15`,
                                color: area.color,
                                borderColor: `${area.color}30`,
                            }}
                        >
                            {area.name}
                        </span>
                    )}
                </div>

                {/* Status toggle */}
                <button
                    type="button"
                    onClick={handleToggle}
                    className="p-1 rounded hover:bg-brand-border/40 text-brand-muted transition-colors flex-shrink-0"
                    title={isCompleted ? "Mark active" : "Mark completed"}
                >
                    {isCompleted ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                        <Circle size={18} className="text-brand-muted group-hover:text-brand-blue" />
                    )}
                </button>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
                {parentGoal && (
                    <p className="text-[11px] text-brand-muted flex items-center gap-1 font-mono">
                        <GitBranch size={11} className="text-brand-gold" />
                        <span className="truncate max-w-[240px]">{parentGoal.title}</span>
                    </p>
                )}
                <h3 className={cn("text-sm font-bold text-white group-hover:text-brand-blue transition-colors leading-snug", isCompleted && "line-through text-brand-muted")}>
                    {goal.title}
                </h3>
                {goal.description && (
                    <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                        {goal.description}
                    </p>
                )}
            </div>

            {/* Progress Bar & Stats */}
            <div className="space-y-2 pt-1 border-t border-brand-border/40">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider flex items-center gap-1">
                        <TrendingUp size={11} className="text-brand-gold" /> Progress
                    </span>
                    <span className="font-mono font-bold text-xs text-brand-text">{goal.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-brand-bg rounded-full overflow-hidden border border-brand-border/40">
                    <div
                        className={cn(
                            "h-full transition-all duration-300 rounded-full",
                            isCompleted ? "bg-emerald-500" : goal.progress >= 75 ? "bg-brand-gold" : "bg-brand-blue"
                        )}
                        style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
                    />
                </div>
            </div>

            {/* Footer metadata & Breakdown trigger */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs text-brand-muted">
                <div className="flex items-center gap-2.5">
                    {goal.targetDate && (
                        <span className="flex items-center gap-1 text-[11px] text-brand-muted font-mono">
                            <Calendar size={12} className="text-brand-muted" />
                            {goal.targetDate}
                        </span>
                    )}

                    {childGoals.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-brand-muted font-mono">
                            <Layers size={12} className="text-brand-blue" />
                            {childGoals.length} {childGoals.length === 1 ? "milestone" : "milestones"}
                        </span>
                    )}
                </div>

                {goal.goalType === "yearly" && (
                    <button
                        type="button"
                        onClick={handleBreakdownClick}
                        className="px-2.5 py-1 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border border-brand-blue/20 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                    >
                        <Sparkles size={11} className="text-brand-gold" />
                        Break down
                    </button>
                )}
            </div>
        </div>
    );
};
