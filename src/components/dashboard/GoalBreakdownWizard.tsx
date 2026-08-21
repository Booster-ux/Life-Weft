"use client";

import React, { useState, useEffect } from "react";
import { Goal, useApp } from "@/context/AppContext";
import {
    generateGoalBreakdown,
    BreakdownNode,
    BreakdownRoadmap,
    GOAL_PRESETS,
    GoalPreset,
    extractGoalPacing,
} from "@/lib/services/goalBreakdownService";
import {
    X,
    Sparkles,
    CheckCircle2,
    Circle,
    Layers,
    Calendar,
    ArrowRight,
    Plus,
    Trash2,
    RefreshCw,
    Edit2,
    Save,
    Check,
    Coins,
    Activity,
    Briefcase,
    BookOpen,
    Target,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface GoalBreakdownWizardProps {
    baseGoal?: Goal | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export const GoalBreakdownWizard: React.FC<GoalBreakdownWizardProps> = ({
    baseGoal,
    onClose,
    onSuccess,
}) => {
    const { lifeAreas, batchAddGoals } = useApp();

    const [selectedCategory, setSelectedCategory] = useState<string>("finance");
    const [goalTitle, setGoalTitle] = useState(baseGoal?.title || "");
    const [goalDescription, setGoalDescription] = useState(baseGoal?.description || "");
    const [selectedAreaId, setSelectedAreaId] = useState(baseGoal?.lifeAreaId || "");
    const [targetYear, setTargetYear] = useState(() => String(new Date().getFullYear()));

    const [roadmap, setRoadmap] = useState<BreakdownRoadmap | null>(null);
    const [generatedNodes, setGeneratedNodes] = useState<BreakdownNode[]>([]);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    // Auto-generate on initial load if baseGoal provided
    useEffect(() => {
        if (baseGoal) {
            const area = lifeAreas.find((a) => a.id === baseGoal.lifeAreaId);
            const currentYearStr = String(new Date().getFullYear());
            const rm = generateGoalBreakdown(
                baseGoal.title,
                baseGoal.description || "",
                area?.name || "General",
                baseGoal.lifeAreaId,
                currentYearStr
            );
            setRoadmap(rm);
            // Skip root node if baseGoal already created
            const childNodes = rm.nodes.filter((n) => n.goalType !== "yearly").map((n) => {
                if (n.parentTempId && n.parentTempId.startsWith("root-")) {
                    return { ...n, parentTempId: baseGoal.id };
                }
                return n;
            });
            setGeneratedNodes(childNodes);
            setIsGenerated(true);
        }
    }, [baseGoal, lifeAreas]);

    const handleSelectPreset = (preset: GoalPreset) => {
        setSelectedCategory(preset.category);
        if (preset.defaultTitle) setGoalTitle(preset.defaultTitle);
        if (preset.defaultDescription) setGoalDescription(preset.defaultDescription);
    };

    const handleGenerate = () => {
        if (!goalTitle.trim()) return;

        const area = lifeAreas.find((a) => a.id === selectedAreaId);
        const rm = generateGoalBreakdown(
            goalTitle.trim(),
            goalDescription.trim(),
            area?.name || "General",
            selectedAreaId || undefined,
            targetYear
        );

        setRoadmap(rm);
        setGeneratedNodes(rm.nodes);
        setIsGenerated(true);
    };

    const handleToggleSelect = (tempId: string) => {
        setGeneratedNodes((prev) =>
            prev.map((n) => (n.tempId === tempId ? { ...n, selected: !n.selected } : n))
        );
    };

    const handleDeleteNode = (tempId: string) => {
        setGeneratedNodes((prev) => prev.filter((n) => n.tempId !== tempId && n.parentTempId !== tempId));
    };

    const handleStartEdit = (node: BreakdownNode) => {
        setEditingNodeId(node.tempId);
        setEditingText(node.title);
    };

    const handleSaveEdit = (tempId: string) => {
        setGeneratedNodes((prev) =>
            prev.map((n) => (n.tempId === tempId ? { ...n, title: editingText.trim() || n.title } : n))
        );
        setEditingNodeId(null);
    };

    const handleConfirmAndSave = async () => {
        const selectedNodes = generatedNodes.filter((n) => n.selected);
        if (selectedNodes.length === 0) return;

        setIsSubmitting(true);
        try {
            const formattedGoals = selectedNodes.map((n) => ({
                parentGoalId: n.parentTempId,
                title: n.title,
                description: n.description,
                goalType: n.goalType,
                period: n.period,
                status: "active" as const,
                progress: 0,
                lifeAreaId: n.lifeAreaId,
            }));

            await batchAddGoals(formattedGoals);

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error("Error saving breakdown:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPresetIcon = (iconName: string) => {
        switch (iconName) {
            case "Coins": return <Coins size={13} className="text-brand-gold" />;
            case "Activity": return <Activity size={13} className="text-emerald-400" />;
            case "Briefcase": return <Briefcase size={13} className="text-brand-blue" />;
            case "BookOpen": return <BookOpen size={13} className="text-purple-400" />;
            case "Sparkles": return <Sparkles size={13} className="text-amber-300" />;
            default: return <Target size={13} className="text-brand-muted" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in font-sans">
            <div className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 my-4 sm:my-8">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-brand-border flex items-center justify-between gap-4 bg-gradient-to-r from-brand-bg to-brand-surface">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
                            <Sparkles size={18} className="text-brand-gold" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                                Goal Breakdown Engine
                            </h2>
                            <p className="text-xs text-brand-muted">
                                Decompose major goals into quarterly, monthly, weekly, and daily pacing.
                            </p>
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

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {!isGenerated ? (
                        <div className="space-y-4">
                            {/* Category Presets */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                                    Choose Goal Category / Preset
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {GOAL_PRESETS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => handleSelectPreset(preset)}
                                            className={cn(
                                                "p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 text-xs",
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

                            {/* Goal Title */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                                    Target Goal Objective
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Save 1,000,000 before December, or Read 24 books..."
                                    value={goalTitle}
                                    onChange={(e) => setGoalTitle(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2.5 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40"
                                />
                            </div>

                            {/* Goal Description */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                                    Success Criteria & Motivation
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Why is this goal important? What does success look like?"
                                    value={goalDescription}
                                    onChange={(e) => setGoalDescription(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40"
                                />
                            </div>

                            {/* Life Area & Target Year */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                                        Life Area
                                    </label>
                                    <select
                                        value={selectedAreaId}
                                        onChange={(e) => setSelectedAreaId(e.target.value)}
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
                                    <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                                        Target Year
                                    </label>
                                    <input
                                        type="number"
                                        value={targetYear}
                                        onChange={(e) => setTargetYear(e.target.value)}
                                        className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue outline-none"
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleGenerate}
                                disabled={!goalTitle.trim()}
                                className="w-full py-2.5 justify-center text-xs font-bold uppercase tracking-wider mt-2"
                            >
                                <Sparkles size={14} /> Calculate Action Plan & Pacing
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Pacing Banner */}
                            {roadmap?.pacing && (
                                <div className="p-3.5 bg-brand-gold/10 border border-brand-gold/30 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold text-brand-gold">
                                        <span className="flex items-center gap-1.5">
                                            <Coins size={14} /> Target Pacing Calculation
                                        </span>
                                        <span>Total: {roadmap.pacing.prefix}{roadmap.pacing.totalAmount.toLocaleString()} {roadmap.pacing.unit}</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                                        <div className="bg-brand-bg/80 p-2 rounded-lg border border-brand-border/60">
                                            <div className="text-[9px] text-brand-muted uppercase font-bold">Quarterly</div>
                                            <div className="font-bold text-white">{roadmap.pacing.prefix}{roadmap.pacing.perQuarter.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-brand-bg/80 p-2 rounded-lg border border-brand-border/60">
                                            <div className="text-[9px] text-brand-muted uppercase font-bold">Monthly</div>
                                            <div className="font-bold text-brand-gold">{roadmap.pacing.prefix}{roadmap.pacing.perMonth.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-brand-bg/80 p-2 rounded-lg border border-brand-border/60">
                                            <div className="text-[9px] text-brand-muted uppercase font-bold">Weekly</div>
                                            <div className="font-bold text-white">{roadmap.pacing.prefix}{roadmap.pacing.perWeek.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-brand-bg/80 p-2 rounded-lg border border-brand-border/60">
                                            <div className="text-[9px] text-brand-muted uppercase font-bold">Daily</div>
                                            <div className="font-bold text-emerald-400">{roadmap.pacing.prefix}{roadmap.pacing.perDay.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Milestone Nodes List */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                                    <span>Milestone Checklist ({generatedNodes.filter(n => n.selected).length} selected)</span>
                                    <button
                                        type="button"
                                        onClick={() => setIsGenerated(false)}
                                        className="text-brand-blue hover:underline cursor-pointer flex items-center gap-1"
                                    >
                                        <RefreshCw size={11} /> Adjust Settings
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                                    {generatedNodes.map((node) => {
                                        const isEditing = editingNodeId === node.tempId;

                                        return (
                                            <div
                                                key={node.tempId}
                                                className={cn(
                                                    "p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5",
                                                    node.selected
                                                        ? "bg-brand-surface border-brand-border/80"
                                                        : "bg-brand-surface/30 border-brand-border/40 opacity-50"
                                                )}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleSelect(node.tempId)}
                                                    className="mt-0.5 text-brand-muted hover:text-brand-gold cursor-pointer"
                                                >
                                                    {node.selected ? (
                                                        <CheckCircle2 size={16} className="text-brand-gold" />
                                                    ) : (
                                                        <Circle size={16} />
                                                    )}
                                                </button>

                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={cn(
                                                            "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                                                            node.goalType === "yearly" && "bg-amber-500/10 text-amber-300 border-amber-500/30",
                                                            node.goalType === "quarterly" && "bg-blue-500/10 text-blue-300 border-blue-500/30",
                                                            node.goalType === "monthly" && "bg-purple-500/10 text-purple-300 border-purple-500/30",
                                                            node.goalType === "weekly" && "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
                                                            node.goalType === "daily" && "bg-rose-500/10 text-rose-300 border-rose-500/30"
                                                        )}>
                                                            {node.goalType}
                                                        </span>
                                                        <span className="text-[10px] text-brand-muted font-mono">{node.period}</span>
                                                    </div>

                                                    {isEditing ? (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <input
                                                                type="text"
                                                                value={editingText}
                                                                onChange={(e) => setEditingText(e.target.value)}
                                                                autoFocus
                                                                className="flex-1 bg-brand-bg text-brand-text border border-brand-border rounded-lg px-2 py-1 text-xs"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveEdit(node.tempId)}
                                                                className="p-1 rounded bg-brand-blue text-white"
                                                            >
                                                                <Check size={13} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="font-semibold text-white leading-snug">{node.title}</p>
                                                    )}
                                                    <p className="text-[11px] text-brand-muted leading-relaxed">{node.description}</p>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {!isEditing && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStartEdit(node)}
                                                            className="p-1 text-brand-muted hover:text-white cursor-pointer"
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteNode(node.tempId)}
                                                        className="p-1 text-brand-muted hover:text-red-400 cursor-pointer"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {isGenerated && (
                    <div className="p-4 sm:p-6 border-t border-brand-border flex items-center justify-between gap-3 bg-brand-bg/40">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsGenerated(false)}
                            className="text-xs font-semibold"
                        >
                            Back
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleConfirmAndSave}
                            disabled={isSubmitting || generatedNodes.filter(n => n.selected).length === 0}
                            className="text-xs font-bold uppercase tracking-wider"
                        >
                            {isSubmitting ? "Creating Goals..." : `Create ${generatedNodes.filter(n => n.selected).length} Goals`}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
