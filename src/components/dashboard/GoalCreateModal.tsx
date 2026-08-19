"use client";

import React, { useState } from "react";
import { Goal, useApp } from "@/context/AppContext";
import {
    X,
    Target,
    Calendar,
    Sparkles,
    Layers,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface GoalCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLaunchBreakdown?: (goal: Goal) => void;
    defaultType?: Goal["goalType"];
    defaultParentId?: string;
}

export const GoalCreateModal: React.FC<GoalCreateModalProps> = ({
    isOpen,
    onClose,
    onLaunchBreakdown,
    defaultType = "yearly",
    defaultParentId,
}) => {
    const { lifeAreas, goals, addGoal } = useApp();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalType, setGoalType] = useState<Goal["goalType"]>(defaultType);
    const [parentGoalId, setParentGoalId] = useState(defaultParentId || "");
    const [lifeAreaId, setLifeAreaId] = useState("");
    const [period, setPeriod] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [measurableTarget, setMeasurableTarget] = useState("");
    const [breakdownAfterSave, setBreakdownAfterSave] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const availableParents = goals.filter((g) => {
        if (goalType === "quarterly") return g.goalType === "yearly";
        if (goalType === "monthly") return g.goalType === "quarterly" || g.goalType === "yearly";
        if (goalType === "weekly") return g.goalType === "monthly" || g.goalType === "quarterly";
        if (goalType === "daily") return g.goalType === "weekly" || g.goalType === "monthly";
        return true;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            const createdId = await addGoal({
                title: title.trim(),
                description: description.trim() || undefined,
                goalType,
                parentGoalId: parentGoalId || undefined,
                lifeAreaId: lifeAreaId || undefined,
                period: period.trim() || undefined,
                targetDate: targetDate || undefined,
                measurableTarget: measurableTarget.trim() || undefined,
                status: "active",
                progress: 0,
            });

            if (breakdownAfterSave && onLaunchBreakdown && goalType === "yearly") {
                onLaunchBreakdown({
                    id: createdId,
                    title: title.trim(),
                    description: description.trim() || undefined,
                    goalType,
                    lifeAreaId: lifeAreaId || undefined,
                    status: "active",
                    progress: 0,
                    createdAt: new Date().toISOString(),
                });
            }

            onClose();
        } catch (err) {
            console.error("Error creating goal:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
            <div className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0 my-8">
                {/* Header */}
                <div className="p-6 border-b border-brand-border flex items-center justify-between gap-4 bg-brand-bg/40">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center">
                            <Target size={16} className="text-brand-blue" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">Create New Goal</h2>
                            <p className="text-xs text-brand-muted">Define a vision or immediate execution milestone.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-white hover:bg-brand-border/30 transition-all"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Goal Level Tabs */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Goal Type / Level</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                            {(["yearly", "quarterly", "monthly", "weekly", "daily"] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setGoalType(type)}
                                    className={cn(
                                        "py-1.5 px-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all text-center",
                                        goalType === type
                                            ? "bg-brand-blue text-white border-brand-blue shadow-sm font-bold"
                                            : "bg-brand-bg text-brand-muted border-brand-border hover:text-white"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Goal Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Complete MVP launch & acquire 100 beta users"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2.5 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Description & Notes (Optional)</label>
                        <textarea
                            rows={2}
                            placeholder="Add actionable details or success criteria..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40"
                        />
                    </div>

                    {/* Parent Goal Selection (if not yearly) */}
                    {goalType !== "yearly" && availableParents.length > 0 && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Parent Master Goal</label>
                            <select
                                value={parentGoalId}
                                onChange={(e) => setParentGoalId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            >
                                <option value="">None (Top-Level)</option>
                                {availableParents.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        [{p.goalType.toUpperCase()}] {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Life Area & Period */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Life Area</label>
                            <select
                                value={lifeAreaId}
                                onChange={(e) => setLifeAreaId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            >
                                <option value="">General</option>
                                {lifeAreas.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Target Date</label>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    {/* Yearly goal breakdown offer */}
                    {goalType === "yearly" && (
                        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-brand-blue/30 bg-brand-blue/5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={breakdownAfterSave}
                                onChange={() => setBreakdownAfterSave(!breakdownAfterSave)}
                                className="h-4 w-4 rounded border-brand-border bg-brand-bg checked:bg-brand-blue"
                            />
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                                    <Sparkles size={13} className="text-brand-gold" />
                                    Launch Goal Breakdown Wizard
                                </p>
                                <p className="text-[10px] text-brand-muted mt-0.5">
                                    Automatically deconstruct this vision into quarterly, monthly, and weekly milestones after saving.
                                </p>
                            </div>
                        </label>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border">
                        <Button type="button" variant="secondary" onClick={onClose} className="text-xs">
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={loading} className="text-xs font-bold uppercase tracking-wider">
                            <Save size={13} className="mr-1.5" />
                            Create Goal
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
