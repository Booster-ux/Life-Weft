"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
    Menu,
    X,
    LayoutDashboard,
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

interface MobileNavProps {
    onOpenSearch?: () => void;
    onOpenQuickCapture?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
    onOpenSearch,
    onOpenQuickCapture,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { userName, tasks, deadlines } = useApp();

    const activeTasksCount = tasks.filter((t) => !t.completed).length;
    const activeDeadlinesCount = deadlines.filter((d) => !d.completed && d.daysLeft >= 0).length;

    const drawerMenuItems = [
        { name: "Today", href: "/dashboard", icon: LayoutDashboard },
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
        { name: "Personal Ledger", href: "/dashboard/ledger", icon: BookOpen },
        { name: "Knowledge Base", href: "/dashboard/knowledge", icon: Library },
        { name: "Ask Lifeweft", href: "/dashboard/ask", icon: Sparkles },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const getPageTitle = () => {
        if (pathname === "/dashboard") return "Today";
        if (pathname.includes("/tasks")) return "Tasks";
        if (pathname.includes("/planner")) return "Planner";
        if (pathname.includes("/deadlines")) return "Deadlines";
        if (pathname.includes("/decisions")) return "Decisions";
        if (pathname.includes("/ledger")) return "Ledger";
        if (pathname.includes("/knowledge")) return "Knowledge";
        if (pathname.includes("/ask")) return "Ask Lifeweft";
        if (pathname.includes("/settings")) return "Settings";
        return "Lifeweft";
    };

    const handleLogout = () => {
        setIsOpen(false);
        router.push("/");
    };

    return (
        <>
            {/* Top Navigation Bar */}
            <div className="md:hidden w-full sticky top-0 z-40 bg-brand-surface/90 backdrop-blur-md border-b border-brand-border h-14 px-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded bg-brand-blue flex items-center justify-center shadow-sm">
                        <span className="font-extrabold text-white text-xs">L</span>
                    </div>
                    <span className="font-bold text-base tracking-tight text-brand-text">
                        {getPageTitle()}
                    </span>
                </Link>

                <div className="flex items-center gap-1.5">
                    {onOpenSearch && (
                        <button
                            onClick={onOpenSearch}
                            className="p-2 text-brand-muted hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Search"
                        >
                            <Search size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 rounded-lg text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </div>

            {/* Bottom App Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-surface/95 backdrop-blur-lg border-t border-brand-border h-16 px-3 flex items-center justify-around">
                {/* Today */}
                <Link
                    href="/dashboard"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 flex-1 py-1 text-brand-muted hover:text-brand-text transition-colors",
                        pathname === "/dashboard" && "text-brand-blue font-bold"
                    )}
                >
                    <LayoutDashboard size={18} />
                    <span className="text-[10px]">Today</span>
                </Link>

                {/* Tasks */}
                <Link
                    href="/dashboard/tasks"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 flex-1 py-1 text-brand-muted hover:text-brand-text transition-colors relative",
                        pathname.startsWith("/dashboard/tasks") && "text-brand-blue font-bold"
                    )}
                >
                    <CheckSquare size={18} />
                    <span className="text-[10px]">Tasks</span>
                    {activeTasksCount > 0 && (
                        <span className="absolute top-0 right-3.5 h-1.5 w-1.5 rounded-full bg-brand-blue" />
                    )}
                </Link>

                {/* Quick Capture Button (Center Prominent) */}
                <div className="flex items-center justify-center flex-1">
                    <button
                        onClick={onOpenQuickCapture}
                        className="h-11 w-11 rounded-full bg-brand-blue text-white shadow-lg shadow-brand-blue/30 flex items-center justify-center -translate-y-2.5 active:scale-95 transition-transform cursor-pointer"
                        title="Quick Capture"
                    >
                        <Plus size={22} className="stroke-[2.5]" />
                    </button>
                </div>

                {/* Ledger */}
                <Link
                    href="/dashboard/ledger"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 flex-1 py-1 text-brand-muted hover:text-brand-text transition-colors",
                        pathname.startsWith("/dashboard/ledger") && "text-brand-gold font-bold"
                    )}
                >
                    <BookOpen size={18} />
                    <span className="text-[10px]">Ledger</span>
                </Link>

                {/* Ask Lifeweft */}
                <Link
                    href="/dashboard/ask"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 flex-1 py-1 text-brand-muted hover:text-brand-text transition-colors",
                        pathname.startsWith("/dashboard/ask") && "text-brand-gold font-bold"
                    )}
                >
                    <Sparkles size={18} />
                    <span className="text-[10px]">Ask</span>
                </Link>
            </div>

            {/* Overlay Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-50 bg-[#04060b]/70 backdrop-blur-sm animate-in fade-in duration-200"
                />
            )}

            {/* Slide-over drawer */}
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-brand-surface border-l border-brand-border z-50 p-5 flex flex-col justify-between transform transition-transform duration-300 ease-in-out select-none",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-4">
                        <span className="font-bold text-lg text-brand-text flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-brand-blue flex items-center justify-center">
                                <span className="font-black text-white text-[11px]">L</span>
                            </div>
                            Lifeweft<span className="text-brand-gold">.</span>
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-border transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
                        {drawerMenuItems.map((item) => {
                            const isActive =
                                item.href === "/dashboard"
                                    ? pathname === "/dashboard"
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 text-brand-muted hover:text-brand-text",
                                        isActive && "bg-brand-blue/10 text-brand-blue font-bold border-l-2 border-brand-blue pl-2.5 rounded-l-none"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={16} />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge !== undefined && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-brand-border text-brand-muted">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Profile & Logout */}
                <div className="space-y-3 pt-4 border-t border-brand-border">
                    <Link
                        href="/dashboard/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-border/40"
                    >
                        <div className="h-8 w-8 rounded-full bg-brand-border flex items-center justify-center border border-brand-blue/20 text-xs font-bold text-brand-blue">
                            {userName.substring(0, 2)}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                            <p className="text-xs font-semibold text-brand-text leading-none mb-0.5 truncate">
                                {userName}
                            </p>
                            <p className="text-[10px] text-brand-muted leading-none">
                                Personal Workspace
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 p-2.5 w-full border border-brand-border rounded-lg text-xs font-medium text-brand-muted hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/40 transition-all cursor-pointer"
                    >
                        <LogOut size={13} />
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </>
    );
};
