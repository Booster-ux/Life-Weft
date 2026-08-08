"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
    completedCount: number;
    totalCount: number;
    className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
    completedCount,
    totalCount,
    className,
}) => {
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div
            className={cn(
                "bg-brand-surface border border-brand-border rounded-xl p-5 relative overflow-hidden group shadow-lg shadow-black/20",
                className
            )}
        >
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-blue/10 transition-colors duration-550" />

            <h4 className="text-sm font-medium text-brand-muted mb-2">Today's Progress</h4>
            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-extrabold text-brand-text tracking-tight animate-fade-in">
                    {percentage}%
                </span>
                <span className="text-xs text-brand-muted">
                    ({completedCount} of {totalCount} tasks completed)
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-2 w-full bg-brand-bg rounded-full overflow-hidden border border-brand-border/40">
                <div
                    className="h-full bg-brand-blue rounded-full smooth-hover"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Progress Encouragement Subtext */}
            <p className="text-[11px] text-brand-muted mt-3 italic">
                {percentage === 100
                    ? "🎉 Superb! All daily goals completed!"
                    : percentage >= 70
                        ? "Almost there! Keep dragging priorities to the line."
                        : percentage >= 40
                            ? "Steady progress. Focus on high priority items."
                            : totalCount === 0
                                ? "No tasks scheduled for today yet. Use quick add!"
                                : "Focus on what matters most. Take one task at a time."}
            </p>
        </div>
    );
};
