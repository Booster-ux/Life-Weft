"use client";

import React, { useState } from "react";
import { useApp, Task } from "@/context/AppContext";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
    Search,
    Plus,
    Tag,
    SlidersHorizontal,
    Layers,
    CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocalDateString } from "@/lib/utils/dateTime";

export default function TasksPage() {
    const { tasks, addTask, updateTask, lifeAreas, userTimezone } = useApp();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "priority">("all");
    const [priorityFilter, setPriorityFilter] = useState<Task["priority"] | "all">("all");
    const [selectedLifeArea, setSelectedLifeArea] = useState<string>("all");

    // Modal states
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const todayStr = getLocalDateString(new Date(), userTimezone);

    // Form states
    const [taskTitle, setTaskTitle] = useState("");
    const [taskPriority, setTaskPriority] = useState<Task["priority"]>("normal");
    const [taskCategory, setTaskCategory] = useState("Personal");
    const [taskLifeAreaId, setTaskLifeAreaId] = useState("area-personal");
    const [taskTime, setTaskTime] = useState<Task["time"] | "">("Morning");
    const [taskDueDate, setTaskDueDate] = useState(() => todayStr);

    // Filter tasks
    const filteredTasks = tasks.filter((task) => {
        // Search query
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Status Filter
        let matchesStatus = true;
        if (statusFilter === "active") matchesStatus = !task.completed;
        else if (statusFilter === "completed") matchesStatus = task.completed;
        else if (statusFilter === "priority") matchesStatus = task.priority === "high";

        // Priority filter
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

        // Life Area filter
        const matchesLifeArea = selectedLifeArea === "all" || task.lifeAreaId === selectedLifeArea;

        return matchesSearch && matchesStatus && matchesPriority && matchesLifeArea;
    });

    const handleOpenCreateModal = () => {
        setEditingTask(null);
        setTaskTitle("");
        setTaskPriority("normal");
        setTaskCategory("Personal");
        setTaskLifeAreaId(lifeAreas[0]?.id || "area-personal");
        setTaskTime("Morning");
        setTaskDueDate(todayStr);
        setIsTaskModalOpen(true);
    };

    const handleOpenEditModal = (task: Task) => {
        setEditingTask(task);
        setTaskTitle(task.title);
        setTaskPriority(task.priority);
        setTaskCategory(task.category);
        setTaskLifeAreaId(task.lifeAreaId || lifeAreas[0]?.id || "area-personal");
        setTaskTime(task.time || "");
        setTaskDueDate(task.dueDate || todayStr);
        setIsTaskModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskTitle.trim()) return;

        if (editingTask) {
            updateTask({
                ...editingTask,
                title: taskTitle.trim(),
                priority: taskPriority,
                category: taskCategory,
                lifeAreaId: taskLifeAreaId,
                time: taskTime || undefined,
                dueDate: taskDueDate,
            });
        } else {
            addTask({
                title: taskTitle.trim(),
                completed: false,
                priority: taskPriority,
                category: taskCategory,
                lifeAreaId: taskLifeAreaId,
                time: taskTime || undefined,
                dueDate: taskDueDate,
            });
        }

        setIsTaskModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <CheckSquare className="text-brand-blue" />
                        Tasks Repository
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Manage all action items across your personal life areas and priorities.
                    </p>
                </div>
                <Button onClick={handleOpenCreateModal} variant="primary" size="sm" className="font-bold flex items-center gap-1.5">
                    <Plus size={16} />
                    Create Task
                </Button>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Search */}
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                        <Search size={15} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg pl-9 pr-4 py-2.5 text-xs placeholder:text-brand-muted/60 focus:border-brand-blue outline-none transition-all"
                    />
                </div>

                {/* Life Area Filter */}
                <div>
                    <select
                        value={selectedLifeArea}
                        onChange={(e) => setSelectedLifeArea(e.target.value)}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-xs focus:border-brand-blue outline-none cursor-pointer"
                    >
                        <option value="all">All Life Areas</option>
                        {lifeAreas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority Filter */}
                <div>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as Task["priority"] | "all")}
                        className="w-full bg-brand-surface text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-xs focus:border-brand-blue outline-none cursor-pointer"
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority (Gold)</option>
                        <option value="normal">Normal Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex overflow-x-auto gap-1 border-b border-brand-border/40 pb-px">
                {[
                    { id: "all", label: `All (${tasks.length})` },
                    { id: "active", label: `Active (${tasks.filter(t => !t.completed).length})` },
                    { id: "completed", label: `Completed (${tasks.filter(t => t.completed).length})` },
                    { id: "priority", label: `High Priority (${tasks.filter(t => t.priority === "high").length})` },
                ].map((tab) => {
                    const isActive = statusFilter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id as "all" | "active" | "completed" | "priority")}
                            className={cn(
                                "py-2 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer",
                                isActive
                                    ? "border-brand-blue text-brand-blue font-bold"
                                    : "border-transparent text-brand-muted hover:text-brand-text"
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Task Items List */}
            <div className="space-y-2.5">
                {filteredTasks.length === 0 ? (
                    <div className="text-center p-12 bg-brand-surface/30 border border-dashed border-brand-border rounded-xl">
                        <SlidersHorizontal className="mx-auto text-brand-muted mb-3" size={30} />
                        <p className="text-xs text-brand-muted">No tasks match your selected query criteria.</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={handleOpenEditModal}
                        />
                    ))
                )}
            </div>

            {/* Create / Edit Modal */}
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title={editingTask ? "Edit Task" : "Create New Task"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Task Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Finish client presentation slide deck"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Life Area
                            </label>
                            <select
                                value={taskLifeAreaId}
                                onChange={(e) => setTaskLifeAreaId(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                {lifeAreas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Priority Level
                            </label>
                            <select
                                value={taskPriority}
                                onChange={(e) => setTaskPriority(e.target.value as Task["priority"])}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                <option value="normal">Normal Priority</option>
                                <option value="high">High Priority (Gold Accent)</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Target Date
                            </label>
                            <input
                                type="date"
                                value={taskDueDate}
                                onChange={(e) => setTaskDueDate(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-1.5 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                Time Window Focus
                            </label>
                            <select
                                value={taskTime}
                                onChange={(e) => setTaskTime(e.target.value as Task["time"] | "")}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                <option value="Morning">Morning Focus</option>
                                <option value="Afternoon">Afternoon Focus</option>
                                <option value="Evening">Evening Focus</option>
                                <option value="">Unscheduled</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-brand-border/40">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsTaskModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" className="font-semibold">
                            {editingTask ? "Save Changes" : "Create Task"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
