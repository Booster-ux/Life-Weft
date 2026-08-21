import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
    ShieldCheck,
    Users,
    Activity,
    LifeBuoy,
    Settings,
    ArrowLeft,
    Layers,
    Server,
} from "lucide-react";

export const metadata = {
    title: "Admin Console — Lifeweft",
    description: "Administrative oversight, user directory, system reports and health.",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?redirectedFrom=/admin");
    }

    // Verify admin role server-side
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, email:id")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        redirect("/dashboard?error=unauthorized_admin_access");
    }

    return (
        <div className="flex min-h-screen bg-[#07090E] text-slate-100 font-sans">
            {/* Desktop Admin Sidebar */}
            <aside className="w-64 border-r border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md flex flex-col justify-between p-4 flex-shrink-0">
                <div className="space-y-6">
                    {/* Brand header */}
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
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                        >
                            <Activity size={16} className="text-brand-blue" />
                            <span>System Overview</span>
                        </Link>

                        <Link
                            href="/admin/users"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                        >
                            <Users size={16} className="text-emerald-400" />
                            <span>User Management</span>
                        </Link>

                        <Link
                            href="/admin/reports"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                        >
                            <LifeBuoy size={16} className="text-amber-400" />
                            <span>Reports & Issues</span>
                        </Link>

                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                        >
                            <Settings size={16} className="text-indigo-400" />
                            <span>Admin Settings</span>
                        </Link>
                    </nav>
                </div>

                {/* Bottom user profile & back link */}
                <div className="pt-4 border-t border-slate-800/60 space-y-3">
                    <div className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Admin Session</p>
                        <p className="text-xs font-bold text-white truncate">{profile?.full_name || user.email}</p>
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

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <div className="max-w-6xl w-full mx-auto p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
