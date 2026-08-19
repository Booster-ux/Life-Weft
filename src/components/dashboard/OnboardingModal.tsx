"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
    Sparkles,
    Layers,
    Target,
    GitBranch,
    CalendarDays,
    BookOpen,
    ArrowRight,
    ArrowLeft,
    Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

export const OnboardingModal: React.FC = () => {
    const { onboardingCompleted, completeOnboarding } = useApp();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    if (onboardingCompleted) return null;

    const steps = [
        {
            title: "Welcome to Lifeweft",
            subtitle: "One calm workspace to navigate what you need to do, remember, decide, and learn.",
            icon: Sparkles,
            iconColor: "text-brand-gold",
            bgGlow: "bg-brand-gold/10",
            content: (
                <div className="space-y-4 text-xs leading-relaxed text-brand-muted">
                    <p>
                        Lifeweft is not just a to-do list. It is your personal information layer and memory chronicle designed to turn broad life visions into daily clarity.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="p-3 bg-brand-bg rounded-xl border border-brand-border space-y-1">
                            <span className="font-bold text-white block">Big Vision</span>
                            <span className="text-[11px] text-brand-muted">Decompose yearly goals into daily momentum.</span>
                        </div>
                        <div className="p-3 bg-brand-bg rounded-xl border border-brand-border space-y-1">
                            <span className="font-bold text-white block">Personal Record</span>
                            <span className="text-[11px] text-brand-muted">Keep a timeline of decisions, memories, and lessons.</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Step 1: Organize into Life Areas",
            subtitle: "Segment your workspace without creating multiple fragmented accounts.",
            icon: Layers,
            iconColor: "text-brand-blue",
            bgGlow: "bg-brand-blue/10",
            content: (
                <div className="space-y-4 text-xs leading-relaxed text-brand-muted">
                    <p>
                        Life Areas represent the key pillars of your life. All your goals, tasks, ledger notes, deadlines, and decisions can belong to a Life Area.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {[
                            { name: "Personal", color: "#3B82F6" },
                            { name: "Work", color: "#2563EB" },
                            { name: "Business", color: "#D4A72C" },
                            { name: "Education", color: "#10B981" },
                            { name: "Health", color: "#EC4899" },
                        ].map((area) => (
                            <span
                                key={area.name}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-white text-xs font-semibold"
                            >
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: area.color }} />
                                {area.name}
                            </span>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: "Step 2: Set Your Goals & Break Them Down",
            subtitle: "Answer 'What do I want to achieve?' then 'What do I need to do today?'",
            icon: GitBranch,
            iconColor: "text-brand-gold",
            bgGlow: "bg-brand-gold/10",
            content: (
                <div className="space-y-4 text-xs leading-relaxed text-brand-muted">
                    <p>
                        Create a yearly vision, then use our <b>Goal Breakdown Wizard</b> to generate realistic quarterly milestones, monthly targets, weekly focus sprints, and daily actions.
                    </p>
                    <div className="p-3 bg-brand-bg rounded-xl border border-brand-border font-mono text-[11px] space-y-1 text-slate-300">
                        <div className="text-brand-gold font-bold">YEARLY VISION: Launch Business</div>
                        <div className="pl-3 text-slate-400">↳ Q1 MILESTONE: Build MVP & Database</div>
                        <div className="pl-6 text-slate-400">↳ JANUARY: Set up Auth & Schema</div>
                        <div className="pl-9 text-emerald-400 font-semibold">↳ TODAY: Complete Goal Breakdown</div>
                    </div>
                </div>
            ),
        },
        {
            title: "Step 3: Plan Your Day & Focus",
            subtitle: "Use My Day and the Planner to execute with calm intention.",
            icon: CalendarDays,
            iconColor: "text-brand-blue",
            bgGlow: "bg-brand-blue/10",
            content: (
                <div className="space-y-4 text-xs leading-relaxed text-brand-muted">
                    <p>
                        Schedule focus blocks throughout your week and align morning, afternoon, and evening priorities in <b>My Day</b>. Connected tasks automatically drive your goal progress forward.
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div className="p-2.5 bg-brand-bg rounded-lg border border-brand-border">
                            <span className="text-amber-400 font-bold block">Morning</span>
                            <span className="text-brand-muted text-[10px]">Deep Focus</span>
                        </div>
                        <div className="p-2.5 bg-brand-bg rounded-lg border border-brand-border">
                            <span className="text-brand-blue font-bold block">Afternoon</span>
                            <span className="text-brand-muted text-[10px]">Execution</span>
                        </div>
                        <div className="p-2.5 bg-brand-bg rounded-lg border border-brand-border">
                            <span className="text-indigo-400 font-bold block">Evening</span>
                            <span className="text-brand-muted text-[10px]">Reflection</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Step 4: Keep Your Personal Ledger",
            subtitle: "Record what happened, decisions made, and lessons learned.",
            icon: BookOpen,
            iconColor: "text-brand-gold",
            bgGlow: "bg-brand-gold/10",
            content: (
                <div className="space-y-4 text-xs leading-relaxed text-brand-muted">
                    <p>
                        The <b>Personal Ledger</b> is your life chronicle. Record meetings, life events, breakthroughs, and reflections to build an enduring personal knowledge layer.
                    </p>
                    <div className="p-3 bg-brand-bg rounded-xl border border-brand-border text-white text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-brand-gold font-bold">
                            <span>AUG 08, 2026</span>
                            <span>#STARTUP</span>
                        </div>
                        <p className="font-semibold text-white">Closed first beta partner agreement</p>
                        <p className="text-[11px] text-brand-muted">Key insight: Clear roadmaps build trust.</p>
                    </div>
                </div>
            ),
        },
    ];

    const current = steps[currentStep];
    const Icon = current.icon;
    const isLast = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLast) {
            completeOnboarding();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleStartGoal = () => {
        completeOnboarding();
        router.push("/dashboard/goals");
    };

    return (
        <Modal
            isOpen={!onboardingCompleted}
            onClose={() => completeOnboarding()}
            title=""
            className="max-w-lg p-0 overflow-hidden"
        >
            <div className="p-6 sm:p-7 space-y-6">
                {/* Step indicator pills */}
                <div className="flex items-center gap-1.5 justify-center">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === currentStep
                                    ? "w-8 bg-brand-gold"
                                    : i < currentStep
                                    ? "w-4 bg-brand-blue"
                                    : "w-2 bg-brand-border"
                            }`}
                        />
                    ))}
                </div>

                {/* Header Icon + Title */}
                <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-2xl ${current.bgGlow} border border-brand-border flex items-center justify-center flex-shrink-0`}>
                        <Icon size={24} className={current.iconColor} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                            {current.title}
                        </h2>
                        <p className="text-xs text-brand-muted leading-relaxed">
                            {current.subtitle}
                        </p>
                    </div>
                </div>

                {/* Step Content */}
                <div className="min-h-[140px]">{current.content}</div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-border/50">
                    <button
                        type="button"
                        onClick={() => completeOnboarding()}
                        className="text-xs font-semibold text-brand-muted hover:text-white transition-colors cursor-pointer"
                    >
                        Skip tutorial
                    </button>

                    <div className="flex items-center gap-2">
                        {currentStep > 0 && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="text-xs px-3"
                            >
                                <ArrowLeft size={13} className="mr-1" /> Back
                            </Button>
                        )}

                        {isLast ? (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleStartGoal}
                                className="text-xs font-bold uppercase tracking-wider px-4 shadow-lg shadow-brand-gold/20"
                            >
                                <Sparkles size={13} className="mr-1.5 text-brand-gold" />
                                Start with My First Goal
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleNext}
                                className="text-xs font-bold uppercase tracking-wider px-4"
                            >
                                Next <ArrowRight size={13} className="ml-1" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
