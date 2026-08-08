"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DeadlineCard } from "@/components/dashboard/DeadlineCard";
import { Button } from "@/components/ui/Button";
import { CalendarClock, Plus, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function DeadlinesPage() {
    const { deadlines } = useApp();

    // Handle open add deadline modal in layout shell
    const handleOpenAddDeadline = () => {
        window.dispatchEvent(new Event("dd-open-deadline-modal"));
    };

    // Segment deadlines
    const overdueDeadlines = deadlines.filter((d) => !d.completed && d.daysLeft < 0);
    const activeDeadlines = deadlines.filter((d) => !d.completed && d.daysLeft >= 0).sort((a, b) => a.daysLeft - b.daysLeft);
    const completedDeadlines = deadlines.filter((d) => d.completed);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        Deadline Tracker
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Keep visual tabs on approaching targets, assignments, and product alpha launches.
                    </p>
                </div>
                <Button onClick={handleOpenAddDeadline} variant="primary" size="sm" className="font-bold flex items-center gap-1">
                    <Plus size={16} />
                    Add Deadline
                </Button>
            </div>

            {/* Deadlines list grid */}
            <div className="space-y-8">
                {/* Section 1: Overdue ones */}
                {overdueDeadlines.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                            <AlertCircle size={14} className="animate-pulse" />
                            Overdue Target Dates ({overdueDeadlines.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                            {overdueDeadlines.map((deadline) => (
                                <div key={deadline.id} className="border-l-4 border-red-500 rounded-lg">
                                    <DeadlineCard deadline={deadline} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 2: Active / Upcoming */}
                <div className="space-y-3.5">
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest flex items-center gap-1.5 leading-none">
                        <Clock size={14} className="text-brand-blue" />
                        Upcoming Goals ({activeDeadlines.length})
                    </h3>
                    {activeDeadlines.length === 0 ? (
                        <div className="text-center p-10 bg-brand-surface/30 border border-dashed border-brand-border rounded-xl">
                            <CalendarClock className="mx-auto text-brand-muted mb-2.5" size={28} />
                            <p className="text-xs text-brand-muted">No pending deadlines scheduled. Focus on today's plans!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                            {activeDeadlines.map((deadline) => (
                                <DeadlineCard key={deadline.id} deadline={deadline} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Section 3: Completed */}
                {completedDeadlines.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-brand-border/40">
                        <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest flex items-center gap-1.5 leading-none">
                            <CheckCircle size={14} className="text-emerald-400 animate-fade-in" />
                            Completed Milestones ({completedDeadlines.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                            {completedDeadlines.map((deadline) => (
                                <DeadlineCard key={deadline.id} deadline={deadline} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
