"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
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

interface SidebarProps {
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
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
        // Navigate back to landing or login
        router.push("/");
    };

    return (
        <aside
            className={cn(
                "w-64 bg-brand-surface border-r border-brand-border flex flex-col h-screen sticky top-0 font-sans z-30 transition-transform duration-300",
                className
            )}
        >
            {/* Brand logo */}
            <div className="h-16 px-6 border-b border-brand-border flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/30">
                    <span className="font-extrabold text-white text-base">D</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-brand-text">
                    DailyDo<span className="text-brand-gold">.</span>
                </span>
            </div>

            {/* Nav List */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                    // Check if link is active.
                    // Handle dashboard base which is /dashboard vs other subroutes.
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard" || pathname === "/dashboard/overview"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 smooth-hover text-brand-muted hover:text-brand-text group hover:bg-brand-border/40",
                                isActive && "bg-brand-blue/10 border border-brand-blue/20 text-brand-blue hover:text-brand-blue hover:bg-brand-blue/10"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon
                                    size={18}
                                    className={cn(
                                        "text-brand-muted group-hover:text-brand-text transition-colors",
                                        isActive && "text-brand-blue group-hover:text-brand-blue"
                                    )}
                                />
                                <span className={cn("font-medium transition-colors", isActive && "text-brand-text font-semibold")}>
                                    {item.name}
                                </span>
                            </div>
                            {item.badge !== undefined && (
                                <span
                                    className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full font-bold bg-brand-border text-brand-muted",
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
            <div className="p-4 border-t border-brand-border space-y-3">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-border/40 group transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-brand-border flex items-center justify-center border border-brand-blue/20">
                            <User size={16} className="text-brand-muted group-hover:text-brand-text" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-semibold text-brand-text leading-none mb-0.5">
                                {userName}
                            </p>
                            <p className="text-[10px] text-brand-muted leading-none">
                                Command center
                            </p>
                        </div>
                    </div>
                    <HelpCircle size={16} className="text-brand-muted hover:text-brand-text transition-colors" />
                </Link>

                <button
                    onClick={handleLogout}
                    className="width-100 flex items-center justify-center gap-2 p-2 w-full border border-brand-border rounded-lg text-xs font-medium text-brand-muted hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/40 transition-all cursor-pointer"
                >
                    <LogOut size={13} />
                    Sign out
                </button>
            </div>
        </aside>
    );
};
