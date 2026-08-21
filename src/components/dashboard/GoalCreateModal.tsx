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
    Coins,
    Activity,
    Briefcase,
    BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { GOAL_PRESETS, GoalPreset, extractGoalPacing } from "@/lib/services/goalBreakdownService";

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

    const [selectedCategory, setSelectedCategory] = useState<string>("finance");
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

    const livePacing = extractGoalPacing(title);

    const handleSelectPreset = (preset: GoalPreset) => {
        setSelectedCategory(preset.category);
        if (preset.defaultTitle) setTitle(preset.defaultTitle);
        if (preset.defaultDescription) setDescription(preset.defaultDescription);
    };

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
                measurableTarget: measurableTarget.trim() || (livePacing ? `${livePacing.prefix}${livePacing.totalAmount.toLocaleString()} ${livePacing.unit}`.trim() : undefined),
                status: "active",
                progress: 0,
            });

            if (breakdownAfterSave && onLaunchBreakdown && (goalType === "yearly" || goalType === "custom")) {
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

    const getPresetIcon = (iconName: string) => {
        switch (iconName) {
            case "Coins": return <Coins size={12} className="text-brand-gold" />;
            case "Activity": return <Activity size={12} className="text-emerald-400" />;
            case "Briefcase": return <Briefcase size={12} className="text-brand-blue" />;
            case "BookOpen": return <BookOpen size={12} className="text-purple-400" />;
            case "Sparkles": return <Sparkles size={12} className="text-amber-300" />;
            default: return <Target size={12} className="text-brand-muted" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in font-sans">
            <div className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0 my-4 sm:my-8">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-brand-border flex items-center justify-between gap-4 bg-brand-bg/40">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center">
                            <Target size={16} className="text-brand-blue" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">Create Goal</h2>
                            <p className="text-xs text-brand-muted">Yearly, Quarterly, Monthly, Weekly, Daily, or Custom.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-white hover:bg-brand-border/30 transition-all cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Goal Level Tabs */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Goal Type / Level</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                            {(["yearly", "quarterly", "monthly", "weekly", "daily", "custom"] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setGoalType(type)}
                                    className={cn(
                                        "py-1.5 px-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border transition-all text-center cursor-pointer",
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

                    {/* Category Options / Presets */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Category Template (Optional)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {GOAL_PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => handleSelectPreset(preset)}
                                    className={cn(
                                        "p-2 rounded-lg border text-left transition-all flex items-center gap-1.5 text-[11px] cursor-pointer",
                                        selectedCategory === preset.category
                                            ? "bg-brand-blue/15 border-brand-blue/60 text-white font-medium shadow-sm"
                                            : "bg-brand-bg/60 border-brand-border/60 text-brand-muted hover:border-brand-border hover:text-brand-text"
                                    )}
                                >
                                    {getPresetIcon(preset.icon)}
                                    <span className="truncate">{preset.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Goal Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Save 1,000,000 before December, or Run 500 km..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2.5 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40"
                        />
                    </div>

                    {/* Live Pacing Preview */}
                    {livePacing && (
                        <div className="p-2.5 bg-brand-gold/10 border border-brand-gold/30 rounded-xl space-y-1 text-xs">
                            <div className="text-[10px] font-bold text-brand-gold uppercase flex items-center gap-1">
                                <Sparkles size={12} /> Auto Calculated Action Pacing
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                                <div className="bg-brand-bg/80 p-1 rounded border border-brand-border/60">
                                    <span className="text-brand-muted block text-[8px]">Quarter</span>
                                    <span className="font-bold text-white">{livePacing.prefix}{livePacing.perQuarter.toLocaleString()}</span>
                                </div>
                                <div className="bg-brand-bg/80 p-1 rounded border border-brand-border/60">
                                    <span className="text-brand-muted block text-[8px]">Month</span>
                                    <span className="font-bold text-brand-gold">{livePacing.prefix}{livePacing.perMonth.toLocaleString()}</span>
                                </div>
                                <div className="bg-brand-bg/80 p-1 rounded border border-brand-border/60">
                                    <span className="text-brand-muted block text-[8px]">Week</span>
                                    <span className="font-bold text-white">{livePacing.prefix}{livePacing.perWeek.toLocaleString()}</span>
                                </div>
                                <div className="bg-brand-bg/80 p-1 rounded border border-brand-border/60">
                                    <span className="text-brand-muted block text-[8px]">Day</span>
                                    <span className="font-bold text-emerald-400">{livePacing.prefix}{livePacing.perDay.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Description & Notes (Optional)</label>
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
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Parent Master Goal</label>
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

                    {/* Life Area & Target Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Life Area</label>
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
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Target Date</label>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    {/* Auto Breakdown Option */}
                    {(goalType === "yearly" || goalType === "custom") && (
                        <div className="p-3 bg-brand-bg rounded-xl border border-brand-border flex items-center justify-between gap-3">
                            <div className="space-y-0.5">
                                <span className="text-xs font-semibold text-white block">
                                    Launch Action Breakdown Wizard
                                </span>
                                <span className="text-[10px] text-brand-muted block">
                                    Calculates quarterly, monthly, weekly, and daily pacing tasks.
                                </span>
                            </div>
                            <input
                                type="checkbox"
                                checked={breakdownAfterSave}
                                onChange={(e) => setBreakdownAfterSave(e.target.checked)}
                                className="h-4 w-4 rounded bg-brand-surface border-brand-border text-brand-gold accent-brand-gold cursor-pointer"
                            />
                        </div>
                    )}

                    {/* Submit */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="text-xs font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || !title.trim()}
                            className="text-xs font-bold uppercase tracking-wider"
                        >
                            {loading ? "Creating..." : "Save Goal"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
