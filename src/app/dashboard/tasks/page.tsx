"use client";

import React, { useState } from "react";
import { useApp, Task } from "@/context/AppContext";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Search, Plus, Calendar, Tag, CheckCircle2, ListFilter, SlidersHorizontal, AlertTriangle } from "lucide-react";

export default function TasksPage() {
    const { tasks, addTask, updateTask } = useApp();

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    // Active Filter state: "all" | "today" | "upcoming" | "completed" | "priority"
    const [statusFilter, setStatusFilter] = useState<"all" | "today" | "upcoming" | "completed" | "priority">("all");
    // Priority filter state under "priority" focus
    const [priorityFilter, setPriorityFilter] = useState<Task["priority"] | "all">("all");
    // Category filter state
    const [categoryFilter, setCategoryFilter] = useState<Task["category"] | "all">("all");

    // Edit Task modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState<Task["category"]>("Personal");
    const [editPriority, setEditPriority] = useState<Task["priority"]>("normal");
    const [editTime, setEditTime] = useState<Task["time"] | "">("");

    // Today marker (August 8, 2026)
    const todayStr = "2026-08-08";

    // Filter tasks based on Search AND Filters
    const filteredTasks = tasks.filter((task) => {
        // 1. Search Query filter (case insensitive)
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

        // 2. Status/Date Filter
        let matchesStatus = true;
        if (statusFilter === "today") {
            matchesStatus = task.dueDate === todayStr;
        } else if (statusFilter === "upcoming") {
            matchesStatus = task.dueDate !== undefined && task.dueDate > todayStr;
        } else if (statusFilter === "completed") {
            matchesStatus = task.completed;
        } else if (statusFilter === "priority") {
            matchesStatus = task.priority === "high";
        }

        // 3. Sub-priority filter
        const matchesPrioritySpec = priorityFilter === "all" || task.priority === priorityFilter;

        // 4. Category filter
        const matchesCategorySpec = categoryFilter === "all" || task.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPrioritySpec && matchesCategorySpec;
    });

    // Handler to open Add Task Modal (defined globally at Layout level)
    const handleOpenAddTask = () => {
        window.dispatchEvent(new Event("dd-open-task-modal"));
    };

    // Handler to populate and open Edit Task Modal
    const handleOpenEditTask = (task: Task) => {
        setEditingTask(task);
        setEditTitle(task.title);
        setEditCategory(task.category);
        setEditPriority(task.priority);
        setEditTime(task.time || "");
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask || !editTitle.trim()) return;

        updateTask({
            ...editingTask,
            title: editTitle.trim(),
            category: editCategory,
            priority: editPriority,
            time: editTime || undefined,
        });

        setIsEditModalOpen(false);
        setEditingTask(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        Tasks Repository
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Query filters, categories, and priority status maps.
                    </p>
                </div>
                <Button onClick={handleOpenAddTask} variant="primary" size="sm" className="font-bold flex items-center gap-1">
                    <Plus size={16} />
                    Create Task
                </Button>
            </div>

            {/* Search and Filters Segment */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Search */}
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-brand-muted/70 focus:border-brand-blue outline-none transition-all"
                    />
                </div>

                {/* Category filter */}
                <div className="relative">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-sm focus:border-brand-blue outline-none cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="Student">Student</option>
                        <option value="Finance">Finance</option>
                        <option value="Health">Health</option>
                    </select>
                </div>

                {/* Priority Filter */}
                <div className="relative">
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-sm focus:border-brand-blue outline-none cursor-pointer"
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High (Gold Accent)</option>
                        <option value="normal">Normal (Blue Accent)</option>
                        <option value="low">Low (Theme Accent)</option>
                    </select>
                </div>
            </div>

            {/* Main filter tab selection */}
            <div className="flex overflow-x-auto gap-1 border-b border-brand-border/40 pb-px">
                {([
                    { id: "all", label: "All Items" },
                    { id: "today", label: "Due Today" },
                    { id: "upcoming", label: "Upcoming Bookings" },
                    { id: "completed", label: "Completed" },
                    { id: "priority", label: "High Priority" },
                ] as const).map((tab) => {
                    const isActive = statusFilter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${isActive
                                ? "border-brand-blue text-brand-blue font-bold"
                                : "border-transparent text-brand-muted hover:text-brand-text"
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tasks listing area */}
            <div className="space-y-2.5">
                {filteredTasks.length === 0 ? (
                    <div className="text-center p-12 bg-brand-surface/30 border border-dashed border-brand-border rounded-xl">
                        <SlidersHorizontal className="mx-auto text-brand-muted mb-3" size={32} />
                        <p className="text-xs text-brand-muted">No items matched your query criteria.</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskItem key={task.id} task={task} onEdit={handleOpenEditTask} />
                    ))
                )}
            </div>

            {/* -------------------- LOCAL EDIT MODAL -------------------- */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTask(null);
                }}
                title="Edit Task Details"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Task Title
                        </label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
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
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value as any)}
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
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value as any)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue"
                            >
                                <option value="low">Low Priority</option>
                                <option value="normal">Normal Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Time segment
                        </label>
                        <select
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value as any)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue"
                        >
                            <option value="Morning">Morning Focus</option>
                            <option value="Afternoon">Afternoon Focus</option>
                            <option value="Evening">Evening Focus</option>
                            <option value="">Not Scheduled</option>
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-brand-border/40">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setEditingTask(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm">
                            Save changes
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
