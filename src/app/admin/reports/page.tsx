"use client";

import React, { useState, useEffect } from "react";
import {
    LifeBuoy,
    AlertCircle,
    CheckCircle2,
    Clock,
    RefreshCw,
    Filter,
    MessageSquare,
    Check,
} from "lucide-react";

interface ReportItem {
    id: string;
    user_id: string | null;
    title: string;
    description: string;
    category: "bug" | "feature" | "feedback" | "account" | "general";
    status: "open" | "in_progress" | "resolved" | "closed";
    priority: "low" | "normal" | "high" | "urgent";
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [activeNotes, setActiveNotes] = useState<{ [id: string]: string }>({});

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/reports");
            const data = await res.json();
            if (data.reports) {
                setReports(data.reports);
            }
        } catch {
            // Fail silently or set empty
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId: string, newStatus: ReportItem["status"]) => {
        setUpdatingId(reportId);
        try {
            const res = await fetch("/api/admin/reports", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reportId,
                    status: newStatus,
                    adminNotes: activeNotes[reportId],
                }),
            });

            if (res.ok) {
                setReports((prev) =>
                    prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
                );
            }
        } catch {
            // Handled
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredReports = reports.filter((r) => {
        if (statusFilter === "all") return true;
        return r.status === statusFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <LifeBuoy className="text-amber-400" />
                        System Reports & User Feedback
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Review customer issues, bug tickets, feature proposals, and resolve feedback items.
                    </p>
                </div>

                <button
                    onClick={fetchReports}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer w-fit"
                >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                    Refresh Tickets
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {["all", "open", "in_progress", "resolved", "closed"].map((st) => (
                    <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[11px] transition-colors cursor-pointer ${
                            statusFilter === st
                                ? "bg-brand-blue text-white"
                                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                        }`}
                    >
                        {st.replace("_", " ")}
                    </button>
                ))}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
                        <RefreshCw size={18} className="animate-spin text-brand-blue mx-auto mb-2" />
                        Loading reports...
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
                        <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2 opacity-80" />
                        <p className="font-semibold text-white">No reports currently in this view.</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                            System health is stable and no open user tickets match the filter.
                        </p>
                    </div>
                ) : (
                    filteredReports.map((r) => (
                        <div
                            key={r.id}
                            className="bg-[#0D121F] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                            r.status === "open"
                                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                                : r.status === "in_progress"
                                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        }`}
                                    >
                                        {r.status}
                                    </span>
                                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold">
                                        {r.category}
                                    </span>
                                    <h3 className="text-sm font-bold text-white">{r.title}</h3>
                                </div>

                                <span className="text-[11px] text-slate-500">
                                    {new Date(r.created_at).toLocaleString()}
                                </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed bg-[#090D16] p-3 rounded-lg border border-slate-800/80">
                                {r.description}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                                <div className="text-[11px] text-slate-400 font-mono">
                                    Author ID: {r.user_id ? `${r.user_id.substring(0, 16)}...` : "System / Guest"}
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={r.status}
                                        disabled={updatingId === r.id}
                                        onChange={(e) => handleUpdateStatus(r.id, e.target.value as any)}
                                        className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-brand-blue cursor-pointer"
                                    >
                                        <option value="open">Mark Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
