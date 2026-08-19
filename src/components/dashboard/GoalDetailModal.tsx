"use client";

import React, { useState } from "react";
import { Goal, useApp, Task } from "@/context/AppContext";
import {
    X,
    Target,
    Calendar,
    CheckCircle2,
    Circle,
    Layers,
    GitBranch,
    Sparkles,
    Trash2,
    Plus,
    Clock,
    BookOpen,
    TrendingUp,
    Edit2,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface GoalDetailModalProps {
    goal: Goal | null;
    onClose: () => void;
    onOpenBreakdown?: (goal: Goal) => void;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
    goal,
    onClose,
    onOpenBreakdown,
}) => {
    const {
        goals,
        lifeAreas,
        tasks,
        planner,
        ledgerEntries,
        updateGoal,
        deleteGoal,
        toggleGoalStatus,
        addTask,
        toggleTask,
    } = useApp();

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(goal?.title || "");
    const [description, setDescription] = useState(goal?.description || "");
    const [targetDate, setTargetDate] = useState(goal?.targetDate || "");
    const [progress, setProgress] = useState(goal?.progress || 0);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [showAddTask, setShowAddTask] = useState(false);

    if (!goal) return null;

    const area = lifeAreas.find((a) => a.id === goal.lifeAreaId);
    const parentGoal = goals.find((g) => g.id === goal.parentGoalId);
    const childGoals = goals.filter((g) => g.parentGoalId === goal.id);

    // Linked tasks, planner sessions & ledger reflections
    const linkedTasks = tasks.filter((t) => t.goalId === goal.id);
    const linkedPlanner = planner.filter((p) => p.goalId === goal.id);
    const linkedLedger = ledgerEntries.filter((e) => e.relatedGoalId === goal.id);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        await updateGoal({
            ...goal,
            title: title.trim(),
            description: description.trim() || undefined,
            targetDate: targetDate || undefined,
            progress: Number(progress),
        });

        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this goal and its child milestones?")) {
            await deleteGoal(goal.id);
            onClose();
        }
    };

    const handleCreateLinkedTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        await addTask({
            title: newTaskTitle.trim(),
            completed: false,
            priority: "normal",
            category: "Work",
            lifeAreaId: goal.lifeAreaId,
            goalId: goal.id,
        });

        setNewTaskTitle("");
        setShowAddTask(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
            <div className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 my-8">
                {/* Header */}
                <div className="p-6 border-b border-brand-border flex items-start justify-between gap-4 bg-brand-bg/40">
                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-brand-blue/30 bg-brand-blue/10 text-brand-blue uppercase tracking-wider">
                                {goal.goalType} Goal
                            </span>
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
                            {goal.period && (
                                <span className="text-[10px] font-mono bg-brand-bg px-2 py-0.5 rounded border border-brand-border text-brand-muted">
                                    {goal.period}
                                </span>
                            )}
                        </div>

                        {parentGoal && (
                            <p className="text-xs text-brand-muted flex items-center gap-1.5 pt-1">
                                <GitBranch size={13} className="text-brand-gold" />
                                <span>Parent Goal:</span>
                                <span className="font-semibold text-white truncate max-w-[280px]">{parentGoal.title}</span>
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-white hover:bg-brand-border/30 transition-all text-xs flex items-center gap-1"
                        >
                            <Edit2 size={13} />
                            <span>{isEditing ? "Cancel" : "Edit"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="p-1.5 rounded-lg border border-red-900/30 text-red-400 hover:bg-red-950/40 transition-all"
                            title="Delete Goal"
                        >
                            <Trash2 size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-white hover:bg-brand-border/30 transition-all"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    {/* Goal Title / Edit Form */}
                    {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-4 bg-brand-bg p-4 rounded-xl border border-brand-border">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Goal Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Description</label>
                                <textarea
                                    rows={2}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Target Date</label>
                                    <input
                                        type="date"
                                        value={targetDate}
                                        onChange={(e) => setTargetDate(e.target.value)}
                                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Progress ({progress}%)</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={progress}
                                        onChange={(e) => setProgress(Number(e.target.value))}
                                        className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer mt-2"
                                    />
                                </div>
                            </div>

                            <Button type="submit" variant="primary" className="text-xs font-bold uppercase tracking-wider w-full justify-center">
                                <Save size={13} className="mr-1.5" /> Save Goal Changes
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h2 className={cn("text-lg font-bold text-white leading-snug", goal.status === "completed" && "line-through text-brand-muted")}>
                                        {goal.title}
                                    </h2>
                                    {goal.description && (
                                        <p className="text-xs text-brand-muted leading-relaxed">
                                            {goal.description}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleGoalStatus(goal.id)}
                                    className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0"
                                    style={{
                                        backgroundColor: goal.status === "completed" ? "#10B98120" : "#3B82F615",
                                        borderColor: goal.status === "completed" ? "#10B98140" : "#3B82F630",
                                        color: goal.status === "completed" ? "#34D399" : "#60A5FA",
                                    }}
                                >
                                    {goal.status === "completed" ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                    <span>{goal.status === "completed" ? "Completed" : "Mark Complete"}</span>
                                </button>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1.5 p-3.5 bg-brand-bg rounded-xl border border-brand-border/60">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1">
                                        <TrendingUp size={11} className="text-brand-gold" /> Total Achievement
                                    </span>
                                    <span className="font-mono font-bold text-white">{goal.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-brand-surface rounded-full overflow-hidden border border-brand-border">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-300 rounded-full",
                                            goal.status === "completed" ? "bg-emerald-500" : goal.progress >= 75 ? "bg-brand-gold" : "bg-brand-blue"
                                        )}
                                        style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Breakdown trigger banner (for yearly / major goals) */}
                    {goal.goalType === "yearly" && onOpenBreakdown && (
                        <div className="p-4 bg-gradient-to-r from-brand-blue/10 to-brand-gold/10 border border-brand-blue/30 rounded-xl flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-brand-gold" />
                                    Break down this yearly vision
                                </h4>
                                <p className="text-[11px] text-brand-muted">
                                    Decompose into 4 quarterly milestones, monthly goals, and daily action sprints.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => onOpenBreakdown(goal)}
                                className="text-xs font-bold uppercase tracking-wider flex-shrink-0"
                            >
                                Breakdown Roadmap
                            </Button>
                        </div>
                    )}

                    {/* Child Milestones Hierarchy */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <Layers size={13} className="text-brand-blue" />
                                Child Milestones ({childGoals.length})
                            </h3>
                        </div>

                        {childGoals.length === 0 ? (
                            <div className="p-4 rounded-xl bg-brand-bg/40 border border-brand-border/40 text-center text-xs text-brand-muted">
                                No child milestones created yet.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {childGoals.map((cg) => (
                                    <div
                                        key={cg.id}
                                        className="p-3 bg-brand-bg border border-brand-border/60 hover:border-brand-border rounded-xl flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <button
                                                type="button"
                                                onClick={() => toggleGoalStatus(cg.id)}
                                                className="text-brand-muted hover:text-white transition-colors flex-shrink-0"
                                            >
                                                {cg.status === "completed" ? (
                                                    <CheckCircle2 size={15} className="text-emerald-400" />
                                                ) : (
                                                    <Circle size={15} className="text-brand-muted" />
                                                )}
                                            </button>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider bg-brand-surface border-brand-border text-brand-muted font-mono">
                                                        {cg.goalType}
                                                    </span>
                                                    {cg.period && (
                                                        <span className="text-[10px] text-brand-muted font-mono">
                                                            {cg.period}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={cn("font-semibold text-white mt-0.5 truncate", cg.status === "completed" && "line-through text-brand-muted")}>
                                                    {cg.title}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px] text-brand-muted">
                                            <span>{cg.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Linked Tasks Section */}
                    <div className="space-y-3 pt-2 border-t border-brand-border/40">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <Target size={13} className="text-emerald-400" />
                                Connected Tasks ({linkedTasks.length})
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowAddTask(!showAddTask)}
                                className="text-[10px] font-bold text-brand-blue hover:underline uppercase tracking-wider flex items-center gap-1"
                            >
                                <Plus size={11} /> Add Linked Task
                            </button>
                        </div>

                        {showAddTask && (
                            <form onSubmit={handleCreateLinkedTask} className="flex items-center gap-2 bg-brand-bg p-2 rounded-xl border border-brand-border">
                                <input
                                    type="text"
                                    placeholder="Enter task title..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder:text-brand-muted text-xs px-2 py-1 outline-none"
                                />
                                <Button type="submit" variant="primary" className="text-xs py-1 px-3">
                                    Add
                                </Button>
                            </form>
                        )}

                        {linkedTasks.length === 0 ? (
                            <p className="text-[11px] text-brand-muted italic">No tasks explicitly linked to this goal yet.</p>
                        ) : (
                            <div className="space-y-1.5">
                                {linkedTasks.map((t) => (
                                    <div
                                        key={t.id}
                                        onClick={() => toggleTask(t.id)}
                                        className="p-2.5 bg-brand-bg hover:bg-brand-border/30 rounded-lg border border-brand-border/40 flex items-center justify-between gap-3 text-xs cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <button type="button" className="text-brand-muted">
                                                {t.completed ? (
                                                    <CheckCircle2 size={15} className="text-emerald-400" />
                                                ) : (
                                                    <Circle size={15} className="group-hover:text-brand-blue" />
                                                )}
                                            </button>
                                            <span className={cn("font-medium text-white truncate", t.completed && "line-through text-brand-muted")}>
                                                {t.title}
                                            </span>
                                        </div>
                                        {t.time && <span className="text-[10px] text-brand-muted font-mono flex-shrink-0">{t.time}</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Linked Planner Sessions */}
                    {linkedPlanner.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-brand-border/40">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <Clock size={13} className="text-amber-400" />
                                Scheduled in Planner ({linkedPlanner.length})
                            </h3>
                            <div className="space-y-1.5">
                                {linkedPlanner.map((p) => (
                                    <div key={p.id} className="p-2.5 bg-brand-bg rounded-lg border border-brand-border/40 flex items-center justify-between text-xs">
                                        <span className="font-semibold text-white">{p.title}</span>
                                        <span className="text-[10px] font-mono text-brand-muted">{p.day} • {p.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Linked Ledger Reflections */}
                    {linkedLedger.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-brand-border/40">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <BookOpen size={13} className="text-purple-400" />
                                Ledger Reflections ({linkedLedger.length})
                            </h3>
                            <div className="space-y-1.5">
                                {linkedLedger.map((l) => (
                                    <div key={l.id} className="p-2.5 bg-brand-bg rounded-lg border border-brand-border/40 space-y-1 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-white">{l.title}</span>
                                            <span className="text-[10px] font-mono text-brand-muted">{l.date}</span>
                                        </div>
                                        <p className="text-[11px] text-brand-muted line-clamp-1">{l.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
