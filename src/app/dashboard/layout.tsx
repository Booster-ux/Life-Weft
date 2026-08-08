"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { addTask, addDeadline, addKnowledgeItem, tasks } = useApp();

    // Dynamic universal Modal state trackers that we can wire through the context/layout
    // and trigger anywhere (e.g. from the QuickAdd component quick shortcuts).
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    // Task form states
    const [taskTitle, setTaskTitle] = useState("");
    const [taskPriority, setTaskPriority] = useState<"high" | "normal" | "low">("normal");
    const [taskCategory, setTaskCategory] = useState<"Work" | "Personal" | "Student" | "Finance" | "Health">("Personal");
    const [taskTime, setTaskTime] = useState<"Morning" | "Afternoon" | "Evening" | "">("Morning");

    // Deadline form states
    const [deadlineTitle, setDeadlineTitle] = useState("");
    const [deadlineDate, setDeadlineDate] = useState("");
    const [deadlinePriority, setDeadlinePriority] = useState<"high" | "normal" | "low">("normal");
    const [linkTask, setLinkTask] = useState("auto-create");

    // Note form states
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [noteCategory, setNoteCategory] = useState<"Notes" | "Important Information" | "Ideas" | "References" | "Saved Items">("Notes");

    const handleAddTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskTitle.trim()) return;

        addTask({
            title: taskTitle.trim(),
            completed: false,
            priority: taskPriority,
            category: taskCategory,
            time: taskTime || undefined,
            dueDate: new Date().toISOString().split("T")[0],
        });

        setTaskTitle("");
        setTaskPriority("normal");
        setTaskCategory("Personal");
        setTaskTime("Morning");
        setIsTaskModalOpen(false);
    };

    const handleAddDeadlineSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!deadlineTitle.trim() || !deadlineDate) return;

        addDeadline({
            title: deadlineTitle.trim(),
            dueDate: deadlineDate,
            priority: deadlinePriority,
            relatedTaskId: linkTask === "none" ? undefined : linkTask,
        });

        setDeadlineTitle("");
        setDeadlineDate("");
        setDeadlinePriority("normal");
        setLinkTask("auto-create");
        setIsDeadlineModalOpen(false);
    };

    const handleAddNoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteTitle.trim() || !noteContent.trim()) return;

        addKnowledgeItem({
            title: noteTitle.trim(),
            content: noteContent.trim(),
            category: noteCategory,
        });

        setNoteTitle("");
        setNoteContent("");
        setNoteCategory("Notes");
        setIsNoteModalOpen(false);
    };

    // We can pass open-triggers using a simple custom window-object dispatcher
    // so child pages can call standard trigger hooks easily or we can bind them.
    // We'll write helpers or simple class bindings since they share the hierarchy tree.
    React.useEffect(() => {
        const handleOpenTask = () => setIsTaskModalOpen(true);
        const handleOpenDeadline = () => setIsDeadlineModalOpen(true);
        const handleOpenNote = () => setIsNoteModalOpen(true);

        window.addEventListener("dd-open-task-modal", handleOpenTask);
        window.addEventListener("dd-open-deadline-modal", handleOpenDeadline);
        window.addEventListener("dd-open-note-modal", handleOpenNote);

        return () => {
            window.removeEventListener("dd-open-task-modal", handleOpenTask);
            window.removeEventListener("dd-open-deadline-modal", handleOpenDeadline);
            window.removeEventListener("dd-open-note-modal", handleOpenNote);
        };
    }, []);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-brand-bg text-brand-text">
            {/* Mobile Top Navigation */}
            <MobileNav />

            {/* Desktop Sidebar Navigation */}
            <Sidebar className="hidden md:flex flex-shrink-0" />

            {/* Main Content Space */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 px-4 py-6 md:px-8 md:py-8">
                <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
                    {children}
                </div>
            </main>

            {/* -------------------- DYNAMIC MODALS -------------------- */}

            {/* Add Task Modal */}
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title="Create New Task"
            >
                <form onSubmit={handleAddTaskSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Task Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Gather document receipts for taxes"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Category
                            </label>
                            <select
                                value={taskCategory}
                                onChange={(e) => setTaskCategory(e.target.value as any)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue"
                            >
                                <option value="Personal">Personal</option>
                                <option value="Work">Work</option>
                                <option value="Student">Student</option>
                                <option value="Finance">Finance</option>
                                <option value="Health">Health</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Priority
                            </label>
                            <select
                                value={taskPriority}
                                onChange={(e) => setTaskPriority(e.target.value as any)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue"
                            >
                                <option value="low">Low Priority</option>
                                <option value="normal">Normal Priority</option>
                                <option value="high">High Priority (Gold Accent)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Plan Timeline Segment
                        </label>
                        <select
                            value={taskTime}
                            onChange={(e) => setTaskTime(e.target.value as any)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue"
                        >
                            <option value="Morning">Morning Focus</option>
                            <option value="Afternoon">Afternoon Session</option>
                            <option value="Evening">Evening Administration</option>
                            <option value="">Do Not Schedule</option>
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-brand-border/40">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsTaskModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm">
                            Save Task
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Add Deadline Modal */}
            <Modal
                isOpen={isDeadlineModalOpen}
                onClose={() => setIsDeadlineModalOpen(false)}
                title="Schedule Deadline"
            >
                <form onSubmit={handleAddDeadlineSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Deadline / Target Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Final Calculus Examination"
                            value={deadlineTitle}
                            onChange={(e) => setDeadlineTitle(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Target Date
                            </label>
                            <input
                                type="date"
                                value={deadlineDate}
                                onChange={(e) => setDeadlineDate(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Importance Level
                            </label>
                            <select
                                value={deadlinePriority}
                                onChange={(e) => setDeadlinePriority(e.target.value as any)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue"
                            >
                                <option value="low">Low Importance</option>
                                <option value="normal">Normal Importance</option>
                                <option value="high">High Importance (Urgent Alert)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Execution Action Link
                        </label>
                        <select
                            value={linkTask}
                            onChange={(e) => setLinkTask(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue"
                        >
                            <option value="auto-create">Auto-create linked task ("Submit: [Deadline]")</option>
                            <option value="none">Do not create connected task</option>
                            {tasks.filter(t => !t.completed).map(t => (
                                <option key={t.id} value={t.id}>Link to pending: {t.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-brand-border/40">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsDeadlineModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm">
                            Save Deadline
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Add Note Modal */}
            <Modal
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
                title="Add Information File"
            >
                <form onSubmit={handleAddNoteSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Resource Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Apartment gate dial code"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Organizer Category
                        </label>
                        <select
                            value={noteCategory}
                            onChange={(e) => setNoteCategory(e.target.value as any)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue"
                        >
                            <option value="Notes">Notes (Quick write ups)</option>
                            <option value="Important Information">Important Info (Gatecodes, IPs)</option>
                            <option value="Ideas">Ideas (Scattered inspiration)</option>
                            <option value="References">References (Manuals, Guides)</option>
                            <option value="Saved Items">Saved Items (Web highlights)</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Content body
                        </label>
                        <textarea
                            placeholder="Type or paste instructions here..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            rows={5}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-brand-border/40">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsNoteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm">
                            Save File
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
