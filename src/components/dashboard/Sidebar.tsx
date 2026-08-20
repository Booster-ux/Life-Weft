"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
    LayoutDashboard,
    Sun,
    Target,
    CheckSquare,
    Calendar,
    Timer,
    GitFork,
    BookOpen,
    Library,
    Sparkles,
    Settings,
    Search,
    Plus,
    LogOut,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    className?: string;
    onOpenSearch?: () => void;
    onOpenQuickCapture?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    className,
    onOpenSearch,
    onOpenQuickCapture,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const { userName, avatarUrl, tasks, deadlines, ledgerEntries, goals, signOut } = useApp();

    const activeTasksCount = tasks.filter((t) => !t.completed).length;
    const activeDeadlinesCount = deadlines.filter((d) => !d.completed && d.daysLeft >= 0).length;
    const activeGoalsCount = goals.filter((g) => g.status === "active").length;

    const menuItems = [
        { name: "Today", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Day", href: "/dashboard/my-day", icon: Sun },
        {
            name: "Goals",
            href: "/dashboard/goals",
            icon: Target,
            badge: activeGoalsCount > 0 ? activeGoalsCount : undefined,
        },
        {
            name: "Tasks",
            href: "/dashboard/tasks",
            icon: CheckSquare,
            badge: activeTasksCount > 0 ? activeTasksCount : undefined,
        },
        { name: "Planner", href: "/dashboard/planner", icon: Calendar },
        {
            name: "Deadlines",
            href: "/dashboard/deadlines",
            icon: Timer,
            badge: activeDeadlinesCount > 0 ? activeDeadlinesCount : undefined,
        },
        { name: "Decisions", href: "/dashboard/decisions", icon: GitFork },
        {
            name: "Ledger",
            href: "/dashboard/ledger",
            icon: BookOpen,
            badge: ledgerEntries.length > 0 ? ledgerEntries.length : undefined,
        },
        { name: "Knowledge", href: "/dashboard/knowledge", icon: Library },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <aside
            className={cn(
                "w-64 bg-brand-surface border-r border-brand-border flex flex-col h-screen sticky top-0 font-sans z-30 transition-transform duration-300 select-none",
                className
            )}
        >
            {/* Brand logo */}
            <div className="h-16 px-6 border-b border-brand-border flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:scale-105 transition-transform duration-200">
                        <span className="font-extrabold text-white text-base">L</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-brand-text">
                        Lifeweft<span className="text-brand-gold">.</span>
                    </span>
                </Link>
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
                    className="w-full flex items-center justify-between px-3 py-2 bg-brand-bg hover:bg-brand-border/40 text-brand-muted hover:text-brand-text border border-brand-border rounded-lg text-xs transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <Search size={14} />
                        <span>Search workspace...</span>
                    </div>
                    <kbd className="text-[10px] bg-brand-surface px-1.5 py-0.5 rounded border border-brand-border/80 font-mono text-brand-muted">
                        ⌘K
                    </kbd>
                </button>
            </div>

            {/* Nav List */}
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
                <div className="px-3 pb-1 pt-1 text-[10px] font-bold text-brand-muted/70 uppercase tracking-widest">
                    Workspace
                </div>
                {menuItems.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 smooth-hover text-brand-muted hover:text-brand-text group hover:bg-brand-border/30",
                                isActive && "bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-semibold hover:bg-brand-blue/15 hover:text-brand-blue"
                            )}
                        >
                            <div className="flex items-center gap-2.5">
                                <item.icon
                                    size={16}
                                    className={cn(
                                        "text-brand-muted group-hover:text-brand-text transition-colors",
                                        isActive && "text-brand-blue"
                                    )}
                                />
                                <span className={cn(isActive && "text-brand-text font-bold")}>
                                    {item.name}
                                </span>
                            </div>
                            {item.badge !== undefined && (
                                <span
                                    className={cn(
                                        "text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-brand-border text-brand-muted",
                                        isActive && "bg-brand-blue/20 text-brand-blue"
                                    )}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Profile & Logout */}
            <div className="p-3 border-t border-brand-border space-y-2">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-border/40 group transition-all"
                >
                    <div className="flex items-center gap-2.5">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={userName}
                                className="h-8 w-8 rounded-full object-cover border border-brand-gold/50 flex-shrink-0"
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-brand-border flex items-center justify-center border border-brand-blue/30 text-xs font-bold text-brand-blue uppercase flex-shrink-0">
                                {userName.substring(0, 2)}
                            </div>
                        )}
                        <div className="text-left">
                            <p className="text-xs font-semibold text-brand-text leading-tight truncate max-w-[120px]">
                                {userName}
                            </p>
                            <p className="text-[10px] text-brand-muted leading-none mt-0.5">
                                Personal Workspace
                            </p>
                        </div>
                    </div>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 p-2 w-full border border-brand-border/60 rounded-lg text-xs font-medium text-brand-muted hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/40 transition-all cursor-pointer"
                >
                    <LogOut size={13} />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    );
};
