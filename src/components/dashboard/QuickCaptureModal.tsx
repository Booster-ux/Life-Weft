"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
    CheckSquare,
    BookOpen,
    Library,
    Timer,
    GitFork,
    Target,
    Sparkles,
    Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: "task" | "goal" | "ledger" | "note" | "deadline" | "decision";
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
    isOpen,
    onClose,
    initialType = "task",
}) => {
    const {
        addTask,
        addGoal,
        addLedgerEntry,
        addKnowledgeItem,
        addDeadline,
        addDecision,
        lifeAreas,
        ledgers,
    } = useApp();

    const [captureType, setCaptureType] = useState<"task" | "goal" | "ledger" | "note" | "deadline" | "decision">(initialType);

    // Sync initialType whenever modal opens
    React.useEffect(() => {
        if (isOpen) {
            setCaptureType(initialType);
        }
    }, [isOpen, initialType]);

    // Common fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedLifeArea, setSelectedLifeArea] = useState<string>("area-personal");

    // Goal specific
    const [goalType, setGoalType] = useState<"yearly" | "quarterly" | "monthly" | "weekly" | "daily">("daily");

    // Task specific
    const [taskPriority, setTaskPriority] = useState<"high" | "normal" | "low">("normal");
    const [taskTime, setTaskTime] = useState<"Morning" | "Afternoon" | "Evening" | "">("Morning");
    const [taskCategory, setTaskCategory] = useState("Personal");

    // Ledger specific
    const [ledgerId, setLedgerId] = useState<string>(ledgers[0]?.id || "ldg-personal");
    const [ledgerTags, setLedgerTags] = useState("");

    // Deadline specific
    const [deadlineDate, setDeadlineDate] = useState("");
    const [deadlinePriority, setDeadlinePriority] = useState<"high" | "normal" | "low">("normal");

    // Decision specific
    const [optionA, setOptionA] = useState("");
    const [optionB, setOptionB] = useState("");

    // Note specific
    const [noteCategory, setNoteCategory] = useState<"Notes" | "Important Information" | "Ideas" | "References" | "Saved Items">("Notes");

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setLedgerTags("");
        setDeadlineDate("");
        setOptionA("");
        setOptionB("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const cleanTitle = title.trim();
        const todayStr = new Date().toISOString().split("T")[0];

        switch (captureType) {
            case "goal":
                addGoal({
                    title: cleanTitle,
                    description: description.trim() || undefined,
                    goalType,
                    lifeAreaId: selectedLifeArea,
                    status: "active",
                    progress: 0,
                });
                break;

            case "task":
                addTask({
                    title: cleanTitle,
                    completed: false,
                    priority: taskPriority,
                    category: taskCategory,
                    time: taskTime || undefined,
                    dueDate: todayStr,
                    lifeAreaId: selectedLifeArea,
                });
                break;

            case "ledger":
                addLedgerEntry({
                    title: cleanTitle,
                    description: description.trim() || cleanTitle,
                    date: todayStr,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    ledgerId: ledgerId || ledgers[0]?.id || "ldg-personal",
                    lifeAreaId: selectedLifeArea,
                    tags: ledgerTags ? ledgerTags.split(",").map(t => t.trim()).filter(Boolean) : ["General"],
                });
                break;

            case "note":
                addKnowledgeItem({
                    title: cleanTitle,
                    content: description.trim() || cleanTitle,
                    category: noteCategory,
                    lifeAreaId: selectedLifeArea,
                });
                break;

            case "deadline":
                addDeadline({
                    title: cleanTitle,
                    dueDate: deadlineDate || todayStr,
                    priority: deadlinePriority,
                    lifeAreaId: selectedLifeArea,
                    notes: description.trim() || undefined,
                    relatedTaskId: "auto-create",
                });
                break;

            case "decision":
                addDecision({
                    title: cleanTitle,
                    situation: description.trim() || cleanTitle,
                    options: [
                        {
                            name: optionA.trim() || "Option A",
                            pros: ["Direct progress", "Tested strategy"],
                            cons: ["Requires focus"],
                            cost: "Standard",
                            time: "Immediate",
                            risks: "Moderate",
                        },
                        {
                            name: optionB.trim() || "Option B",
                            pros: ["Lower friction"],
                            cons: ["Deferred impact"],
                            cost: "Low",
                            time: "Flexible",
                            risks: "Opportunity cost",
                        }
                    ],
                    status: "Under Consideration",
                    lifeAreaId: selectedLifeArea,
                });
                break;
        }

        resetForm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Quick Capture"
            className="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                {/* Type Switcher Tabs */}
                <div className="grid grid-cols-6 gap-1 p-1 bg-brand-bg rounded-lg border border-brand-border text-xs">
                    {[
                        { id: "task", label: "Task", icon: CheckSquare },
                        { id: "goal", label: "Goal", icon: Target },
                        { id: "ledger", label: "Ledger", icon: BookOpen },
                        { id: "note", label: "Note", icon: Library },
                        { id: "deadline", label: "Deadline", icon: Timer },
                        { id: "decision", label: "Decision", icon: GitFork },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = captureType === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setCaptureType(tab.id as any)}
                                className={cn(
                                    "flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all font-semibold gap-1",
                                    isActive
                                        ? "bg-brand-surface text-white border border-brand-blue/50 shadow-sm"
                                        : "text-brand-muted hover:text-brand-text hover:bg-brand-border/20"
                                )}
                            >
                                <Icon size={14} className={isActive ? "text-brand-blue" : "text-brand-muted"} />
                                <span className="text-[10px] tracking-tight">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Input: Title */}
                <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                        {captureType === "task" && "What needs to be done?"}
                        {captureType === "goal" && "What is the milestone or goal?"}
                        {captureType === "ledger" && "What happened in your life?"}
                        {captureType === "note" && "Note / Information Title"}
                        {captureType === "deadline" && "Deadline Milestone Title"}
                        {captureType === "decision" && "What decision are you considering?"}
                    </label>
                    <input
                        type="text"
                        placeholder={
                            captureType === "task"
                                ? "e.g. Schedule meeting with finance team"
                                : captureType === "goal"
                                ? "e.g. Complete MVP launch & acquire 100 beta users"
                                : captureType === "ledger"
                                ? "e.g. Closed our first enterprise agreement"
                                : captureType === "note"
                                ? "e.g. Key takeaways from system architecture doc"
                                : captureType === "deadline"
                                ? "e.g. Finalize Q3 revenue report submission"
                                : "e.g. Choose between AWS vs Supabase for backend"
                        }
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        required
                        className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3.5 py-2.5 text-sm focus:border-brand-blue outline-none placeholder:text-brand-muted/40"
                    />
                </div>

                {/* Optional Details / Content */}
                {captureType !== "task" && (
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            {captureType === "decision" ? "Context & Background" : "Details & Description"}
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Add more details, reflection notes, or background context..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3.5 py-2 text-sm focus:border-brand-blue outline-none resize-none"
                        />
                    </div>
                )}

                {/* Decision Options */}
                {captureType === "decision" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Option A</label>
                            <input
                                type="text"
                                placeholder="Option 1 (e.g. Self-host VPS)"
                                value={optionA}
                                onChange={(e) => setOptionA(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Option B</label>
                            <input
                                type="text"
                                placeholder="Option 2 (e.g. Managed Cloud)"
                                value={optionB}
                                onChange={(e) => setOptionB(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                    </div>
                )}

                {/* Dynamic Configuration Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-brand-border/40">
                    {/* Life Area Selector */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Life Area
                        </label>
                        <select
                            value={selectedLifeArea}
                            onChange={(e) => setSelectedLifeArea(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                        >
                            {lifeAreas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Specific Subtype selector */}
                    {captureType === "goal" && (
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Goal Level</label>
                            <select
                                value={goalType}
                                onChange={(e) => setGoalType(e.target.value as any)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                <option value="daily">Daily Action</option>
                                <option value="weekly">Weekly Focus</option>
                                <option value="monthly">Monthly Goal</option>
                                <option value="quarterly">Quarterly Milestone</option>
                                <option value="yearly">Yearly Vision</option>
                                <option value="custom">Custom Goal</option>
                            </select>
                        </div>
                    )}

                    {captureType === "task" && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Priority</label>
                                <select
                                    value={taskPriority}
                                    onChange={(e) => setTaskPriority(e.target.value as "high" | "normal" | "low")}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                                >
                                    <option value="normal">Normal Priority</option>
                                    <option value="high">High Priority (Gold)</option>
                                    <option value="low">Low Priority</option>
                                </select>
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Time & Target Segment</label>
                                    <span className="text-[9px] text-brand-muted">Auto-sorts into Morning/Afternoon/Evening</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="time"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val) {
                                                const [h] = val.split(":").map(Number);
                                                if (!isNaN(h)) {
                                                    if (h < 12) setTaskTime("Morning");
                                                    else if (h < 17) setTaskTime("Afternoon");
                                                    else setTaskTime("Evening");
                                                }
                                            }
                                        }}
                                        className="bg-brand-bg text-brand-text border border-brand-border rounded-lg px-2.5 py-1.5 text-xs w-28 focus:border-brand-blue"
                                        title="Pick time to auto classify into segment"
                                    />
                                    <select
                                        value={taskTime}
                                        onChange={(e) => setTaskTime(e.target.value as any)}
                                        className="flex-1 bg-brand-bg text-brand-text border border-brand-border rounded-lg px-2.5 py-1.5 text-xs focus:border-brand-blue"
                                    >
                                        <option value="Morning">Morning Focus</option>
                                        <option value="Afternoon">Afternoon Focus</option>
                                        <option value="Evening">Evening Focus</option>
                                        <option value="">Unscheduled</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {captureType === "ledger" && (
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Ledger</label>
                            <select
                                value={ledgerId}
                                onChange={(e) => setLedgerId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                {ledgers.map((ldg) => (
                                    <option key={ldg.id} value={ldg.id}>
                                        {ldg.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {captureType === "deadline" && (
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Target Due Date</label>
                            <input
                                type="date"
                                value={deadlineDate}
                                onChange={(e) => setDeadlineDate(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-1.5 text-xs focus:border-brand-blue outline-none"
                                required
                            />
                        </div>
                    )}

                    {captureType === "note" && (
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Category</label>
                            <select
                                value={noteCategory}
                                onChange={(e) => setNoteCategory(e.target.value as any)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                <option value="Notes">General Notes</option>
                                <option value="Important Information">Important Info</option>
                                <option value="Ideas">Ideas & Inventions</option>
                                <option value="References">References & Links</option>
                                <option value="Saved Items">Saved Items</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border/40">
                    <Button type="button" variant="secondary" onClick={onClose} className="text-xs">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="text-xs font-bold uppercase tracking-wider">
                        Capture {captureType.toUpperCase()}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
