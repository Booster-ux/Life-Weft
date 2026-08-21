"use client";

import React, { useState } from "react";
import { useApp, LedgerEntry, Ledger } from "@/context/AppContext";
import { LedgerEntryCard } from "@/components/dashboard/LedgerEntryCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    Tag,
    Layers,
    Calendar,
    Paperclip,
    FolderPlus,
    SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocalDateString, formatLocalTime } from "@/lib/utils/dateTime";

export default function LedgerPage() {
    const {
        ledgers,
        ledgerEntries,
        lifeAreas,
        tasks,
        deadlines,
        decisions,
        userTimezone,
        addLedger,
        addLedgerEntry,
        updateLedgerEntry,
    } = useApp();

    const [selectedLedgerId, setSelectedLedgerId] = useState<string>("all");
    const [selectedLifeAreaId, setSelectedLifeAreaId] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string>("all");

    // Create / Edit Entry Modal
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);

    // Form states
    const [entryTitle, setEntryTitle] = useState("");
    const [entryDescription, setEntryDescription] = useState("");
    const [entryDate, setEntryDate] = useState(() => getLocalDateString(new Date(), userTimezone));
    const [entryTime, setEntryTime] = useState("12:00");
    const [entryLedgerId, setEntryLedgerId] = useState<string>(ledgers[0]?.id || "ldg-personal");
    const [entryLifeAreaId, setEntryLifeAreaId] = useState<string>("area-personal");
    const [entryTags, setEntryTags] = useState("");
    const [entryAttachmentName, setEntryAttachmentName] = useState("");
    const [entryRelatedTaskId, setEntryRelatedTaskId] = useState<string>("");
    const [entryRelatedDeadlineId, setEntryRelatedDeadlineId] = useState<string>("");
    const [entryRelatedDecisionId, setEntryRelatedDecisionId] = useState<string>("");

    // Create Ledger Modal
    const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
    const [newLedgerName, setNewLedgerName] = useState("");
    const [newLedgerDescription, setNewLedgerDescription] = useState("");
    const [newLedgerColor, setNewLedgerColor] = useState("#D4A72C");

    // Extract all unique tags across entries
    const allTags = Array.from(new Set(ledgerEntries.flatMap((e) => e.tags || [])));

    // Filter entries chronologically
    const filteredEntries = ledgerEntries
        .filter((entry) => {
            // Ledger filter
            if (selectedLedgerId !== "all" && entry.ledgerId !== selectedLedgerId) return false;
            // Life Area filter
            if (selectedLifeAreaId !== "all" && entry.lifeAreaId !== selectedLifeAreaId) return false;
            // Tag filter
            if (selectedTag !== "all" && !entry.tags.includes(selectedTag)) return false;
            // Search query
            if (searchQuery.trim()) {
                const lowerQ = searchQuery.toLowerCase();
                const matchTitle = entry.title.toLowerCase().includes(lowerQ);
                const matchDesc = entry.description.toLowerCase().includes(lowerQ);
                const matchTag = entry.tags.some((t) => t.toLowerCase().includes(lowerQ));
                if (!matchTitle && !matchDesc && !matchTag) return false;
            }
            return true;
        })
        .sort((a, b) => {
            // Sort newest date and time first
            const dateA = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
            const dateB = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
            return dateB - dateA;
        });

    const handleOpenCreateModal = () => {
        setEditingEntry(null);
        setEntryTitle("");
        setEntryDescription("");
        setEntryDate(getLocalDateString(new Date(), userTimezone));
        setEntryTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        setEntryLedgerId(selectedLedgerId !== "all" ? selectedLedgerId : ledgers[0]?.id || "ldg-personal");
        setEntryLifeAreaId(lifeAreas[0]?.id || "area-personal");
        setEntryTags("");
        setEntryAttachmentName("");
        setEntryRelatedTaskId("");
        setEntryRelatedDeadlineId("");
        setEntryRelatedDecisionId("");
        setIsEntryModalOpen(true);
    };

    const handleOpenEditModal = (entry: LedgerEntry) => {
        setEditingEntry(entry);
        setEntryTitle(entry.title);
        setEntryDescription(entry.description);
        setEntryDate(entry.date);
        setEntryTime(entry.time || "");
        setEntryLedgerId(entry.ledgerId);
        setEntryLifeAreaId(entry.lifeAreaId || "area-personal");
        setEntryTags(entry.tags.join(", "));
        setEntryAttachmentName(entry.attachment?.name || "");
        setEntryRelatedTaskId(entry.relatedTaskId || "");
        setEntryRelatedDeadlineId(entry.relatedDeadlineId || "");
        setEntryRelatedDecisionId(entry.relatedDecisionId || "");
        setIsEntryModalOpen(true);
    };

    const handleEntrySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!entryTitle.trim() || !entryDescription.trim()) return;

        const tagList = entryTags.split(",").map((t) => t.trim()).filter(Boolean);

        if (editingEntry) {
            updateLedgerEntry({
                ...editingEntry,
                title: entryTitle.trim(),
                description: entryDescription.trim(),
                date: entryDate,
                time: entryTime || undefined,
                ledgerId: entryLedgerId,
                lifeAreaId: entryLifeAreaId,
                tags: tagList,
                attachment: entryAttachmentName.trim() ? { name: entryAttachmentName.trim() } : undefined,
                relatedTaskId: entryRelatedTaskId || undefined,
                relatedDeadlineId: entryRelatedDeadlineId || undefined,
                relatedDecisionId: entryRelatedDecisionId || undefined,
            });
        } else {
            addLedgerEntry({
                title: entryTitle.trim(),
                description: entryDescription.trim(),
                date: entryDate,
                time: entryTime || undefined,
                ledgerId: entryLedgerId,
                lifeAreaId: entryLifeAreaId,
                tags: tagList.length > 0 ? tagList : ["General"],
                attachment: entryAttachmentName.trim() ? { name: entryAttachmentName.trim() } : undefined,
                relatedTaskId: entryRelatedTaskId || undefined,
                relatedDeadlineId: entryRelatedDeadlineId || undefined,
                relatedDecisionId: entryRelatedDecisionId || undefined,
            });
        }

        setIsEntryModalOpen(false);
    };

    const handleCreateLedgerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLedgerName.trim()) return;

        addLedger({
            name: newLedgerName.trim(),
            description: newLedgerDescription.trim() || "Custom life memory ledger",
            color: newLedgerColor,
        });

        setNewLedgerName("");
        setNewLedgerDescription("");
        setIsLedgerModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                        <BookOpen className="text-brand-gold" />
                        Personal Ledger
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        A chronological record of milestones, meetings, insights, and life events.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setIsLedgerModalOpen(true)}
                        variant="secondary"
                        size="sm"
                        className="font-bold flex items-center gap-1.5 text-xs"
                    >
                        <FolderPlus size={14} />
                        New Ledger
                    </Button>

                    <Button
                        onClick={handleOpenCreateModal}
                        variant="primary"
                        size="sm"
                        className="font-bold flex items-center gap-1.5 text-xs"
                    >
                        <Plus size={16} />
                        Record Entry
                    </Button>
                </div>
            </div>

            {/* Multiple Ledgers Switcher Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none border-b border-brand-border/40">
                <button
                    onClick={() => setSelectedLedgerId("all")}
                    className={cn(
                        "py-2 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border cursor-pointer",
                        selectedLedgerId === "all"
                            ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                            : "bg-brand-surface text-brand-muted hover:text-brand-text border-brand-border"
                    )}
                >
                    All Ledgers ({ledgerEntries.length})
                </button>

                {ledgers.map((ldg) => {
                    const count = ledgerEntries.filter((e) => e.ledgerId === ldg.id).length;
                    const isActive = selectedLedgerId === ldg.id;
                    return (
                        <button
                            key={ldg.id}
                            onClick={() => setSelectedLedgerId(ldg.id)}
                            className={cn(
                                "flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold tracking-wide transition-all whitespace-nowrap border cursor-pointer",
                                isActive
                                    ? "bg-brand-surface text-white border-brand-gold shadow-sm"
                                    : "bg-brand-surface text-brand-muted hover:text-brand-text border-brand-border"
                            )}
                            style={{
                                borderColor: isActive ? ldg.color || "#D4A72C" : undefined,
                            }}
                        >
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ldg.color || "#D4A72C" }} />
                            <span>{ldg.name}</span>
                            <span className="text-[10px] text-brand-muted bg-brand-bg px-1.5 py-0.2 rounded font-mono">
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Search */}
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                        <Search size={15} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search timeline entries, descriptions, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg pl-9 pr-4 py-2.5 text-xs placeholder:text-brand-muted/60 focus:border-brand-blue outline-none transition-all"
                    />
                </div>

                {/* Life Area Filter */}
                <div>
                    <select
                        value={selectedLifeAreaId}
                        onChange={(e) => setSelectedLifeAreaId(e.target.value)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-xs focus:border-brand-blue outline-none cursor-pointer"
                    >
                        <option value="all">All Life Areas</option>
                        {lifeAreas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.name} Area
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tag Filter */}
                <div>
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-xs focus:border-brand-blue outline-none cursor-pointer"
                    >
                        <option value="all">All Tags ({allTags.length})</option>
                        {allTags.map((tag) => (
                            <option key={tag} value={tag}>
                                #{tag}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Chronological Timeline Rail */}
            <div className="pt-2">
                {filteredEntries.length === 0 ? (
                    <div className="text-center p-12 bg-brand-surface/30 border border-dashed border-brand-border rounded-xl space-y-3">
                        <BookOpen className="mx-auto text-brand-muted" size={32} />
                        <h3 className="text-sm font-bold text-white">No ledger entries found</h3>
                        <p className="text-xs text-brand-muted max-w-sm mx-auto">
                            Start recording what happened in your life, meetings, or projects to build a rich chronological timeline.
                        </p>
                        <Button onClick={handleOpenCreateModal} variant="primary" size="sm">
                            Write First Entry
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {filteredEntries.map((entry) => (
                            <LedgerEntryCard
                                key={entry.id}
                                entry={entry}
                                onEdit={handleOpenEditModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* -------------------- CREATE / EDIT ENTRY MODAL -------------------- */}
            <Modal
                isOpen={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                title={editingEntry ? "Edit Ledger Record" : "Record in Personal Ledger"}
                className="max-w-xl"
            >
                <form onSubmit={handleEntrySubmit} className="space-y-4 font-sans">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Entry Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Kickoff meeting with new design client"
                            value={entryTitle}
                            onChange={(e) => setEntryTitle(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Chronicle / Description
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Write what happened, important quotes, numbers, or reflections..."
                            value={entryDescription}
                            onChange={(e) => setEntryDescription(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg p-3 text-xs leading-relaxed focus:border-brand-blue outline-none resize-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Target Ledger</label>
                            <select
                                value={entryLedgerId}
                                onChange={(e) => setEntryLedgerId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                {ledgers.map((ldg) => (
                                    <option key={ldg.id} value={ldg.id}>
                                        {ldg.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Life Area</label>
                            <select
                                value={entryLifeAreaId}
                                onChange={(e) => setEntryLifeAreaId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                {lifeAreas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Date</label>
                            <input
                                type="date"
                                value={entryDate}
                                onChange={(e) => setEntryDate(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Time</label>
                            <input
                                type="time"
                                value={entryTime}
                                onChange={(e) => setEntryTime(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Tags (Comma separated)</label>
                        <input
                            type="text"
                            placeholder="Client, Milestone, Apex, Agreement"
                            value={entryTags}
                            onChange={(e) => setEntryTags(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Attachment Name / Document link</label>
                        <input
                            type="text"
                            placeholder="e.g. Scope_Document_Signed.pdf"
                            value={entryAttachmentName}
                            onChange={(e) => setEntryAttachmentName(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                        />
                    </div>

                    {/* Relations Linking Accordion */}
                    <div className="pt-2 border-t border-brand-border/40 space-y-2">
                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Connect to Workspace Items</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            <select
                                value={entryRelatedTaskId}
                                onChange={(e) => setEntryRelatedTaskId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-muted border border-brand-border rounded px-2 py-1.5 text-[11px] truncate"
                            >
                                <option value="">Connect Task...</option>
                                {tasks.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        Task: {t.title}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={entryRelatedDeadlineId}
                                onChange={(e) => setEntryRelatedDeadlineId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-muted border border-brand-border rounded px-2 py-1.5 text-[11px] truncate"
                            >
                                <option value="">Connect Deadline...</option>
                                {deadlines.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        Deadline: {d.title}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={entryRelatedDecisionId}
                                onChange={(e) => setEntryRelatedDecisionId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-muted border border-brand-border rounded px-2 py-1.5 text-[11px] truncate"
                            >
                                <option value="">Connect Decision...</option>
                                {decisions.map((dec) => (
                                    <option key={dec.id} value={dec.id}>
                                        Decision: {dec.title || dec.situation}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-brand-border/40">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsEntryModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" className="font-semibold px-5">
                            {editingEntry ? "Save Changes" : "Commit Record"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* -------------------- CREATE LEDGER MODAL -------------------- */}
            <Modal
                isOpen={isLedgerModalOpen}
                onClose={() => setIsLedgerModalOpen(false)}
                title="Create Custom Ledger"
                className="max-w-md"
            >
                <form onSubmit={handleCreateLedgerSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Ledger Name</label>
                        <input
                            type="text"
                            placeholder="e.g. My Freelance Journey, Final Year, Project X"
                            value={newLedgerName}
                            onChange={(e) => setNewLedgerName(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Description</label>
                        <input
                            type="text"
                            placeholder="e.g. Tracking client projects, proposals, and milestones"
                            value={newLedgerDescription}
                            onChange={(e) => setNewLedgerDescription(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Accent Color</label>
                        <div className="flex gap-2 items-center">
                            {["#D4A72C", "#2563EB", "#10B981", "#EC4899", "#8B5CF6", "#F97316"].map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setNewLedgerColor(color)}
                                    className={cn(
                                        "h-7 w-7 rounded-full border-2 transition-transform cursor-pointer",
                                        newLedgerColor === color ? "scale-110 border-white shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-brand-border/40">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsLedgerModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" className="font-semibold">
                            Create Ledger
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
