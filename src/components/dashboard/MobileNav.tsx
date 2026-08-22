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
    MoreHorizontal,
    X,
    Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "./NotificationCenter";

interface MobileNavProps {
    onOpenSearch?: () => void;
    onOpenQuickCapture?: () => void;
    onOpenReflection?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
    onOpenSearch,
    onOpenQuickCapture,
    onOpenReflection,
}) => {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { userName, role, tasks, deadlines, goals, ledgerEntries, signOut } = useApp();

    const activeTasksCount = tasks.filter((t) => !t.completed).length;
    const activeDeadlinesCount = deadlines.filter((d) => !d.completed && d.daysLeft >= 0).length;
    const activeGoalsCount = goals.filter((g) => g.status === "active").length;

    // 4 Primary bottom tabs + 1 More trigger
    const primaryTabs = [
        { name: "Today", href: "/dashboard", icon: LayoutDashboard },
        { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare, badge: activeTasksCount > 0 ? activeTasksCount : undefined },
        { name: "Planner", href: "/dashboard/planner", icon: Calendar },
        { name: "Ledger", href: "/dashboard/ledger", icon: BookOpen, badge: ledgerEntries.length > 0 ? ledgerEntries.length : undefined },
    ];

    // Secondary items inside the "More" Bottom Sheet
    const moreDrawerItems = [
        { name: "Goals", href: "/dashboard/goals", icon: Target, badge: activeGoalsCount > 0 ? activeGoalsCount : undefined },
        { name: "Deadlines", href: "/dashboard/deadlines", icon: Timer, badge: activeDeadlinesCount > 0 ? activeDeadlinesCount : undefined },
        { name: "Decisions", href: "/dashboard/decisions", icon: GitFork },
        { name: "Knowledge", href: "/dashboard/knowledge", icon: Library },
        { name: "Alarms", href: "/dashboard/alarms", icon: AlarmClock },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ...(role === "admin"
            ? [{ name: "Admin Console", href: "/admin", icon: ShieldCheck, badge: "Admin" }]
            : []),
    ];

    const getPageTitle = () => {
        if (pathname === "/dashboard") return "Today";
        if (pathname.includes("/my-day")) return "My Day Focus";
        if (pathname.includes("/tasks")) return "Tasks";
        if (pathname.includes("/planner")) return "Planner";
        if (pathname.includes("/ledger")) return "Personal Ledger";
        if (pathname.includes("/goals")) return "Goals";
        if (pathname.includes("/deadlines")) return "Deadlines";
        if (pathname.includes("/decisions")) return "Decisions";
        if (pathname.includes("/knowledge")) return "Knowledge Base";
        if (pathname.includes("/alarms")) return "Alarms";
        if (pathname.includes("/settings")) return "Settings";
        return "Lifeweft";
    };

    const isAnyMoreActive = moreDrawerItems.some((item) => pathname.startsWith(item.href));

    return (
        <>
            {/* Top Navigation Bar */}
            <div className="md:hidden w-full sticky top-0 z-40 bg-brand-surface/95 backdrop-blur-md border-b border-brand-border h-14 px-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded bg-brand-blue flex items-center justify-center shadow-sm">
                        <span className="font-extrabold text-white text-xs">L</span>
                    </div>
                    <span className="font-bold text-base tracking-tight text-brand-text">
                        {getPageTitle()}
                    </span>
                </Link>

                <div className="flex items-center gap-1">
                    {onOpenQuickCapture && (
                        <button
                            type="button"
                            onClick={onOpenQuickCapture}
                            className="p-2 text-brand-blue hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Quick Capture"
                        >
                            <Plus size={19} />
                        </button>
                    )}

                    <NotificationCenter onOpenReflection={onOpenReflection} />

                    {onOpenSearch && (
                        <button
                            type="button"
                            onClick={onOpenSearch}
                            className="p-2 text-brand-muted hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Search"
                        >
                            <Search size={17} />
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom 5-Item Tab Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-surface/95 backdrop-blur-lg border-t border-brand-border h-16 px-2 flex items-center justify-around shadow-2xl">
                {primaryTabs.map((tab) => {
                    const isActive =
                        tab.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(tab.href);
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 flex-1 py-1.5 text-brand-muted transition-colors relative",
                                isActive ? "text-brand-blue font-bold" : "hover:text-brand-text"
                            )}
                        >
                            <Icon size={18} className={cn(isActive && "stroke-[2.5]")} />
                            <span className="text-[10px] tracking-tight">{tab.name}</span>
                            {tab.badge !== undefined && (
                                <span className="absolute top-1 right-3 h-3.5 min-w-[14px] px-1 bg-brand-blue text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                    {tab.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}

                {/* 5th Tab: More */}
                <button
                    type="button"
                    onClick={() => setIsMoreOpen(true)}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 flex-1 py-1.5 text-brand-muted transition-colors cursor-pointer",
                        (isMoreOpen || isAnyMoreActive) ? "text-brand-blue font-bold" : "hover:text-brand-text"
                    )}
                >
                    <MoreHorizontal size={18} />
                    <span className="text-[10px] tracking-tight">More</span>
                </button>
            </div>

            {/* "More" Slide-up Bottom Sheet */}
            {isMoreOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in flex flex-col justify-end">
                    <div className="bg-brand-surface border-t border-brand-border rounded-t-3xl p-5 pb-8 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                            <div className="flex items-center gap-2">
                                <MoreHorizontal size={18} className="text-brand-blue" />
                                <span className="font-bold text-sm text-white">More Modules</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMoreOpen(false)}
                                className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Grid of Secondary Modules */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {moreDrawerItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMoreOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all",
                                            isActive
                                                ? "bg-brand-blue/20 text-brand-blue border-brand-blue/40 font-bold"
                                                : "bg-brand-bg/80 text-slate-200 border-brand-border hover:bg-brand-bg"
                                        )}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon size={16} className={isActive ? "text-brand-blue" : "text-brand-muted"} />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge !== undefined && (
                                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-brand-surface text-brand-muted border border-brand-border">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Profile & Sign Out footer */}
                        <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue font-bold text-xs">
                                    {(userName || "U")[0].toUpperCase()}
                                </div>
                                <span className="font-bold text-white truncate">{userName || "User"}</span>
                            </div>

                            <button
                                type="button"
                                onClick={async () => {
                                    setIsMoreOpen(false);
                                    await signOut();
                                }}
                                className="flex items-center gap-1 text-xs text-brand-muted hover:text-red-400 font-semibold"
                            >
                                <LogOut size={13} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
