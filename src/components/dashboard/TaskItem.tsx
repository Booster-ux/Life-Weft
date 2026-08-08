"use client";

import React from "react";
import { Check, Trash2, Edit2, Calendar } from "lucide-react";
import { Task, useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface TaskItemProps {
    task: Task;
    onEdit?: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
    const { toggleTask, deleteTask } = useApp();

    const getPriorityStyles = (p: Task["priority"]) => {
        switch (p) {
            case "high":
                return "text-brand-gold bg-brand-gold/10 border-brand-gold/20";
            case "normal":
                return "text-brand-blue bg-brand-blue/10 border-brand-blue/20";
            default:
                return "text-brand-muted bg-brand-border/40 border-brand-border/40";
        }
    };

    const getCategoryStyles = (cat: Task["category"]) => {
        switch (cat) {
            case "Work":
                return "text-indigo-400 bg-indigo-950/20 border-indigo-900/30";
            case "Student":
                return "text-emerald-400 bg-emerald-950/20 border-emerald-900/30";
            case "Finance":
                return "text-amber-400 bg-amber-950/20 border-amber-900/30";
            case "Health":
                return "text-rose-400 bg-rose-950/20 border-rose-900/30";
            default:
                return "text-brand-muted bg-brand-bg border-brand-border";
        }
    };

    return (
        <div
            className={cn(
                "flex items-center justify-between p-4 bg-brand-surface border border-brand-border rounded-xl transition-all duration-200 group hover:border-brand-blue/20",
                task.completed && "opacity-60 border-brand-border/40 bg-brand-surface/50"
            )}
        >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Custom Checkbox */}
                <button
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                        "h-5 w-5 rounded-md border border-brand-border flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand-blue",
                        task.completed
                            ? "bg-brand-blue border-brand-blue text-white"
                            : "hover:border-brand-blue bg-brand-bg",
                        task.priority === "high" && !task.completed && "border-brand-gold/60"
                    )}
                >
                    {task.completed && <Check size={12} className="stroke-[3]" />}
                </button>

                {/* Text and Meta info */}
                <div className="min-w-0 flex-1">
                    <p
                        className={cn(
                            "text-sm font-medium text-brand-text truncate transition-all duration-200",
                            task.completed && "line-through text-brand-muted"
                        )}
                    >
                        {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px]">
                        {/* Category tag */}
                        <span className={cn("px-2 py-0.5 rounded border text-[10px] font-semibold leading-none", getCategoryStyles(task.category))}>
                            {task.category}
                        </span>

                        {/* Priority tag */}
                        <span className={cn("px-2 py-0.5 rounded border text-[10px] font-bold leading-none uppercase tracking-wider", getPriorityStyles(task.priority))}>
                            {task.priority}
                        </span>

                        {/* Time of execution */}
                        {task.time && (
                            <span className="text-brand-muted bg-brand-bg border border-brand-border/60 px-2 py-0.5 rounded font-medium leading-none">
                                {task.time}
                            </span>
                        )}

                        {/* Due date tag */}
                        {task.dueDate && (
                            <span className="flex items-center gap-1 text-brand-muted/80 leading-none">
                                <Calendar size={10} />
                                {task.dueDate === new Date().toISOString().split("T")[0] ? "Today" : task.dueDate}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Row actions visible on group hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {onEdit && (
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-border/40 transition-colors"
                    >
                        <Edit2 size={13} />
                    </button>
                )}
                <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-950/20 transition-colors"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    );
};
