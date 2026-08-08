"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { User, Bell, Shield, Sliders, LogOut, Check, Save } from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();
    const { userName, setUserName } = useApp();

    // Settings State
    const [profileName, setProfileName] = useState(userName);
    const [profileEmail, setProfileEmail] = useState("julian.v@example.com");
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Preference visual states
    const [timezone, setTimezone] = useState("UTC+2");
    const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
    const [startOfWeek, setStartOfWeek] = useState("Monday");

    // Notification visual states
    const [taskReminders, setTaskReminders] = useState(true);
    const [deadlineReminders, setDeadlineReminders] = useState(true);
    const [dailySummary, setDailySummary] = useState(false);

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileName.trim()) return;

        setUserName(profileName.trim());
        setSaveSuccess(true);

        setTimeout(() => {
            setSaveSuccess(false);
        }, 2000);
    };

    const handleLogout = () => {
        router.push("/");
    };

    const getSectionHeader = (title: string, icon: React.ReactNode) => (
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border/40 mb-4 select-none">
            {icon}
            <h3 className="font-bold text-sm text-white">{title}</h3>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    Settings
                </h1>
                <p className="text-sm text-brand-muted mt-1 leading-none">
                    Configure visual formats, timezone triggers, reminders, and profile tags.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Profile & Preferences) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Profile Form */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm">
                        {getSectionHeader("User Profile", <User size={15} className="text-brand-blue" />)}

                        <form onSubmit={handleProfileSave} className="space-y-4">

                            {/* Picture mock layout */}
                            <div className="flex items-center gap-4 py-2 border-b border-brand-border/30 pb-4">
                                <div className="h-14 w-14 rounded-full bg-brand-bg md:group hover:bg-brand-border/50 border border-brand-blue/30 flex items-center justify-center font-bold text-lg text-brand-blue uppercase">
                                    {profileName.substring(0, 2)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-text leading-none">Avatar profile image</p>
                                    <p className="text-[10px] text-brand-muted mt-1 leading-none">Auto generated based on profile name initials.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profileEmail}
                                        onChange={(e) => setProfileEmail(e.target.value)}
                                        className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2 text-sm focus:border-brand-blue outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3.5 pt-2">
                                {saveSuccess && (
                                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 leading-none py-2.5 animate-in fade-in duration-200">
                                        <Check size={14} />
                                        Changes committed
                                    </span>
                                )}
                                <Button type="submit" variant="primary" size="sm" className="font-semibold flex items-center gap-1.5 uppercase text-xs">
                                    <Save size={13} />
                                    Update Profile
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm">
                        {getSectionHeader("Localization & Preferences", <Sliders size={15} className="text-brand-gold" />)}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Timezone</label>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-sm focus:border-brand-blue"
                                >
                                    <option value="UTC-5">UTC-5 (EST - Eastern Standard)</option>
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
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-sm focus:border-brand-blue"
                                >
                                    <option value="YYYY-MM-DD">YYYY-MM-DD (Standard)</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY (US format)</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY (EU format)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Week Commencement</label>
                                <select
                                    value={startOfWeek}
                                    onChange={(e) => setStartOfWeek(e.target.value)}
                                    className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-lg px-3 py-2.5 text-sm focus:border-brand-blue"
                                >
                                    <option value="Monday">Monday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Reminders & Security Actions) */}
                <div className="space-y-6">

                    {/* Notifications Toggles */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
                        {getSectionHeader("Notifications", <Bell size={15} className="text-brand-blue" />)}

                        <div className="space-y-3.5">
                            {/* Reminder 1 */}
                            <label className="flex items-start justify-between gap-3 cursor-pointer select-none group">
                                <div className="min-w-0 pr-4">
                                    <p className="text-xs font-bold text-white leading-none">Task reminders</p>
                                    <p className="text-[10px] text-brand-muted mt-1 leading-normal">Prompt when timeline events are due.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={taskReminders}
                                    onChange={() => setTaskReminders(!taskReminders)}
                                    className="h-4.5 w-4.5 rounded border border-brand-border bg-brand-bg focus:ring-0 checked:bg-brand-blue checked:border-brand-blue text-brand-blue focus:outline-none transition-colors cursor-pointer"
                                />
                            </label>

                            {/* Reminder 2 */}
                            <label className="flex items-start justify-between gap-3 cursor-pointer select-none group">
                                <div className="min-w-0 pr-4">
                                    <p className="text-xs font-bold text-white leading-none">Deadline alerts</p>
                                    <p className="text-[10px] text-brand-muted mt-1 leading-normal">Pings when target timelines enter overdue states.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={deadlineReminders}
                                    onChange={() => setDeadlineReminders(!deadlineReminders)}
                                    className="h-4.5 w-4.5 rounded border border-brand-border bg-brand-bg checked:bg-brand-blue checked:border-brand-blue text-brand-blue focus:outline-none transition-colors cursor-pointer"
                                />
                            </label>

                            {/* Reminder 3 */}
                            <label className="flex items-start justify-between gap-3 cursor-pointer select-none group">
                                <div className="min-w-0 pr-4">
                                    <p className="text-xs font-bold text-white leading-none">Daily visual summary</p>
                                    <p className="text-[10px] text-brand-muted mt-1 leading-normal">Receive command reports each morning via email.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={dailySummary}
                                    onChange={() => setDailySummary(!dailySummary)}
                                    className="h-4.5 w-4.5 rounded border border-brand-border bg-brand-bg checked:bg-brand-blue checked:border-brand-blue text-brand-blue focus:outline-none transition-colors cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm space-y-4">
                        {getSectionHeader("Account & Security", <Shield size={15} className="text-rose-400" />)}

                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => alert("Simulation: Reset password link dispatched to email.")}
                                className="w-full text-center py-2 px-3 bg-brand-bg hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-white border border-brand-border rounded-lg transition-all cursor-pointer font-sans"
                            >
                                Change password
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full text-center py-2 px-3 bg-brand-bg hover:bg-brand-border/40 text-xs font-semibold text-brand-muted hover:text-white border border-brand-border rounded-lg transition-all cursor-pointer font-sans flex items-center justify-center gap-1.5"
                            >
                                <LogOut size={13} />
                                Log out
                            </button>
                        </div>

                        <div className="pt-2 border-t border-brand-border/40">
                            <p className="text-[10px] text-brand-muted mb-2Leading">Once deleted, data is instantly eradicated from mock contexts.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm("Warning: Purge mock memory registers and delete all tasks, notes?")) {
                                        localStorage.clear();
                                        window.location.href = "/";
                                    }
                                }}
                                className="w-full py-2 bg-red-950/20 hover:bg-red-900/40 text-[10.5px] uppercase tracking-wider font-extrabold text-red-400 hover:text-red-300 border border-red-950/50 hover:border-red-500/50 rounded-lg transition-all cursor-pointer font-sans"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
