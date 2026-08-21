"use client";

import React, { useState, useEffect } from "react";
import { Goal, useApp } from "@/context/AppContext";
import {
    generateGoalBreakdown,
    BreakdownNode,
    BreakdownRoadmap,
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

    const [goalTitle, setGoalTitle] = useState(baseGoal?.title || "");
    const [goalDescription, setGoalDescription] = useState(baseGoal?.description || "");
    const [selectedAreaId, setSelectedAreaId] = useState(baseGoal?.lifeAreaId || "");
    const [targetYear, setTargetYear] = useState(() => String(new Date().getFullYear()));

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
            const roadmap = generateGoalBreakdown(
                baseGoal.title,
                baseGoal.description || "",
                area?.name || "General",
                baseGoal.lifeAreaId,
                currentYearStr
            );
            // Skip the root node if the yearly goal already exists
            const childNodes = roadmap.nodes.filter((n) => n.goalType !== "yearly").map((n) => {
                if (n.parentTempId && n.parentTempId.startsWith("root-")) {
                    return { ...n, parentTempId: baseGoal.id };
                }
                return n;
            });
            setGeneratedNodes(childNodes);
            setIsGenerated(true);
        }
    }, [baseGoal, lifeAreas]);

    const handleGenerate = () => {
        if (!goalTitle.trim()) return;

        const area = lifeAreas.find((a) => a.id === selectedAreaId);
        const roadmap = generateGoalBreakdown(
            goalTitle.trim(),
            goalDescription.trim(),
            area?.name || "General",
            selectedAreaId || undefined,
            targetYear
        );

        setGeneratedNodes(roadmap.nodes);
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

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
            <div className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-0 my-8">
                {/* Header */}
                <div className="p-6 border-b border-brand-border flex items-center justify-between gap-4 bg-gradient-to-r from-brand-bg to-brand-surface">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
                            <Sparkles size={18} className="text-brand-gold" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">
                                Lifeweft Goal Breakdown Wizard
                            </h2>
                            <p className="text-xs text-brand-muted">
                                Deconstruct a large vision into actionable quarterly, monthly, weekly, and daily milestones.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-white hover:bg-brand-border/30 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
                    {/* Step 1: Input Master Goal if not pre-generated */}
                    {!isGenerated && (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                                    Yearly Vision / Large Goal
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Become a full-time freelance web developer"
                                    value={goalTitle}
                                    onChange={(e) => setGoalTitle(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-4 py-3 text-sm focus:border-brand-blue outline-none transition-all placeholder:text-brand-muted/40"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                                    Description & Key Context (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Focus on Next.js, Supabase, acquiring 5 clients, and reaching $4,000/mo."
                                    value={goalDescription}
                                    onChange={(e) => setGoalDescription(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-4 py-2.5 text-xs focus:border-brand-blue outline-none transition-all placeholder:text-brand-muted/40"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                                        Life Area
                                    </label>
                                    <select
                                        value={selectedAreaId}
                                        onChange={(e) => setSelectedAreaId(e.target.value)}
                                        className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2.5 text-xs focus:border-brand-blue outline-none"
                                    >
                                        <option value="">General / None</option>
                                        {lifeAreas.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                                        Target Year
                                    </label>
                                    <input
                                        type="text"
                                        value={targetYear}
                                        onChange={(e) => setTargetYear(e.target.value)}
                                        className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2.5 text-xs font-mono focus:border-brand-blue outline-none"
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleGenerate}
                                className="w-full py-3 justify-center text-xs font-bold uppercase tracking-wider mt-2"
                            >
                                <Sparkles size={14} className="mr-1.5 text-brand-gold" />
                                Generate Suggested Roadmap
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Review, Edit & Confirm Roadmap */}
                    {isGenerated && (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between bg-brand-bg/60 p-3.5 rounded-xl border border-brand-border">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                                        Suggested Roadmap
                                    </span>
                                    <h3 className="text-sm font-bold text-white mt-0.5">
                                        {goalTitle || baseGoal?.title}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    className="px-2.5 py-1.5 rounded-lg border border-brand-border hover:bg-brand-border/40 text-brand-muted hover:text-white text-xs flex items-center gap-1.5 transition-all"
                                >
                                    <RefreshCw size={12} />
                                    <span>Regenerate</span>
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between text-xs text-brand-muted px-1">
                                    <span>Select the milestones you wish to adopt:</span>
                                    <span className="font-mono">
                                        {generatedNodes.filter((n) => n.selected).length} of {generatedNodes.length} selected
                                    </span>
                                </div>

                                {generatedNodes.map((node) => {
                                    const isEditing = editingNodeId === node.tempId;

                                    const indentClasses =
                                        node.goalType === "yearly"
                                            ? "border-purple-800/40 bg-purple-950/20"
                                            : node.goalType === "quarterly"
                                            ? "ml-3 border-blue-800/40 bg-blue-950/20"
                                            : node.goalType === "monthly"
                                            ? "ml-6 border-emerald-800/40 bg-emerald-950/20"
                                            : node.goalType === "weekly"
                                            ? "ml-9 border-amber-800/40 bg-amber-950/20"
                                            : "ml-12 border-rose-800/40 bg-rose-950/20";

                                    return (
                                        <div
                                            key={node.tempId}
                                            className={cn(
                                                "p-3 rounded-xl border transition-all flex items-start justify-between gap-3 text-xs",
                                                indentClasses,
                                                !node.selected && "opacity-40 bg-brand-bg/40 border-brand-border/30"
                                            )}
                                        >
                                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleSelect(node.tempId)}
                                                    className="mt-0.5 text-brand-muted hover:text-white transition-colors flex-shrink-0"
                                                >
                                                    {node.selected ? (
                                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                                    ) : (
                                                        <Circle size={16} className="text-brand-muted" />
                                                    )}
                                                </button>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider bg-brand-surface font-mono text-brand-muted">
                                                            {node.goalType}
                                                        </span>
                                                        <span className="text-[10px] text-brand-muted font-mono">
                                                            {node.period}
                                                        </span>
                                                    </div>

                                                    {isEditing ? (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <input
                                                                type="text"
                                                                value={editingText}
                                                                onChange={(e) => setEditingText(e.target.value)}
                                                                className="flex-1 bg-brand-bg border border-brand-blue rounded px-2 py-1 text-xs text-white outline-none"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveEdit(node.tempId)}
                                                                className="p-1 text-emerald-400 hover:text-white"
                                                            >
                                                                <Check size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="font-semibold text-white leading-snug">
                                                            {node.title}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleStartEdit(node)}
                                                    className="p-1 text-brand-muted hover:text-white transition-colors"
                                                    title="Edit title"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteNode(node.tempId)}
                                                    className="p-1 text-brand-muted hover:text-red-400 transition-colors"
                                                    title="Remove node"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {isGenerated && (
                    <div className="p-5 border-t border-brand-border bg-brand-bg/80 flex items-center justify-between gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsGenerated(false)}
                            className="text-xs"
                        >
                            Back to Inputs
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                className="text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                loading={isSubmitting}
                                onClick={handleConfirmAndSave}
                                className="text-xs font-bold uppercase tracking-wider"
                            >
                                Adopt & Save Roadmap
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
