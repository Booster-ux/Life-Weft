"use client";

import React, { useState } from "react";
import { useApp, Alarm } from "@/context/AppContext";
import {
    AlarmClock,
    Plus,
    Clock,
    Volume2,
    Calendar,
    Repeat,
    Edit2,
    Trash2,
    Check,
    X,
    Info,
    Smartphone,
    BellOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

const DAYS_LIST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SOUND_OPTIONS = ["Beacon", "Chime", "Dawn", "Pulse", "Zen Bell"];
const SNOOZE_OPTIONS = [5, 10, 15, 20];

export default function AlarmsPage() {
    const { alarms, addAlarm, updateAlarm, toggleAlarm, deleteAlarm } = useApp();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [time, setTime] = useState("07:00");
    const [label, setLabel] = useState("");
    const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    const [sound, setSound] = useState("Beacon");
    const [snoozeDuration, setSnoozeDuration] = useState(10);
    const [enabled, setEnabled] = useState(true);

    const handleOpenCreate = () => {
        setEditingAlarm(null);
        setName("");
        setTime("07:00");
        setLabel("");
        setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
        setSound("Beacon");
        setSnoozeDuration(10);
        setEnabled(true);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (alarm: Alarm) => {
        setEditingAlarm(alarm);
        setName(alarm.name);
        setTime(alarm.time);
        setLabel(alarm.label || "");
        setSelectedDays(alarm.days);
        setSound(alarm.sound || "Beacon");
        setSnoozeDuration(alarm.snoozeDuration || 10);
        setEnabled(alarm.enabled);
        setIsModalOpen(true);
    };

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !time) return;

        if (editingAlarm) {
            await updateAlarm({
                ...editingAlarm,
                name: name.trim(),
                time,
                label: label.trim() || undefined,
                days: selectedDays,
                sound,
                snoozeDuration,
                enabled,
            });
        } else {
            await addAlarm({
                name: name.trim(),
                time,
                label: label.trim() || undefined,
                days: selectedDays,
                sound,
                snoozeDuration,
                enabled,
            });
        }

        setIsModalOpen(false);
    };

    // Format 24h to 12h display
    const formatTimeDisplay = (time24: string): { time: string; period: string } => {
        const [h, m] = (time24 || "07:00").split(":").map(Number);
        if (isNaN(h) || isNaN(m)) {
            return { time: time24 || "07:00", period: "AM" };
        }
        const period = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return {
            time: `${hour12}:${String(m).padStart(2, "0")}`,
            period,
        };
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
                            <AlarmClock size={18} className="text-brand-gold" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Alarms & Schedule Alerts</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-muted">
                        Set structured wake-up calls, focus check-ins, and evening wind-down alarms.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="primary"
                    onClick={handleOpenCreate}
                    className="text-xs font-bold uppercase tracking-wider"
                >
                    <Plus size={14} className="mr-1.5" />
                    New Alarm
                </Button>
            </div>

            {/* Technical Bridge Notice */}
            <div className="p-4 bg-brand-surface/60 border border-brand-border/80 rounded-2xl flex items-start gap-3 text-xs text-brand-muted">
                <Smartphone size={18} className="text-brand-blue flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                    <p className="font-semibold text-white">Native Alarm Architecture</p>
                    <p className="leading-relaxed text-[11px]">
                        Web & PWA alarms trigger reliably while Lifeweft is active in your browser. Full background hardware ringing and lock-screen bypass are engineered to bridge directly into native device APIs.
                    </p>
                </div>
            </div>

            {/* Alarms List */}
            <div className="space-y-3">
                {alarms.length === 0 ? (
                    <div className="p-12 text-center bg-brand-surface border border-brand-border rounded-2xl space-y-3">
                        <div className="h-12 w-12 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mx-auto text-brand-muted">
                            <AlarmClock size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white">No Alarms Configured</h3>
                            <p className="text-xs text-brand-muted max-w-sm mx-auto">
                                Create your first alarm for morning wake up, afternoon deep work sprints, or evening reflection.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleOpenCreate}
                            className="text-xs font-semibold mt-2"
                        >
                            <Plus size={13} className="mr-1" /> Create Alarm
                        </Button>
                    </div>
                ) : (
                    alarms.map((alarm) => {
                        const { time: timeText, period } = formatTimeDisplay(alarm.time);

                        return (
                            <div
                                key={alarm.id}
                                className={cn(
                                    "p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group",
                                    alarm.enabled
                                        ? "bg-brand-surface border-brand-border hover:border-brand-gold/40"
                                        : "bg-brand-surface/40 border-brand-border/50 opacity-60"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Big Time Display */}
                                    <div className="flex items-baseline gap-1 font-mono">
                                        <span className={cn(
                                            "text-3xl sm:text-4xl font-black tracking-tight",
                                            alarm.enabled ? "text-white" : "text-brand-muted"
                                        )}>
                                            {timeText}
                                        </span>
                                        <span className="text-xs font-bold text-brand-gold uppercase">
                                            {period}
                                        </span>
                                    </div>

                                    {/* Name & Metadata */}
                                    <div className="space-y-1 border-l border-brand-border/60 pl-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-xs sm:text-sm text-white">
                                                {alarm.name}
                                            </h3>
                                            {alarm.label && (
                                                <span className="text-[9px] bg-brand-blue/15 text-brand-blue border border-brand-blue/30 px-1.5 py-0.2 rounded font-semibold uppercase">
                                                    {alarm.label}
                                                </span>
                                            )}
                                        </div>

                                        {/* Repeat Days Chips */}
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {DAYS_LIST.map((day) => {
                                                const isSelected = alarm.days.includes(day);
                                                return (
                                                    <span
                                                        key={day}
                                                        className={cn(
                                                            "text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase",
                                                            isSelected && alarm.enabled
                                                                ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/30"
                                                                : "text-brand-muted/40"
                                                        )}
                                                    >
                                                        {day.substring(0, 1)}
                                                    </span>
                                                );
                                            })}
                                            <span className="text-[10px] text-brand-muted ml-2 flex items-center gap-1">
                                                <Volume2 size={11} /> {alarm.sound} • Snooze {alarm.snoozeDuration}m
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions & Toggle Switch */}
                                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-border/50">
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEdit(alarm)}
                                            className="p-2 text-brand-muted hover:text-white rounded-lg hover:bg-brand-bg transition-colors cursor-pointer"
                                            title="Edit Alarm"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteAlarm(alarm.id)}
                                            className="p-2 text-brand-muted hover:text-red-400 rounded-lg hover:bg-brand-bg transition-colors cursor-pointer"
                                            title="Delete Alarm"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Enable / Disable Toggle Switch */}
                                    <button
                                        type="button"
                                        onClick={() => toggleAlarm(alarm.id)}
                                        className={cn(
                                            "w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer flex items-center",
                                            alarm.enabled ? "bg-brand-gold" : "bg-slate-800"
                                        )}
                                        aria-label="Toggle alarm"
                                    >
                                        <div
                                            className={cn(
                                                "w-5.5 h-5.5 rounded-full bg-black shadow-md transform transition-transform duration-200",
                                                alarm.enabled ? "translate-x-5.5" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create / Edit Alarm Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAlarm ? "Edit Alarm" : "Create New Alarm"}
                className="max-w-md"
            >
                <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                    {/* Time Input */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                            Alarm Time (24h)
                        </label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2.5 text-base font-mono font-bold focus:border-brand-gold outline-none"
                        />
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                            Alarm Title / Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 5:30 AM — Wake up"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2 text-xs focus:border-brand-blue outline-none"
                        />
                    </div>

                    {/* Label */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                            Category Label (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Morning, Study, Fitness, Review"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3.5 py-2 text-xs focus:border-brand-blue outline-none"
                        />
                    </div>

                    {/* Repeat Days */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                            Repeat Days
                        </label>
                        <div className="grid grid-cols-7 gap-1">
                            {DAYS_LIST.map((day) => {
                                const isSelected = selectedDays.includes(day);
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={cn(
                                            "py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer text-center",
                                            isSelected
                                                ? "bg-brand-gold text-black font-extrabold shadow-sm"
                                                : "bg-brand-bg text-brand-muted border border-brand-border hover:text-white"
                                        )}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sound & Snooze Duration */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Sound</label>
                            <select
                                value={sound}
                                onChange={(e) => setSound(e.target.value)}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            >
                                {SOUND_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Snooze</label>
                            <select
                                value={snoozeDuration}
                                onChange={(e) => setSnoozeDuration(Number(e.target.value))}
                                className="w-full bg-brand-bg text-brand-text border border-brand-border rounded-xl px-3 py-2 text-xs focus:border-brand-blue outline-none"
                            >
                                {SNOOZE_OPTIONS.map((m) => (
                                    <option key={m} value={m}>
                                        {m} minutes
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Footer Submit */}
                    <div className="pt-3 flex items-center justify-end gap-3 border-t border-brand-border">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                            className="text-xs font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!name.trim() || !time}
                            className="text-xs font-bold uppercase tracking-wider bg-brand-gold text-black hover:bg-amber-400"
                        >
                            {editingAlarm ? "Save Changes" : "Create Alarm"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
