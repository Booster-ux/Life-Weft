"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
    User,
    Bell,
    Shield,
    Sliders,
    LogOut,
    Check,
    Save,
    Layers,
    BookOpen,
    Plus,
    Trash2,
} from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();
    const {
        user,
        userName,
        updateProfile,
        signOut,
        lifeAreas,
        addLifeArea,
        deleteLifeArea,
        ledgers,
        addLedger,
        deleteLedger,
    } = useApp();

    // Profile state
    const [profileName, setProfileName] = useState(userName);
    const [profileEmail, setProfileEmail] = useState(user?.email || "julian.v@example.com");
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (user?.email) {
            setProfileEmail(user.email);
        }
        if (userName) {
            setProfileName(userName);
        }
    }, [user, userName]);

    // Life Areas management state
    const [newAreaName, setNewAreaName] = useState("");
    const [newAreaColor, setNewAreaColor] = useState("#3B82F6");

    // Preferences state
    const [timezone, setTimezone] = useState("UTC");
    const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
    const [startOfWeek, setStartOfWeek] = useState("Monday");

    // Notification states
    const [taskReminders, setTaskReminders] = useState(true);
    const [deadlineReminders, setDeadlineReminders] = useState(true);
    const [dailySummary, setDailySummary] = useState(false);

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileName.trim()) return;

        await updateProfile(profileName.trim(), timezone);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    const handleLogout = async () => {
        await signOut();
    };

    const handleAddLifeArea = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAreaName.trim()) return;

        addLifeArea({
            name: newAreaName.trim(),
            color: newAreaColor,
        });

        setNewAreaName("");
    };

    const getSectionHeader = (title: string, icon: React.ReactNode) => (
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border/40 mb-4 select-none">
            {icon}
            <h3 className="font-bold text-sm text-white">{title}</h3>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    Settings & Workspace Preferences
                </h1>
                <p className="text-sm text-brand-muted mt-1 leading-none">
                    Configure your profile, life areas, custom ledgers, localization, and privacy.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Profile & Life Areas & Preferences) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Profile */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm">
                        {getSectionHeader("User Profile", <User size={15} className="text-brand-blue" />)}

                        <form onSubmit={handleProfileSave} className="space-y-4">
                            <div className="flex items-center gap-4 py-2 border-b border-brand-border/30 pb-4">
                                <div className="h-12 w-12 rounded-full bg-brand-bg border border-brand-blue/30 flex items-center justify-center font-bold text-base text-brand-blue uppercase">
                                    {profileName.substring(0, 2)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-text leading-none">Profile Name & Workspace Identity</p>
                                    <p className="text-[10px] text-brand-muted mt-1 leading-none">Used across Lifeweft greetings and intelligence queries.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileEmail}
                                        onChange={(e) => setProfileEmail(e.target.value)}
                                        className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3.5 pt-2">
                                {saveSuccess && (
                                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 leading-none py-2.5">
                                        <Check size={14} />
                                        Profile updated
                                    </span>
                                )}
                                <Button type="submit" variant="primary" size="sm" className="font-semibold flex items-center gap-1.5 uppercase text-xs">
                                    <Save size={13} />
                                    Save Profile
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Life Areas Manager */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
                        {getSectionHeader("Life Areas Manager", <Layers size={15} className="text-brand-gold" />)}

                        <p className="text-xs text-brand-muted leading-relaxed">
                            Life Areas allow you to organize tasks, ledger entries, decisions, and knowledge without needing multiple accounts.
                        </p>

                        {/* List Existing Life Areas */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {lifeAreas.map((area) => (
                                <div
                                    key={area.id}
                                    className="p-2.5 bg-brand-bg rounded-lg border border-brand-border flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: area.color }} />
                                        <span className="text-xs font-semibold text-brand-text truncate">{area.name}</span>
                                    </div>
                                    {lifeAreas.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => deleteLifeArea(area.id)}
                                            className="text-brand-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                                            title="Delete Area"
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Life Area Form */}
                        <form onSubmit={handleAddLifeArea} className="flex gap-2 pt-2 border-t border-brand-border/40">
                            <input
                                type="text"
                                placeholder="Create new Life Area (e.g. Health, Music, Research)..."
                                value={newAreaName}
                                onChange={(e) => setNewAreaName(e.target.value)}
                                className="flex-1 bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            />
                            <div className="flex items-center gap-1.5">
                                {["#3B82F6", "#D4A72C", "#10B981", "#EC4899", "#8B5CF6", "#F97316"].map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setNewAreaColor(color)}
                                        className={`h-5 w-5 rounded-full border cursor-pointer ${newAreaColor === color ? "scale-110 border-white" : "border-transparent opacity-60"}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <Button type="submit" variant="secondary" size="sm" className="font-semibold text-xs flex-shrink-0">
                                <Plus size={14} /> Add
                            </Button>
                        </form>
                    </div>

                    {/* Localization & Preferences */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm">
                        {getSectionHeader("Localization & Preferences", <Sliders size={15} className="text-brand-blue" />)}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Timezone</label>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                                >
                                    <option value="UTC-5">UTC-5 (EST - Eastern)</option>
                                    <option value="UTC+0">UTC+0 (GMT - London)</option>
                                    <option value="UTC+2">UTC+2 (CEST - Central Europe)</option>
                                    <option value="UTC+8">UTC+8 (SGT - Singapore)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Date Layout</label>
                                <select
                                    value={dateFormat}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                                >
                                    <option value="YYYY-MM-DD">YYYY-MM-DD (Standard)</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY (US format)</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY (EU format)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Week Start</label>
                                <select
                                    value={startOfWeek}
                                    onChange={(e) => setStartOfWeek(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-xs focus:border-brand-blue"
                                >
                                    <option value="Monday">Monday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Reminders & Privacy) */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
                        {getSectionHeader("Notifications", <Bell size={15} className="text-brand-gold" />)}

                        <div className="space-y-3.5">
                            <label className="flex items-start justify-between gap-3 cursor-pointer select-none">
                                <div className="min-w-0 pr-4">
                                    <p className="text-xs font-bold text-white leading-none">Task reminders</p>
                                    <p className="text-[10px] text-brand-muted mt-1">Prompt when timeline items are due.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={taskReminders}
                                    onChange={() => setTaskReminders(!taskReminders)}
                                    className="h-4.5 w-4.5 rounded border border-brand-border bg-brand-bg checked:bg-brand-blue"
                                />
                            </label>

                            <label className="flex items-start justify-between gap-3 cursor-pointer select-none">
                                <div className="min-w-0 pr-4">
                                    <p className="text-xs font-bold text-white leading-none">Deadline alerts</p>
                                    <p className="text-[10px] text-brand-muted mt-1">Urgency indicators on upcoming target dates.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={deadlineReminders}
                                    onChange={() => setDeadlineReminders(!deadlineReminders)}
                                    className="h-4.5 w-4.5 rounded border border-brand-border bg-brand-bg checked:bg-brand-blue"
                                />
                            </label>

                            <label className="flex items-start justify-between gap-3 cursor-pointer select-none">
                                <div className="min-w-0 pr-4">
                                    <p className="text-xs font-bold text-white leading-none">Daily visual summary</p>
                                    <p className="text-[10px] text-brand-muted mt-1">Daily command briefing on Today view.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={dailySummary}
                                    onChange={() => setDailySummary(!dailySummary)}
                                    className="h-4.5 w-4.5 rounded border border-brand-border bg-brand-bg checked:bg-brand-blue"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Privacy & Account Security */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
                        {getSectionHeader("Privacy & Security", <Shield size={15} className="text-emerald-400" />)}

                        <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg text-[11px] text-emerald-300 leading-relaxed">
                            Lifeweft is built with a strict privacy-first foundation. All memory logs and personal decisions are stored securely.
                        </div>

                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full text-center py-2 px-3 bg-brand-bg hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-white border border-brand-border rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <LogOut size={13} />
                                Sign out of Lifeweft
                            </button>
                        </div>

                        <div className="pt-2 border-t border-brand-border/40">
                            <p className="text-[10px] text-brand-muted mb-2">Clear local memory cache and reset workspace state:</p>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm("Reset workspace storage to default Lifeweft data?")) {
                                        localStorage.clear();
                                        window.location.href = "/dashboard";
                                    }
                                }}
                                className="w-full py-2 bg-red-950/20 hover:bg-red-900/40 text-[10.5px] uppercase tracking-wider font-extrabold text-red-400 hover:text-red-300 border border-red-950/50 rounded-lg transition-all cursor-pointer"
                            >
                                Reset Local Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
