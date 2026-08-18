"use client";

import React from "react";
import { LedgerEntry, useApp } from "@/context/AppContext";
import {
    Calendar,
    Clock,
    Tag,
    Paperclip,
    CheckSquare,
    Timer,
    GitFork,
    Trash2,
    Edit2,
    BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LedgerEntryCardProps {
    entry: LedgerEntry;
    onEdit?: (entry: LedgerEntry) => void;
}

export const LedgerEntryCard: React.FC<LedgerEntryCardProps> = ({ entry, onEdit }) => {
    const { ledgers, lifeAreas, tasks, deadlines, decisions, deleteLedgerEntry } = useApp();

    const ledger = ledgers.find((l) => l.id === entry.ledgerId);
    const lifeArea = lifeAreas.find((a) => a.id === entry.lifeAreaId);
    const relatedTask = tasks.find((t) => t.id === entry.relatedTaskId);
    const relatedDeadline = deadlines.find((d) => d.id === entry.relatedDeadlineId);
    const relatedDecision = decisions.find((dec) => dec.id === entry.relatedDecisionId);

    return (
        <div className="relative pl-6 sm:pl-8 pb-8 group last:pb-2">
            {/* Timeline Vertical Track */}
            <div className="absolute left-2.5 sm:left-3 top-4 bottom-0 w-[2px] bg-brand-border/60 group-last:hidden" />

            {/* Timeline Node Icon */}
            <div
                className="absolute left-0 sm:left-0.5 top-1.5 h-6 w-6 rounded-full bg-brand-surface border-2 border-brand-gold flex items-center justify-center shadow-md shadow-brand-gold/10"
                style={{ borderColor: ledger?.color || "#D4A72C" }}
            >
                <BookOpen size={11} className="text-brand-gold" style={{ color: ledger?.color || "#D4A72C" }} />
            </div>

            {/* Card Content Body */}
            <div className="bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-brand-blue/30 transition-all duration-200 shadow-sm group-hover:shadow-md space-y-3">
                {/* Header: Ledger badge, Date/Time, and Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/40 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Ledger badge */}
                        <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border bg-brand-bg"
                            style={{
                                color: ledger?.color || "#D4A72C",
                                borderColor: `${ledger?.color || "#D4A72C"}40`,
                            }}
                        >
                            {ledger?.name || "General Ledger"}
                        </span>

                        {/* Life Area badge */}
                        {lifeArea && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-border/40 text-brand-muted border border-brand-border">
                                {lifeArea.name}
                            </span>
                        )}

                        {/* Date & Time */}
                        <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                            <Calendar size={12} className="text-brand-muted/70" />
                            <span className="font-mono text-[11px]">{entry.date}</span>
                            {entry.time && (
                                <>
                                    <span className="text-brand-muted/40">•</span>
                                    <Clock size={11} className="text-brand-muted/70" />
                                    <span className="font-mono text-[11px]">{entry.time}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(entry)}
                                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-border/50 transition-colors cursor-pointer"
                                title="Edit entry"
                            >
                                <Edit2 size={13} />
                            </button>
                        )}
                        <button
                            onClick={() => deleteLedgerEntry(entry.id)}
                            className="p-1.5 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                            title="Delete entry"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>

                {/* Title & Description */}
                <div>
                    <h3 className="text-base font-bold text-brand-text tracking-tight select-text">
                        {entry.title}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1.5 leading-relaxed select-text whitespace-pre-wrap">
                        {entry.description}
                    </p>
                </div>

                {/* Attachment Badge */}
                {entry.attachment && (
                    <div className="inline-flex items-center gap-2 bg-brand-bg px-3 py-1.5 rounded-lg border border-brand-border text-xs text-brand-text/90 max-w-full">
                        <Paperclip size={13} className="text-brand-blue flex-shrink-0" />
                        <span className="truncate font-mono text-[11px]">{entry.attachment.name}</span>
                    </div>
                )}

                {/* Tags List */}
                {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {entry.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-muted bg-brand-bg px-2 py-0.5 rounded border border-brand-border/60"
                            >
                                <Tag size={9} className="opacity-60" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Connected Relations (Task, Deadline, Decision) */}
                {(relatedTask || relatedDeadline || relatedDecision) && (
                    <div className="pt-2 border-t border-brand-border/40 flex flex-wrap gap-2 text-[11px]">
                        {relatedTask && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
                                <CheckSquare size={12} />
                                <span className="font-medium truncate max-w-[200px]">Task: {relatedTask.title}</span>
                            </div>
                        )}

                        {relatedDeadline && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-gold/10 border border-brand-gold/20 text-brand-gold">
                                <Timer size={12} />
                                <span className="font-medium truncate max-w-[200px]">Deadline: {relatedDeadline.title} ({relatedDeadline.dueDate})</span>
                            </div>
                        )}

                        {relatedDecision && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/30 border border-indigo-800/40 text-indigo-300">
                                <GitFork size={12} />
                                <span className="font-medium truncate max-w-[200px]">Decision: {relatedDecision.title || relatedDecision.situation}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
