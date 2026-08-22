"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
    Moon,
    Sparkles,
    CheckCircle2,
    BookOpen,
    X,
    Save,
    ArrowRight,
    HelpCircle,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatLocalDate } from "@/lib/utils/dateTime";

interface EveningReflectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: () => void;
}

export const EveningReflectionModal: React.FC<EveningReflectionModalProps> = ({
    isOpen,
    onClose,
    onSaved,
}) => {
    const { saveReflectionToLedger, userTimezone } = useApp();

    const [accomplished, setAccomplished] = useState("");
    const [incomplete, setIncomplete] = useState("");
    const [highlights, setHighlights] = useState("");
    const [learnings, setLearnings] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    if (!isOpen) return null;

    const todayDisplay = formatLocalDate(new Date(), userTimezone, {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accomplished.trim() && !highlights.trim() && !learnings.trim() && !notes.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await saveReflectionToLedger({
                accomplished,
                incomplete,
                highlights,
                learnings,
                notes,
            });

            setSavedSuccess(true);
            setTimeout(() => {
                setSavedSuccess(false);
                if (onSaved) onSaved();
                onClose();
            }, 1200);
        } catch (err) {
            console.error("Failed to save reflection:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in font-sans">
            <div className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-0 my-4 sm:my-8">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-brand-border flex items-center justify-between gap-4 bg-gradient-to-r from-brand-bg to-brand-surface">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                            <Moon size={20} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                Evening Reflection
                            </h2>
                            <p className="text-xs text-brand-muted">
                                {todayDisplay} • Turn today's actions into lasting wisdom.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-white hover:bg-brand-border/30 transition-all cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Prompt 1: Accomplished */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-400" />
                            What did you accomplish today?
                        </label>
                        <textarea
                            rows={2}
                            placeholder="e.g. Shipped the user authentication flow, completed 45-min workout..."
                            value={accomplished}
                            onChange={(e) => setAccomplished(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40 resize-none"
                        />
                    </div>

                    {/* Prompt 2: Incomplete / Carry-over */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <HelpCircle size={13} className="text-amber-400" />
                            What didn't you complete? (Any carry-over for tomorrow?)
                        </label>
                        <textarea
                            rows={2}
                            placeholder="e.g. Need to finish integration tests tomorrow morning..."
                            value={incomplete}
                            onChange={(e) => setIncomplete(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40 resize-none"
                        />
                    </div>

                    {/* Prompt 3: What happened / Story */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                            <BookOpen size={13} className="text-brand-gold" />
                            What happened today? (Events, meetings, moments)
                        </label>
                        <textarea
                            rows={2}
                            placeholder="e.g. Met with beta customer; they loved the fast load times..."
                            value={highlights}
                            onChange={(e) => setHighlights(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40 resize-none"
                        />
                    </div>

                    {/* Prompt 4: Learnings & Insights */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Sparkles size={13} className="text-purple-400" />
                            What did you learn today?
                        </label>
                        <textarea
                            rows={2}
                            placeholder="e.g. Clear scopes prevent scope creep. Protecting morning focus increases momentum..."
                            value={learnings}
                            onChange={(e) => setLearnings(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40 resize-none"
                        />
                    </div>

                    {/* Prompt 5: Things to remember */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Calendar size={13} className="text-cyan-400" />
                            Is there anything you want to remember?
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Schedule follow-up with design team on Friday..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2 text-xs focus:border-brand-blue outline-none placeholder:text-brand-muted/40"
                        />
                    </div>

                    {/* Ledger Integration Note */}
                    <div className="p-3 bg-brand-bg/90 rounded-xl border border-brand-border/70 flex items-center justify-between text-xs text-brand-muted">
                        <span className="flex items-center gap-1.5 text-[11px]">
                            <BookOpen size={13} className="text-brand-gold" />
                            Automatically saved into your <b>Personal Ledger</b> as a chronicle entry.
                        </span>
                    </div>

                    {/* Footer buttons */}
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
                            disabled={isSubmitting || (!accomplished.trim() && !highlights.trim() && !learnings.trim() && !notes.trim())}
                            className="text-xs font-bold uppercase tracking-wider bg-brand-gold text-black hover:bg-amber-400"
                        >
                            {savedSuccess ? "Saved to Ledger!" : isSubmitting ? "Saving..." : "Save to Personal Ledger"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
