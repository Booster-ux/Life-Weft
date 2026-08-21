import React from "react";
import {
    Settings,
    Shield,
    Lock,
    Key,
    Database,
    Globe,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pb-4 border-b border-slate-800">
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                    <Settings className="text-indigo-400" />
                    Admin & Security Configuration
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                    System-wide security architecture, Supabase RLS policies, and environment verification.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Security & RLS Policies */}
                <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                        <Shield size={16} className="text-brand-blue" />
                        <h3 className="text-sm font-bold text-white">Database Row Level Security (RLS)</h3>
                    </div>

                    <div className="space-y-2.5 text-xs">
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800">
                            <span className="text-slate-300 font-mono">public.profiles</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle size={12} /> Admin + Self Only
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800">
                            <span className="text-slate-300 font-mono">public.tasks</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle size={12} /> Owner Isolated (user_id)
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800">
                            <span className="text-slate-300 font-mono">public.goals</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle size={12} /> Owner Isolated (user_id)
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800">
                            <span className="text-slate-300 font-mono">public.system_reports</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle size={12} /> Admin Managed
                            </span>
                        </div>
                    </div>
                </div>

                {/* Authentication & Secrets Governance */}
                <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                        <Lock size={16} className="text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Auth & Secrets Governance</h3>
                    </div>

                    <div className="space-y-3 text-xs text-slate-300">
                        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                            <p className="font-bold text-white flex items-center gap-1.5">
                                <Key size={13} className="text-brand-blue" />
                                No Hardcoded Credentials
                            </p>
                            <p className="text-[11px] text-slate-400 leading-normal">
                                Admin access is strictly governed by Supabase Auth JWT tokens and server-side profile role validation. Service-role secrets remain server-only.
                            </p>
                        </div>

                        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                            <p className="font-bold text-white flex items-center gap-1.5">
                                <Globe size={13} className="text-emerald-400" />
                                Multi-Region Device Timezone
                            </p>
                            <p className="text-[11px] text-slate-400 leading-normal">
                                User timezones are auto-detected via browser Intl API and stored as IANA timezones (e.g. Africa/Lagos, America/New_York) with UTC timestamptz DB safety.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
