"use client";

import React, { useState } from "react";
import { useApp, Decision } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
    GitFork,
    Lightbulb,
    Scale,
    Sparkles,
    Check,
    Trash2,
    ArrowRight,
    Plus,
    Tag,
    Edit2,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DecisionsPage() {
    const { decisions, addDecision, updateDecision, deleteDecision, lifeAreas } = useApp();

    const [selectedDecision, setSelectedDecision] = useState<Decision | null>(decisions[0] || null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form states for creation
    const [decisionTitle, setDecisionTitle] = useState("");
    const [decisionSituation, setDecisionSituation] = useState("");
    const [decisionStatus, setDecisionStatus] = useState<Decision["status"]>("Under Consideration");
    const [chosenOption, setChosenOption] = useState("");
    const [reason, setReason] = useState("");
    const [expectedOutcome, setExpectedOutcome] = useState("");
    const [actualOutcome, setActualOutcome] = useState("");
    const [lifeAreaId, setLifeAreaId] = useState("area-business");

    // Option 1
    const [opt1Name, setOpt1Name] = useState("");
    const [opt1Pros, setOpt1Pros] = useState("");
    const [opt1Cons, setOpt1Cons] = useState("");
    const [opt1Cost, setOpt1Cost] = useState("Low");
    const [opt1Time, setOpt1Time] = useState("Weeks");
    const [opt1Risks, setOpt1Risks] = useState("");

    // Option 2
    const [opt2Name, setOpt2Name] = useState("");
    const [opt2Pros, setOpt2Pros] = useState("");
    const [opt2Cons, setOpt2Cons] = useState("");
    const [opt2Cost, setOpt2Cost] = useState("Medium");
    const [opt2Time, setOpt2Time] = useState("Months");
    const [opt2Risks, setOpt2Risks] = useState("");

    const handleOpenCreateModal = () => {
        setDecisionTitle("");
        setDecisionSituation("");
        setDecisionStatus("Under Consideration");
        setChosenOption("");
        setReason("");
        setExpectedOutcome("");
        setActualOutcome("");
        setLifeAreaId(lifeAreas[0]?.id || "area-business");

        setOpt1Name("Option A");
        setOpt1Pros("High initial velocity, lower capital requirement");
        setOpt1Cons("Maintenance overhead downstream");
        setOpt1Cost("Low");
        setOpt1Time("2-4 Weeks");
        setOpt1Risks("Moderate technical debt");

        setOpt2Name("Option B");
        setOpt2Pros("Scalable foundation, robust data integrity");
        setOpt2Cons("Higher upfront learning curve");
        setOpt2Cost("Medium");
        setOpt2Time("1-2 Months");
        setOpt2Risks("Slower initial deployment");

        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!decisionTitle.trim() || !decisionSituation.trim()) return;

        const newOptions = [
            {
                name: opt1Name.trim() || "Option A",
                pros: opt1Pros.split(",").map(s => s.trim()).filter(Boolean),
                cons: opt1Cons.split(",").map(s => s.trim()).filter(Boolean),
                cost: opt1Cost,
                time: opt1Time,
                risks: opt1Risks || "Low risk",
            },
            {
                name: opt2Name.trim() || "Option B",
                pros: opt2Pros.split(",").map(s => s.trim()).filter(Boolean),
                cons: opt2Cons.split(",").map(s => s.trim()).filter(Boolean),
                cost: opt2Cost,
                time: opt2Time,
                risks: opt2Risks || "Low risk",
            },
        ];

        addDecision({
            title: decisionTitle.trim(),
            situation: decisionSituation.trim(),
            options: newOptions,
            chosenOption: chosenOption.trim() || undefined,
            reason: reason.trim() || undefined,
            expectedOutcome: expectedOutcome.trim() || undefined,
            actualOutcome: actualOutcome.trim() || undefined,
            status: decisionStatus,
            lifeAreaId,
        });

        setIsCreateModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <GitFork className="text-indigo-400" />
                        Decision Journal
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Document strategic dilemmas, trade-offs, chosen paths, and post-outcome reviews.
                    </p>
                </div>

                <Button
                    onClick={handleOpenCreateModal}
                    variant="primary"
                    size="sm"
                    className="font-bold flex items-center gap-1.5 text-xs"
                >
                    <Plus size={16} />
                    Log New Decision
                </Button>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: List of Saved Decisions */}
                <div className="lg:col-span-1 space-y-3">
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                        Recorded Decisions ({decisions.length})
                    </h3>

                    {decisions.length === 0 ? (
                        <div className="bg-brand-surface/40 border border-brand-border/60 border-dashed rounded-xl p-8 text-center text-brand-muted text-xs">
                            No decisions recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {decisions.map((dec) => {
                                const isSelected = selectedDecision?.id === dec.id;
                                return (
                                    <div
                                        key={dec.id}
                                        onClick={() => setSelectedDecision(dec)}
                                        className={cn(
                                            "p-4 bg-brand-surface border rounded-xl cursor-pointer transition-all duration-150 group space-y-1.5",
                                            isSelected
                                                ? "border-brand-blue bg-brand-surface shadow-md"
                                                : "border-brand-border hover:border-brand-border/80"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={cn(
                                                    "text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border",
                                                    dec.status === "Decided"
                                                        ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/40"
                                                        : dec.status === "Reviewed"
                                                            ? "bg-brand-blue/10 text-brand-blue border-brand-blue/30"
                                                            : "bg-brand-gold/10 text-brand-gold border-brand-gold/30"
                                                )}
                                            >
                                                {dec.status}
                                            </span>
                                            <span className="text-[10px] text-brand-muted font-mono">{dec.createdAt}</span>
                                        </div>

                                        <h4 className="text-xs font-bold text-brand-text group-hover:text-white line-clamp-1">
                                            {dec.title || dec.situation}
                                        </h4>

                                        <p className="text-[11px] text-brand-muted line-clamp-2">
                                            {dec.situation}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right 2 Columns: Detailed Decision View */}
                <div className="lg:col-span-2">
                    {selectedDecision ? (
                        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-150">
                            {/* Decision Header */}
                            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-brand-border/40 pb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-bold px-2 py-0.5 rounded">
                                            Decision Record
                                        </span>
                                        <span className="text-[10px] text-brand-muted font-mono">
                                            Logged: {selectedDecision.createdAt}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-black text-white tracking-tight">
                                        {selectedDecision.title || selectedDecision.situation}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => deleteDecision(selectedDecision.id)}
                                        className="p-1.5 text-brand-muted hover:text-red-400 rounded transition-colors cursor-pointer"
                                        title="Delete decision"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Situation Context */}
                            <div className="space-y-1 bg-brand-bg/40 border border-brand-border/60 rounded-lg p-3.5">
                                <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                                    Situation & Dilemma
                                </h4>
                                <p className="text-xs text-brand-text leading-relaxed select-text">
                                    {selectedDecision.situation}
                                </p>
                            </div>

                            {/* Evaluated Options Comparison */}
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                                    Options Evaluated
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedDecision.options.map((opt, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-brand-bg/60 border border-brand-border/60 rounded-lg p-4 space-y-3"
                                        >
                                            <h5 className="font-bold text-xs text-white border-b border-brand-border/60 pb-1.5">
                                                {opt.name}
                                            </h5>

                                            {/* Pros */}
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Pros</p>
                                                <ul className="space-y-1 pl-1">
                                                    {opt.pros.map((p, pIdx) => (
                                                        <li key={pIdx} className="text-xs text-brand-text flex items-start gap-1.5 leading-snug">
                                                            <span className="text-emerald-400 text-[10px] mt-0.5">✓</span>
                                                            <span>{p}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Cons */}
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Cons</p>
                                                <ul className="space-y-1 pl-1">
                                                    {opt.cons.map((c, cIdx) => (
                                                        <li key={cIdx} className="text-xs text-brand-muted flex items-start gap-1.5 leading-snug">
                                                            <span className="text-rose-400 text-[10px] mt-0.5">×</span>
                                                            <span>{c}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Meta */}
                                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brand-border/40 text-[10px]">
                                                <div>
                                                    <span className="text-brand-muted block">Cost:</span>
                                                    <span className="font-bold text-white">{opt.cost}</span>
                                                </div>
                                                <div>
                                                    <span className="text-brand-muted block">Time:</span>
                                                    <span className="font-bold text-white">{opt.time}</span>
                                                </div>
                                                <div>
                                                    <span className="text-brand-muted block">Risk:</span>
                                                    <span className="font-semibold text-brand-gold truncate block">{opt.risks}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chosen Option & Rationale */}
                            <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-lg p-4 space-y-2">
                                <h4 className="text-xs font-bold text-brand-blue uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                    <Check size={13} className="text-brand-gold" />
                                    Chosen Path & Rationale
                                </h4>
                                <p className="text-xs font-bold text-white">
                                    {selectedDecision.chosenOption || "Under Active Evaluation"}
                                </p>
                                {selectedDecision.reason && (
                                    <p className="text-xs text-brand-muted leading-relaxed">
                                        <b>Why:</b> {selectedDecision.reason}
                                    </p>
                                )}
                            </div>

                            {/* Outcome Reflection */}
                            {(selectedDecision.expectedOutcome || selectedDecision.actualOutcome) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    {selectedDecision.expectedOutcome && (
                                        <div className="bg-brand-bg/40 border border-brand-border/60 rounded-lg p-3 space-y-1">
                                            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Expected Outcome</p>
                                            <p className="text-xs text-brand-text leading-relaxed">{selectedDecision.expectedOutcome}</p>
                                        </div>
                                    )}

                                    {selectedDecision.actualOutcome && (
                                        <div className="bg-brand-bg/40 border border-brand-border/60 rounded-lg p-3 space-y-1">
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Actual Outcome</p>
                                            <p className="text-xs text-brand-text leading-relaxed">{selectedDecision.actualOutcome}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-brand-surface/20 border border-brand-border border-dashed rounded-xl p-12 text-center min-h-[400px] flex flex-col justify-center items-center space-y-3">
                            <Scale size={28} className="text-brand-muted" />
                            <h3 className="text-sm font-bold text-white">Decision Journal Ready</h3>
                            <p className="text-xs text-brand-muted max-w-sm">
                                Select a decision from the left panel or click "Log New Decision" to document options and trade-offs.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Log New Decision Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Log Strategic Decision"
                className="max-w-2xl"
            >
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Decision Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Supabase vs Firebase for Database & Auth"
                            value={decisionTitle}
                            onChange={(e) => setDecisionTitle(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Situation & Dilemma</label>
                        <textarea
                            rows={3}
                            placeholder="What dilemma or fork in the road are you facing?"
                            value={decisionSituation}
                            onChange={(e) => setDecisionSituation(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg p-3 text-xs focus:border-brand-blue outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Option 1 */}
                        <div className="bg-brand-bg p-3 rounded-lg border border-brand-border space-y-2">
                            <label className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">Option A</label>
                            <input
                                type="text"
                                placeholder="Option A Name"
                                value={opt1Name}
                                onChange={(e) => setOpt1Name(e.target.value)}
                                className="w-full bg-brand-surface text-brand-text border border-brand-border rounded px-2.5 py-1.5 text-xs"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Pros (comma separated)"
                                value={opt1Pros}
                                onChange={(e) => setOpt1Pros(e.target.value)}
                                className="w-full bg-brand-surface text-brand-text border border-brand-border rounded px-2.5 py-1.5 text-xs"
                            />
                            <input
                                type="text"
                                placeholder="Cons (comma separated)"
                                value={opt1Cons}
                                onChange={(e) => setOpt1Cons(e.target.value)}
                                className="w-full bg-brand-surface text-brand-text border border-brand-border rounded px-2.5 py-1.5 text-xs"
                            />
                        </div>

                        {/* Option 2 */}
                        <div className="bg-brand-bg p-3 rounded-lg border border-brand-border space-y-2">
                            <label className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">Option B</label>
                            <input
                                type="text"
                                placeholder="Option B Name"
                                value={opt2Name}
                                onChange={(e) => setOpt2Name(e.target.value)}
                                className="w-full bg-brand-surface text-brand-text border border-brand-border rounded px-2.5 py-1.5 text-xs"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Pros (comma separated)"
                                value={opt2Pros}
                                onChange={(e) => setOpt2Pros(e.target.value)}
                                className="w-full bg-brand-surface text-brand-text border border-brand-border rounded px-2.5 py-1.5 text-xs"
                            />
                            <input
                                type="text"
                                placeholder="Cons (comma separated)"
                                value={opt2Cons}
                                onChange={(e) => setOpt2Cons(e.target.value)}
                                className="w-full bg-brand-surface text-brand-text border border-brand-border rounded px-2.5 py-1.5 text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Chosen Option (If decided)</label>
                            <input
                                type="text"
                                placeholder="e.g. Option A: Supabase"
                                value={chosenOption}
                                onChange={(e) => setChosenOption(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Decision Status</label>
                            <select
                                value={decisionStatus}
                                onChange={(e) => setDecisionStatus(e.target.value as Decision["status"])}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                <option value="Under Consideration">Under Consideration</option>
                                <option value="Decided">Decided</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Reason for choice</label>
                        <input
                            type="text"
                            placeholder="Why did you select this path over the alternatives?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-brand-border/40">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" className="font-semibold">
                            Commit Decision
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
