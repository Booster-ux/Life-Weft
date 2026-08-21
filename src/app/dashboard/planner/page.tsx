"use client";

import React, { useState } from "react";
import { useApp, PlannerSession } from "@/context/AppContext";
import {
    Calendar,
    Plus,
    BookOpen,
    Laptop,
    Heart,
    User,
    Trash2,
    Clock,
    Layers,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Target,
    CheckSquare,
    Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import {
    getCurrentWeekDays,
    formatLocalDate,
    getLocalDateString,
} from "@/lib/utils/dateTime";

export default function PlannerPage() {
    const {
        planner,
        tasks,
        deadlines,
        goals,
        lifeAreas,
        userTimezone,
        addPlannerSession,
        updatePlannerSession,
        deletePlannerSession,
    } = useApp();

    const [weekOffset, setWeekOffset] = useState(0); // 0 = current week

    // Modal state
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [sessionDay, setSessionDay] = useState("Monday");
    const [sessionTitle, setSessionTitle] = useState("");
    const [sessionStartTime, setSessionStartTime] = useState("09:00");
    const [sessionEndTime, setSessionEndTime] = useState("11:00");
    const [sessionType, setSessionType] = useState<PlannerSession["type"]>("work");
    const [sessionLifeArea, setSessionLifeArea] = useState<string>("area-personal");
    const [sessionGoalId, setSessionGoalId] = useState<string>("");
    const [selectedLifeArea, setSelectedLifeArea] = useState<string>("all");

    // Dynamic user-local week days
    const weekDays = getCurrentWeekDays(weekOffset, userTimezone);
    const todayStr = getLocalDateString(new Date(), userTimezone);

    // Compute formatted date for day key
    const getDateForDay = (dayKey: string) => {
        const item = weekDays.find((d) => d.key === dayKey);
        return item ? item.dateString : todayStr;
    };

    const formatWeekRange = () => {
        if (!weekDays.length) return "";
        const startFormatted = formatLocalDate(weekDays[0].dateString, userTimezone, { month: "short", day: "numeric" });
        const endFormatted = formatLocalDate(weekDays[6].dateString, userTimezone, { month: "short", day: "numeric", year: "numeric" });
        return `${startFormatted} – ${endFormatted}`;
    };

    const handleOpenAddSession = (day: string) => {
        setEditingSessionId(null);
        setSessionDay(day);
        setSessionTitle("");
        setSessionStartTime("09:00");
        setSessionEndTime("11:00");
        setSessionType("work");
        setSessionGoalId("");
        setIsAddSessionOpen(true);
    };

    const handleOpenEditSession = (session: PlannerSession) => {
        setEditingSessionId(session.id);
        setSessionDay(session.day);
        setSessionTitle(session.title);
        const times = session.time.split("-").map((t) => t.trim());
        setSessionStartTime(times[0] || "09:00");
        setSessionEndTime(times[1] || "11:00");
        setSessionType(session.type);
        setSessionLifeArea(session.lifeAreaId || "area-personal");
        setSessionGoalId(session.goalId || "");
        setIsAddSessionOpen(true);
    };

    const handleSessionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionTitle.trim()) return;

        const timeWindow = `${sessionStartTime} - ${sessionEndTime}`;

        if (editingSessionId) {
            updatePlannerSession({
                id: editingSessionId,
                day: sessionDay,
                title: sessionTitle.trim(),
                time: timeWindow,
                type: sessionType,
                lifeAreaId: sessionLifeArea || undefined,
                goalId: sessionGoalId || undefined,
            });
        } else {
            addPlannerSession({
                day: sessionDay,
                title: sessionTitle.trim(),
                time: timeWindow,
                type: sessionType,
                lifeAreaId: sessionLifeArea || undefined,
                goalId: sessionGoalId || undefined,
            });
        }

        setIsAddSessionOpen(false);
    };

    const getTypeIcon = (type: PlannerSession["type"]) => {
        switch (type) {
            case "work":
                return <Laptop size={12} className="text-brand-blue" />;
            case "study":
                return <BookOpen size={12} className="text-emerald-400" />;
            case "health":
                return <Heart size={12} className="text-rose-400" />;
            default:
                return <User size={12} className="text-brand-gold" />;
        }
    };

    const getSessionColorClass = (type: PlannerSession["type"]) => {
        switch (type) {
            case "work":
                return "bg-brand-blue/10 border-brand-blue/30 text-brand-text hover:border-brand-blue/60";
            case "study":
                return "bg-emerald-950/30 border-emerald-800/40 text-emerald-100 hover:border-emerald-700/60";
            case "health":
                return "bg-rose-950/30 border-rose-800/40 text-rose-100 hover:border-rose-700/60";
            default:
                return "bg-brand-gold/10 border-brand-gold/30 text-amber-100 hover:border-brand-gold/60";
        }
    };

    const renderDayColumn = (dayKey: string) => {
        const dayDate = getDateForDay(dayKey);
        const isToday = dayDate === todayStr;

        const daySessions = planner.filter(
            (s) => s.day === dayKey && (selectedLifeArea === "all" || s.lifeAreaId === selectedLifeArea)
        );

        const dayTasks = tasks.filter(
            (t) => t.dueDate === dayDate && (selectedLifeArea === "all" || t.lifeAreaId === selectedLifeArea)
        );

        const dayDeadlines = deadlines.filter(
            (d) => d.dueDate === dayDate && !d.completed && (selectedLifeArea === "all" || d.lifeAreaId === selectedLifeArea)
        );

        const dayGoals = goals.filter(
            (g) => g.targetDate === dayDate && g.status === "active" && (selectedLifeArea === "all" || g.lifeAreaId === selectedLifeArea)
        );

        const dayNumber = dayDate.split("-")[2] || "";

        return (
            <div
                key={dayKey}
                className={cn(
                    "flex-1 min-w-[200px] bg-brand-surface border rounded-xl p-3 flex flex-col min-h-[420px] transition-all relative group shadow-sm",
                    isToday
                        ? "border-brand-gold/60 shadow-lg shadow-brand-gold/5 bg-brand-surface/95 ring-1 ring-brand-gold/30"
                        : "border-brand-border/80 hover:border-brand-border"
                )}
            >
                {/* Horizontal Day Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-brand-border/40 mb-3">
                    <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-bold uppercase tracking-wider", isToday ? "text-brand-gold" : "text-white")}>
                            {dayKey.substring(0, 3)}
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-muted bg-brand-bg px-1.5 py-0.5 rounded border border-brand-border/60">
                            {dayNumber}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {isToday && (
                            <span className="text-[9px] bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                                Today
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => handleOpenAddSession(dayKey)}
                            title="Add focus block"
                            className="h-5 w-5 rounded bg-brand-bg hover:bg-brand-blue/20 hover:text-brand-blue border border-brand-border flex items-center justify-center text-brand-muted transition-colors cursor-pointer"
                        >
                            <Plus size={12} />
                        </button>
                    </div>
                </div>

                {/* Day Blocks List */}
                <div className="flex-1 space-y-2 overflow-y-auto max-h-[340px] pr-0.5 scrollbar-thin">
                    {/* Goals Due */}
                    {dayGoals.map((g) => (
                        <div
                            key={g.id}
                            className="p-2 bg-brand-gold/10 border border-brand-gold/30 rounded-lg text-[10px] space-y-0.5"
                        >
                            <div className="flex items-center gap-1 text-brand-gold font-bold">
                                <Target size={10} />
                                <span className="truncate">{g.title}</span>
                            </div>
                            <span className="text-[8.5px] text-brand-muted font-mono uppercase">{g.goalType} Milestone</span>
                        </div>
                    ))}

                    {/* Deadlines Due */}
                    {dayDeadlines.map((d) => (
                        <div
                            key={d.id}
                            className="p-2 bg-rose-950/25 border border-rose-800/40 text-rose-300 rounded-lg text-[10px] space-y-0.5"
                        >
                            <div className="flex items-center gap-1 font-bold">
                                <Clock size={10} className="text-rose-400" />
                                <span className="truncate">{d.title}</span>
                            </div>
                            <span className="text-[8.5px] opacity-80 font-mono">Target Deadline</span>
                        </div>
                    ))}

                    {/* Focus Sessions */}
                    {daySessions.map((session) => {
                        const linkedGoal = goals.find((g) => g.id === session.goalId);
                        const area = lifeAreas.find((a) => a.id === session.lifeAreaId);

                        return (
                            <div
                                key={session.id}
                                className={cn(
                                    "p-2.5 border rounded-lg text-[11px] leading-tight space-y-1.5 group/session relative transition-all shadow-sm",
                                    getSessionColorClass(session.type)
                                )}
                            >
                                <div className="flex items-start justify-between gap-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        {getTypeIcon(session.type)}
                                        <span className="font-semibold text-white truncate text-[11px]">
                                            {session.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center opacity-0 group-hover/session:opacity-100 transition-opacity gap-0.5">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditSession(session)}
                                            className="p-0.5 text-brand-muted hover:text-white"
                                        >
                                            <Edit2 size={10} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deletePlannerSession(session.id)}
                                            className="p-0.5 text-brand-muted hover:text-rose-400"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[9px] text-brand-muted font-mono">
                                    <span>{session.time}</span>
                                    {area && (
                                        <span className="flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: area.color }} />
                                            {area.name}
                                        </span>
                                    )}
                                </div>

                                {linkedGoal && (
                                    <div className="text-[9px] text-brand-gold flex items-center gap-1 font-mono truncate">
                                        <Target size={9} />
                                        <span className="truncate">{linkedGoal.title}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Tasks Scheduled */}
                    {dayTasks.map((t) => (
                        <div
                            key={t.id}
                            className="p-2 bg-brand-bg border border-brand-border/70 rounded-lg text-[10px] flex items-center justify-between gap-1.5"
                        >
                            <div className="flex items-center gap-1.5 min-w-0">
                                <CheckSquare size={11} className={t.completed ? "text-emerald-400" : "text-brand-blue"} />
                                <span className={cn("truncate text-white", t.completed && "line-through text-brand-muted")}>
                                    {t.title}
                                </span>
                            </div>
                            {t.priority === "high" && (
                                <span className="text-[8px] bg-brand-gold/10 text-brand-gold font-bold px-1 rounded">High</span>
                            )}
                        </div>
                    ))}

                    {daySessions.length === 0 && dayTasks.length === 0 && dayDeadlines.length === 0 && dayGoals.length === 0 && (
                        <div className="py-12 text-center text-[10px] text-brand-muted/40 italic">
                            Open window
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <Calendar className="text-brand-blue" />
                        Weekly Planner
                    </h1>
                    <p className="text-sm text-brand-muted mt-1 leading-none">
                        Horizontal weekly calendar board organized across all 7 days.
                    </p>
                </div>

                {/* Life Area & Week Navigation */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={selectedLifeArea}
                        onChange={(e) => setSelectedLifeArea(e.target.value)}
                        className="bg-brand-surface text-brand-text border border-brand-border rounded-xl px-3 py-1.5 text-xs focus:border-brand-blue outline-none cursor-pointer"
                    >
                        <option value="all">All Life Areas</option>
                        {lifeAreas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.name} Area
                            </option>
                        ))}
                    </select>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => handleOpenAddSession("Saturday")}
                        className="text-xs font-bold uppercase tracking-wider py-1.5 px-3 shadow-lg shadow-brand-blue/20"
                    >
                        <Plus size={13} className="mr-1" /> Plan Block
                    </Button>
                </div>
            </div>

            {/* Horizontal Week Navigation Toolbar */}
            <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl shadow-sm">
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => setWeekOffset(weekOffset - 1)}
                        className="p-1.5 rounded-lg bg-brand-bg hover:bg-brand-border text-brand-muted hover:text-white transition-colors cursor-pointer"
                        title="Previous Week"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setWeekOffset(0)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase tracking-wider",
                            weekOffset === 0
                                ? "bg-brand-gold text-black font-extrabold shadow-sm"
                                : "bg-brand-bg text-brand-muted hover:text-white border border-brand-border"
                        )}
                    >
                        TODAY
                    </button>
                    <button
                        type="button"
                        onClick={() => setWeekOffset(weekOffset + 1)}
                        className="p-1.5 rounded-lg bg-brand-bg hover:bg-brand-border text-brand-muted hover:text-white transition-colors cursor-pointer"
                        title="Next Week"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="text-xs font-mono font-bold text-white tracking-wider">
                    {formatWeekRange()}
                </div>
            </div>

            {/* True Horizontal 7-Day Calendar Board (Side-by-side with smooth horizontal scrolling on mobile/tablet) */}
            <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
                <div className="flex gap-3 min-w-[1200px]">
                    {weekDays.map((day) => renderDayColumn(day.key))}
                </div>
            </div>

            {/* Modal: Schedule / Edit Focus Block */}
            <Modal
                isOpen={isAddSessionOpen}
                onClose={() => setIsAddSessionOpen(false)}
                title={editingSessionId ? "Edit Focus Block" : "Schedule Focus Block"}
                className="max-w-md"
            >
                <form onSubmit={handleSessionSubmit} className="space-y-4 font-sans text-xs">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Block Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Deep Work: Database Schema & Migration"
                            value={sessionTitle}
                            onChange={(e) => setSessionTitle(e.target.value)}
                            required
                            autoFocus
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2.5 text-xs focus:border-brand-blue outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Day</label>
                            <select
                                value={sessionDay}
                                onChange={(e) => setSessionDay(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                {weekDays.map((d) => (
                                    <option key={d.key} value={d.key}>
                                        {d.key}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Type</label>
                            <select
                                value={sessionType}
                                onChange={(e) => setSessionType(e.target.value as any)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue"
                            >
                                <option value="work">Work Sprint</option>
                                <option value="study">Study / Learning</option>
                                <option value="health">Health / Workout</option>
                                <option value="personal">Personal Project</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Start Time</label>
                            <input
                                type="time"
                                value={sessionStartTime}
                                onChange={(e) => setSessionStartTime(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-1.5 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">End Time</label>
                            <input
                                type="time"
                                value={sessionEndTime}
                                onChange={(e) => setSessionEndTime(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-1.5 text-xs focus:border-brand-blue outline-none"
                            />
                        </div>
                    </div>

                    {/* Connect to Goal */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Connect to Strategic Goal (Optional)
                        </label>
                        <select
                            value={sessionGoalId}
                            onChange={(e) => setSessionGoalId(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue"
                        >
                            <option value="">None (Independent session)</option>
                            {goals.map((g) => (
                                <option key={g.id} value={g.id}>
                                    [{g.goalType.toUpperCase()}] {g.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Connect to Task */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                            Connect to Specific Task (Optional)
                        </label>
                        <select
                            onChange={(e) => {
                                if (e.target.value && !sessionTitle) {
                                    setSessionTitle(e.target.value);
                                }
                            }}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue"
                        >
                            <option value="">Select task from backlog...</option>
                            {tasks.filter((t) => !t.completed).map((t) => (
                                <option key={t.id} value={t.title}>
                                    {t.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Life Area */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Life Area</label>
                        <select
                            value={sessionLifeArea}
                            onChange={(e) => setSessionLifeArea(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue"
                        >
                            {lifeAreas.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border/40">
                        <Button type="button" variant="secondary" onClick={() => setIsAddSessionOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" className="font-bold uppercase tracking-wider">
                            {editingSessionId ? "Save Changes" : "Schedule Block"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
