"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShieldCheck,
    Users,
    Activity,
    LifeBuoy,
    Settings,
    ArrowLeft,
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNavProps {
    userName: string;
    userEmail: string;
}

const NAV_ITEMS = [
    { href: "/admin", label: "Overview", icon: Activity, color: "text-brand-blue" },
    { href: "/admin/users", label: "Users", icon: Users, color: "text-emerald-400" },
    { href: "/admin/reports", label: "Reports & Issues", icon: LifeBuoy, color: "text-amber-400" },
    { href: "/admin/settings", label: "Settings", icon: Settings, color: "text-indigo-400" },
];

export const AdminNav: React.FC<AdminNavProps> = ({ userName, userEmail }) => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 border-r border-slate-800/80 bg-[#0B0F17]/95 backdrop-blur-md flex-col justify-between p-4 flex-shrink-0 min-h-screen">
                <div className="space-y-6">
                    {/* Brand Header */}
                    <div className="flex items-center gap-3 px-2 py-1.5">
                        <div className="w-9 h-9 rounded-lg bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue shadow-inner">
                            <ShieldCheck size={20} className="text-brand-blue" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-black text-sm tracking-tight text-white">LIFEWEFT</span>
                                <span className="text-[10px] bg-brand-blue/20 text-brand-blue font-bold px-1.5 py-0.5 rounded border border-brand-blue/30 uppercase">
                                    Admin
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400">Control Center</p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors",
                                        isActive
                                            ? "bg-slate-800 text-white shadow-sm border border-slate-700/60 font-bold"
                                            : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <Icon size={16} className={item.color} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom user profile & return to app */}
                <div className="pt-4 border-t border-slate-800/60 space-y-3">
                    <div className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Admin Session</p>
                        <p className="text-xs font-bold text-white truncate">{userName || userEmail}</p>
                        <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                            Verified Superadmin
                        </p>
                    </div>

                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>Return to Workspace</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Top Navigation Bar */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0B0F17] border-b border-slate-800 sticky top-0 z-40">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue">
                        <ShieldCheck size={16} className="text-brand-blue" />
                    </div>
                    <span className="font-black text-sm tracking-tight text-white">LIFEWEFT ADMIN</span>
                </div>

                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    aria-label="Toggle admin navigation"
                >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </header>

            {/* Mobile Drawer Overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in flex flex-col justify-between p-4 pt-16">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-brand-blue" />
                                <span className="font-bold text-sm text-white">Admin Navigation</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <nav className="space-y-1.5">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                                            isActive
                                                ? "bg-slate-800 text-white font-bold border border-slate-700"
                                                : "text-slate-300 hover:bg-slate-800/40"
                                        )}
                                    >
                                        <Icon size={18} className={item.color} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="pt-4 border-t border-slate-800 space-y-3">
                        <Link
                            href="/dashboard"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 border border-slate-700"
                        >
                            <ArrowLeft size={14} />
                            <span>Return to Workspace</span>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};
