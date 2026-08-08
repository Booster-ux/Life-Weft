"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
    Menu,
    X,
    LayoutDashboard,
    Sun,
    CheckSquare,
    Timer,
    Calendar,
    GitFork,
    Library,
    Settings,
    HelpCircle,
    LogOut,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileNav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { userName, tasks, deadlines } = useApp();

    const activeTasksCount = tasks.filter((t) => !t.completed).length;
    const activeDeadlinesCount = deadlines.filter((d) => !d.completed && d.daysLeft >= 0).length;

    const menuItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Day", href: "/dashboard/my-day", icon: Sun },
        {
            name: "Tasks",
            href: "/dashboard/tasks",
            icon: CheckSquare,
            badge: activeTasksCount > 0 ? activeTasksCount : undefined,
        },
        {
            name: "Deadlines",
            href: "/dashboard/deadlines",
            icon: Timer,
            badge: activeDeadlinesCount > 0 ? activeDeadlinesCount : undefined,
        },
        { name: "Planner", href: "/dashboard/planner", icon: Calendar },
        { name: "Decisions", href: "/dashboard/decisions", icon: GitFork },
        { name: "Knowledge", href: "/dashboard/knowledge", icon: Library },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const handleLogout = () => {
        setIsOpen(false);
        router.push("/");
    };

    const getPageTitle = () => {
        if (pathname === "/dashboard" || pathname === "/dashboard/overview") return "Overview";
        if (pathname.includes("/my-day")) return "My Day";
        if (pathname.includes("/tasks")) return "Tasks";
        if (pathname.includes("/deadlines")) return "Deadlines";
        if (pathname.includes("/planner")) return "Planner";
        if (pathname.includes("/decisions")) return "Decisions";
        if (pathname.includes("/knowledge")) return "Knowledge Base";
        if (pathname.includes("/settings")) return "Settings";
        return "DailyDo";
    };

    return (
        <div className="md:hidden w-full sticky top-0 z-40 bg-brand-surface border-b border-brand-border h-16 px-4 flex items-center justify-between">
            {/* Brand logo label */}
            <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-brand-blue flex items-center justify-center">
                    <span className="font-extrabold text-white text-xs">D</span>
                </div>
                <span className="font-bold text-base tracking-tight text-brand-text">
                    {getPageTitle()}
                </span>
            </Link>

            {/* Hamburger button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-border/40 focus:outline-none transition-colors"
            >
                <Menu size={22} />
            </button>

            {/* Overlay Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-50 bg-[#04060b]/70 backdrop-blur-sm animate-in fade-in duration-200"
                />
            )}

            {/* Slide-over menu */}
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-brand-surface border-l border-brand-border z-50 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div>
                    {/* Header row */}
                    <div className="flex items-center justify-between pb-6 border-b border-brand-border mb-6">
                        <span className="font-bold text-lg text-brand-text flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-brand-blue flex items-center justify-center">
                                <span className="font-black text-white text-[10px]">D</span>
                            </div>
                            DailyDo
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-border transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive =
                                item.href === "/dashboard"
                                    ? pathname === "/dashboard" || pathname === "/dashboard/overview"
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all duration-200 text-brand-muted hover:text-brand-text",
                                        isActive && "bg-brand-blue/10 text-brand-blue font-semibold border-l-2 border-brand-blue pl-2.5 rounded-l-none"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={18} />
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
                <div className="space-y-4 pt-6 border-t border-brand-border">
                    <Link
                        href="/dashboard/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-border/40"
                    >
                        <div className="h-9 w-9 rounded-full bg-brand-border flex items-center justify-center">
                            <User size={16} className="text-brand-muted" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="text-xs font-semibold text-brand-text leading-none mb-0.5">
                                {userName}
                            </p>
                            <p className="text-[10px] text-brand-muted leading-none">
                                Command center
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 p-3 w-full border border-brand-border rounded-lg text-xs font-medium text-brand-muted hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/40 transition-all cursor-pointer"
                    >
                        <LogOut size={13} />
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};
