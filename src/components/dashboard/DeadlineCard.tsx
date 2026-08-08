"use client";

import React from "react";
import { Calendar, AlertCircle, ArrowUpRight, Check } from "lucide-react";
import { Deadline, useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface DeadlineCardProps {
    deadline: Deadline;
}

export const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline }) => {
    const { toggleDeadline, deleteDeadline, tasks } = useApp();

    const relatedTask = tasks.find((t) => t.id === deadline.relatedTaskId);

    // Format countdown string
    const getCountdownText = () => {
        if (deadline.completed) return "Completed";
        if (deadline.daysLeft === 0) return "🚨 Due Today";
        if (deadline.daysLeft === 1) return "Due Tomorrow";
        if (deadline.daysLeft > 1) return `Due in ${deadline.daysLeft} days`;
        return `Overdue by ${Math.abs(deadline.daysLeft)} days`;
    };

    const getPriorityBadgeClass = () => {
        if (deadline.completed) return "text-brand-muted bg-brand-border/40 border-brand-border/40";
        switch (deadline.priority) {
            case "high":
                return "text-brand-gold bg-brand-gold/10 border-brand-gold/20";
            case "normal":
                return "text-brand-blue bg-brand-blue/10 border-brand-blue/20";
            default:
                return "text-brand-muted bg-brand-border border-brand-border";
        }
    };

    return (
        <div
            className={cn(
                "bg-brand-surface border border-brand-border rounded-xl p-4.5 relative overflow-hidden transition-all duration-200 hover:border-brand-blue/20 group shadow-md",
                deadline.completed && "opacity-60 border-brand-border/40"
            )}
        >
            <div className="flex items-start gap-3.5">
                {/* Toggle Completion */}
                <button
                    onClick={() => toggleDeadline(deadline.id)}
                    className={cn(
                        "mt-0.5 h-4.5 w-4.5 rounded border border-brand-border flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none",
                        deadline.completed
                            ? "bg-brand-blue border-brand-blue text-white"
                            : "hover:border-brand-blue bg-brand-bg",
                        deadline.daysLeft < 0 && !deadline.completed && "border-red-500/50"
                    )}
                >
                    {deadline.completed && <Check size={11} className="stroke-[3]" />}
                </button>

                {/* Contents */}
                <div className="flex-1 min-w-0">
                    <h4
                        className={cn(
                            "font-semibold text-sm text-brand-text truncate pr-6",
                            deadline.completed && "line-through text-brand-muted"
                        )}
                    >
                        {deadline.title}
                    </h4>

                    {/* Date info row */}
                    <div className="flex items-center gap-2.5 mt-2 text-xs text-brand-muted">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {deadline.dueDate}
                        </span>
                        <span className="font-semibold text-brand-text/90 bg-brand-bg border border-brand-border/60 py-0.5 px-2 rounded-md scale-95 origin-left">
                            {getCountdownText()}
                        </span>
                    </div>

                    {/* Linked Task badge */}
                    {relatedTask && (
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-muted bg-brand-bg px-2.5 py-1 rounded-md border border-brand-border/40 w-fit">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                            <span className="truncate max-w-[200px]">
                                Task: {relatedTask.title}
                            </span>
                            {relatedTask.completed ? (
                                <span className="text-[9px] text-emerald-400 font-bold ml-1 uppercase">Done</span>
                            ) : (
                                <span className="text-[9px] text-brand-muted font-semibold ml-1 uppercase">Pending</span>
                            )}
                        </div>
                    )}

                    {/* Bottom Metas (Importance & Trash) */}
                    <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-brand-border/40">
                        <span
                            className={cn(
                                "px-2 py-0.5 text-[10px] rounded border font-bold uppercase tracking-wider",
                                getPriorityBadgeClass()
                            )}
                        >
                            {deadline.priority} Priority
                        </span>

                        <button
                            onClick={() => deleteDeadline(deadline.id)}
                            className="text-[10px] text-brand-muted hover:text-red-400 hover:underline transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
