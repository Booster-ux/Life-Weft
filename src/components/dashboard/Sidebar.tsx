"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    BookOpen,
    Target,
    Timer,
    GitFork,
    Library,
    AlarmClock,
    Settings,
    Search,
    Plus,
    LogOut,
    User,
    ShieldCheck,
    ChevronDown,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "./NotificationCenter";

interface SidebarProps {
    className?: string;
    onOpenSearch?: () => void;
    onOpenQuickCapture?: () => void;
    onOpenReflection?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    className,
    onOpenSearch,
    onOpenQuickCapture,
    onOpenReflection,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const { userName, avatarUrl, role, tasks, deadlines, ledgerEntries, goals, signOut } = useApp();

    const [isMoreOpen, setIsMoreOpen] = useState(
        pathname.includes("/goals") ||
        pathname.includes("/deadlines") ||
        pathname.includes("/decisions") ||
        pathname.includes("/knowledge") ||
        pathname.includes("/alarms") ||
        pathname.includes("/settings") ||
        pathname.startsWith("/admin")
    );

    const activeTasksCount = tasks.filter((t) => !t.completed).length;
    const activeDeadlinesCount = deadlines.filter((d) => !d.completed && d.daysLeft >= 0).length;
    const activeGoalsCount = goals.filter((g) => g.status === "active").length;

    // 4 Primary Navigation Items
    const primaryItems = [
        { name: "Today", href: "/dashboard", icon: LayoutDashboard },
        {
            name: "Tasks",
            href: "/dashboard/tasks",
            icon: CheckSquare,
            badge: activeTasksCount > 0 ? activeTasksCount : undefined,
        },
        { name: "Planner", href: "/dashboard/planner", icon: Calendar },
        {
            name: "Ledger",
            href: "/dashboard/ledger",
            icon: BookOpen,
            badge: ledgerEntries.length > 0 ? ledgerEntries.length : undefined,
        },
    ];

    // Secondary items grouped under "More"
    const moreItems = [
        {
            name: "Goals",
            href: "/dashboard/goals",
            icon: Target,
            badge: activeGoalsCount > 0 ? activeGoalsCount : undefined,
        },
        {
            name: "Deadlines",
            href: "/dashboard/deadlines",
            icon: Timer,
            badge: activeDeadlinesCount > 0 ? activeDeadlinesCount : undefined,
        },
        { name: "Decisions", href: "/dashboard/decisions", icon: GitFork },
        { name: "Knowledge", href: "/dashboard/knowledge", icon: Library },
        { name: "Alarms", href: "/dashboard/alarms", icon: AlarmClock },
        ...(role === "admin"
            ? [{ name: "Admin Console", href: "/admin", icon: ShieldCheck, badge: "Admin" }]
            : []),
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const isAnyMoreActive = moreItems.some((item) => pathname.startsWith(item.href));

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <aside
            className={cn(
                "w-64 bg-brand-surface border-r border-brand-border flex flex-col h-screen sticky top-0 font-sans z-30 select-none",
                className
            )}
        >
            {/* Brand Logo & Header Actions */}
            <div className="h-16 px-5 border-b border-brand-border flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:scale-105 transition-transform duration-200">
                        <span className="font-extrabold text-white text-base">L</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-brand-text">
                        Lifeweft<span className="text-brand-gold">.</span>
                    </span>
                </Link>

                <div className="flex items-center gap-1">
                    <NotificationCenter onOpenReflection={onOpenReflection} />
                </div>
            </div>

            {/* Quick Action Bar: Search & Quick Capture */}
            <div className="p-3 border-b border-brand-border/60 space-y-2">
                <button
                    onClick={onOpenQuickCapture}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-brand-blue/20 cursor-pointer"
                >
                    <Plus size={15} />
                    <span>Quick Capture</span>
                </button>

                <button
                    onClick={onOpenSearch}
                    className="w-full flex items-center justify-between px-3 py-1.5 bg-brand-bg hover:bg-brand-border/40 text-brand-muted hover:text-brand-text border border-brand-border rounded-lg text-xs transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <Search size={13} />
                        <span>Search...</span>
                    </div>
                    <kbd className="text-[10px] bg-brand-surface px-1.5 py-0.5 rounded border border-brand-border/80 font-mono text-brand-muted">
                        ⌘K
                    </kbd>
                </button>
            </div>

            {/* Primary Navigation List */}
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
                <div className="px-3 pb-1 pt-1 text-[10px] font-bold text-brand-muted/70 uppercase tracking-widest">
                    Main
                </div>
                {primaryItems.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 group",
                                isActive
                                    ? "bg-brand-blue text-white shadow-sm font-bold"
                                    : "text-brand-muted hover:text-brand-text hover:bg-brand-bg/80"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon
                                    size={16}
                                    className={cn(
                                        "transition-colors",
                                        isActive ? "text-white" : "text-brand-muted group-hover:text-brand-text"
                                    )}
                                />
                                <span>{item.name}</span>
                            </div>

                            {item.badge !== undefined && (
                                <span
                                    className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-brand-bg text-brand-muted border border-brand-border/60"
                                    )}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}

                {/* More Collapsible Section */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                            isAnyMoreActive
                                ? "text-white font-bold bg-brand-bg/60"
                                : "text-brand-muted hover:text-brand-text hover:bg-brand-bg/80"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <MoreHorizontal size={16} className="text-brand-muted" />
                            <span>More</span>
                        </div>
                        {isMoreOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {isMoreOpen && (
                        <div className="pl-3 pr-1 pt-1 space-y-0.5 border-l border-brand-border/50 ml-4.5 mt-1 animate-in fade-in duration-150">
                            {moreItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors group",
                                            isActive
                                                ? "bg-brand-blue/20 text-brand-blue font-bold border border-brand-blue/30"
                                                : "text-brand-muted hover:text-brand-text hover:bg-brand-bg/60"
                                        )}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon
                                                size={14}
                                                className={cn(
                                                    "transition-colors",
                                                    isActive ? "text-brand-blue" : "text-brand-muted group-hover:text-brand-text"
                                                )}
                                            />
                                            <span>{item.name}</span>
                                        </div>

                                        {item.badge !== undefined && (
                                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-brand-bg text-brand-muted border border-brand-border/60">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* Bottom User Profile Section */}
            <div className="p-3 border-t border-brand-border flex items-center justify-between bg-brand-surface">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue font-bold text-xs flex-shrink-0">
                        {(userName || "U")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-text truncate">
                            {userName || "User"}
                        </p>
                        <p className="text-[10px] text-brand-muted truncate">Workspace</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-brand-muted hover:text-red-400 hover:bg-brand-border/40 transition-colors cursor-pointer"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </aside>
    );
};
