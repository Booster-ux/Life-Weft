"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp, Deadline } from "@/context/AppContext";
import {
    Bell,
    CheckCircle2,
    Clock,
    Sun,
    Moon,
    AlertTriangle,
    AlarmClock,
    X,
    ExternalLink,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NotificationItem {
    id: string;
    type: "deadline" | "morning" | "evening" | "alarm" | "system";
    title: string;
    message: string;
    timeLabel: string;
    actionLabel?: string;
    actionHref?: string;
    isRead: boolean;
    priority?: "high" | "normal";
}

interface NotificationCenterProps {
    onOpenReflection?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onOpenReflection }) => {
    const { deadlines, alarms, notificationSettings, tasks } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Compute dynamic, real smart notifications from current state
    const currentHour = new Date().getHours();
    const activeDeadlines = deadlines.filter((d) => !d.completed);
    const highPriorityTasks = tasks.filter((t) => !t.completed && t.priority === "high");

    const notifications: NotificationItem[] = [];

    // 1. Deadline Reminders (Due Tomorrow / 24h & Overdue)
    if (notificationSettings.deadlineAlerts) {
        activeDeadlines.forEach((d) => {
            if (d.daysLeft === 1) {
                notifications.push({
                    id: `notif-deadline-tomorrow-${d.id}`,
                    type: "deadline",
                    title: "Deadline Tomorrow",
                    message: `"${d.title}" is due tomorrow.`,
                    timeLabel: "Due in 24h",
                    actionLabel: "View Deadlines",
                    actionHref: "/dashboard/deadlines",
                    isRead: dismissedIds.includes(`notif-deadline-tomorrow-${d.id}`),
                    priority: "high",
                });
            } else if (d.daysLeft === 0) {
                notifications.push({
                    id: `notif-deadline-today-${d.id}`,
                    type: "deadline",
                    title: "Due Today",
                    message: `"${d.title}" is due today.`,
                    timeLabel: "Due today",
                    actionLabel: "Review Deadline",
                    actionHref: "/dashboard/deadlines",
                    isRead: dismissedIds.includes(`notif-deadline-today-${d.id}`),
                    priority: "high",
                });
            } else if (d.daysLeft < 0) {
                notifications.push({
                    id: `notif-deadline-overdue-${d.id}`,
                    type: "deadline",
                    title: "Overdue Deadline",
                    message: `"${d.title}" is overdue by ${Math.abs(d.daysLeft)} day(s).`,
                    timeLabel: "Overdue",
                    actionLabel: "Resolve Now",
                    actionHref: "/dashboard/deadlines",
                    isRead: dismissedIds.includes(`notif-deadline-overdue-${d.id}`),
                    priority: "high",
                });
            }
        });
    }

    // 2. Morning Check-In (between 05:00 and 12:00)
    if (notificationSettings.morningCheckIn && currentHour >= 5 && currentHour < 12) {
        notifications.push({
            id: "notif-morning-checkin",
            type: "morning",
            title: "Morning Check-in",
            message: highPriorityTasks.length > 0
                ? `Good morning. You have ${highPriorityTasks.length} high-priority item(s) to focus on today.`
                : "Good morning. Here's what matters today. Have a productive, calm session.",
            timeLabel: "Morning",
            actionLabel: "Open My Day",
            actionHref: "/dashboard/my-day",
            isRead: dismissedIds.includes("notif-morning-checkin"),
        });
    }

    // 3. Evening Check-in & Daily Reflection (from 17:00 onwards)
    if (notificationSettings.eveningCheckIn && currentHour >= 17) {
        notifications.push({
            id: "notif-evening-reflection",
            type: "evening",
            title: "Evening Reflection",
            message: "How did your day go? Take 2 minutes to record your accomplishments and lessons learned.",
            timeLabel: "Evening",
            actionLabel: "Start Daily Reflection",
            isRead: dismissedIds.includes("notif-evening-reflection"),
        });
    }

    // 4. Active Alarms (if any enabled alarms exist)
    const enabledAlarms = alarms.filter((a) => a.enabled);
    if (enabledAlarms.length > 0) {
        const nextAlarm = enabledAlarms[0];
        notifications.push({
            id: `notif-alarm-${nextAlarm.id}`,
            type: "alarm",
            title: "Active Alarm",
            message: `Scheduled: ${nextAlarm.time} (${nextAlarm.name})`,
            timeLabel: "Alarms",
            actionLabel: "Manage Alarms",
            actionHref: "/dashboard/alarms",
            isRead: dismissedIds.includes(`notif-alarm-${nextAlarm.id}`),
        });
    }

    // Unread count
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleDismiss = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDismissedIds((prev) => [...prev, id]);
    };

    const handleMarkAllRead = () => {
        setDismissedIds(notifications.map((n) => n.id));
    };

    const getIcon = (type: NotificationItem["type"]) => {
        switch (type) {
            case "deadline":
                return <Clock size={15} className="text-rose-400" />;
            case "morning":
                return <Sun size={15} className="text-brand-gold" />;
            case "evening":
                return <Moon size={15} className="text-indigo-400" />;
            case "alarm":
                return <AlarmClock size={15} className="text-emerald-400" />;
            default:
                return <Bell size={15} className="text-brand-blue" />;
        }
    };

    return (
        <div className="relative inline-block" ref={containerRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg text-brand-muted hover:text-white hover:bg-brand-surface border border-brand-border/60 transition-colors cursor-pointer"
                title="Notification Center"
                aria-label="Open notifications"
            >
                <Bell size={17} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-brand-gold text-black text-[9px] font-black rounded-full flex items-center justify-center border border-black shadow-sm animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-brand-surface border border-brand-border rounded-2xl shadow-2xl z-50 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="p-3.5 border-b border-brand-border/80 flex items-center justify-between bg-brand-bg/60">
                        <div className="flex items-center gap-2">
                            <Bell size={15} className="text-brand-gold" />
                            <span className="text-xs font-bold text-white">Notifications & Check-ins</span>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                className="text-[10px] text-brand-blue hover:text-brand-blue-hover font-semibold cursor-pointer"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-brand-border/50 scrollbar-thin">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-xs text-brand-muted space-y-1">
                                <CheckCircle2 size={24} className="text-emerald-400/80 mx-auto mb-2" />
                                <p className="font-semibold text-white">All caught up!</p>
                                <p className="text-[11px]">No pending reminders or check-ins right now.</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "p-3.5 space-y-1.5 transition-colors relative group",
                                        notif.isRead ? "bg-brand-surface/40 opacity-70" : "bg-brand-surface hover:bg-brand-surface/90"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            {getIcon(notif.type)}
                                            <span className="text-xs font-bold text-white">{notif.title}</span>
                                            {notif.priority === "high" && (
                                                <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                                                    Action
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] text-brand-muted font-mono">{notif.timeLabel}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => handleDismiss(notif.id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-0.5 text-brand-muted hover:text-white transition-opacity"
                                                title="Dismiss"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-xs text-brand-muted leading-relaxed pl-6">
                                        {notif.message}
                                    </p>

                                    {/* Action link */}
                                    {notif.actionLabel && (
                                        <div className="pl-6 pt-0.5">
                                            {notif.actionHref ? (
                                                <Link
                                                    href={notif.actionHref}
                                                    onClick={() => setIsOpen(false)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:text-brand-blue-hover underline cursor-pointer"
                                                >
                                                    <span>{notif.actionLabel}</span>
                                                    <ExternalLink size={10} />
                                                </Link>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        if (onOpenReflection) onOpenReflection();
                                                    }}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-gold hover:underline cursor-pointer"
                                                >
                                                    <Sparkles size={11} />
                                                    <span>{notif.actionLabel}</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
