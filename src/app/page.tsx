"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Calendar,
    CheckSquare,
    Timer,
    GitFork,
    Library,
    BookOpen,
    Layers,
    ArrowRight,
    Menu,
    X,
    Sparkles,
    Shield,
    Clock,
    Search,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-[#080B12] text-brand-text flex-1 flex flex-col font-sans relative overflow-x-hidden selection:bg-brand-blue/30 selection:text-white min-h-screen">
            {/* Glow Accents */}
            <div className="absolute top-0 left-1/4 h-[500px] w-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[800px] right-1/4 h-[400px] w-[400px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-[#080B12]/85 backdrop-blur-md border-b border-brand-border/40">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:scale-105 transition-transform duration-200">
                            <span className="font-extrabold text-white text-base">L</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-brand-blue transition-colors">
                            Lifeweft<span className="text-brand-gold">.</span>
                        </span>
                    </Link>

                    {/* Nav Links Desktop */}
                    <nav className="hidden md:flex items-center gap-7">
                        <a href="#features" className="text-xs font-semibold text-brand-muted hover:text-white transition-colors uppercase tracking-wider">
                            Features
                        </a>
                        <a href="#ledger" className="text-xs font-semibold text-brand-muted hover:text-white transition-colors uppercase tracking-wider">
                            Personal Ledger
                        </a>
                        <a href="#life-areas" className="text-xs font-semibold text-brand-muted hover:text-white transition-colors uppercase tracking-wider">
                            Life Areas
                        </a>
                        <a href="#intelligence" className="text-xs font-semibold text-brand-muted hover:text-white transition-colors uppercase tracking-wider">
                            Ask Lifeweft
                        </a>
                    </nav>

                    {/* Header Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="font-semibold uppercase tracking-wider text-xs">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="primary" size="sm" className="font-semibold uppercase tracking-wider text-xs px-5 shadow-lg shadow-brand-blue/20">
                                Open Workspace
                            </Button>
                        </Link>
                    </div>

                    {/* Hamburger Menu Trigger */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden p-2 rounded-lg text-brand-muted hover:text-white transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-[#080B12] flex flex-col p-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-6 border-b border-brand-border/60">
                        <span className="font-bold text-xl text-white flex items-center gap-2">
                            <div className="h-7 w-7 rounded bg-brand-blue flex items-center justify-center">
                                <span className="font-black text-white text-xs">L</span>
                            </div>
                            Lifeweft<span className="text-brand-gold">.</span>
                        </span>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-lg text-brand-muted hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-5 py-8">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-brand-muted hover:text-white">
                            Features
                        </a>
                        <a href="#ledger" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-brand-muted hover:text-white">
                            Personal Ledger
                        </a>
                        <a href="#life-areas" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-brand-muted hover:text-white">
                            Life Areas
                        </a>
                        <a href="#intelligence" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-brand-muted hover:text-white">
                            Ask Lifeweft
                        </a>
                    </nav>

                    <div className="mt-auto flex flex-col gap-3 py-6 border-t border-brand-border/40">
                        <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="secondary" className="w-full justify-center">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/dashboard" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="primary" className="w-full justify-center">
                                Enter Workspace
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6 text-center max-w-5xl mx-auto space-y-8">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border text-xs text-brand-muted">
                    <Sparkles size={13} className="text-brand-gold" />
                    <span>Personal Life-Management & Memory Workspace</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
                    One calm place to manage <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-white via-slate-200 to-brand-muted bg-clip-text text-transparent">
                        every dimension of your life.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
                    Lifeweft is not just a to-do list. It helps you manage what you need to <b>do</b>, what you need to <b>remember</b>, what you need to <b>decide</b>, and what you need to <b>learn</b>.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Link href="/dashboard">
                        <Button variant="primary" size="lg" className="font-bold text-xs uppercase tracking-wider px-8 py-3.5 shadow-xl shadow-brand-blue/20 flex items-center gap-2">
                            <span>Open Today Command Center</span>
                            <ArrowRight size={15} />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="secondary" size="lg" className="font-semibold text-xs uppercase tracking-wider px-8 py-3.5">
                            Sign In / Demo
                        </Button>
                    </Link>
                </div>

                {/* Preview Frame */}
                <div className="pt-10 max-w-4xl mx-auto">
                    <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/60 relative overflow-hidden text-left space-y-4">
                        <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                                <span className="text-xs font-mono text-brand-muted ml-2">https://lifeweft.app/dashboard</span>
                            </div>
                            <span className="text-[10px] text-brand-gold font-mono font-bold uppercase tracking-wider">
                                Central Command
                            </span>
                        </div>

                        {/* Interactive UI Mockup Showcase */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                            <div className="bg-brand-bg p-3.5 rounded-xl border border-brand-border space-y-2">
                                <div className="flex items-center gap-1.5 text-brand-blue font-bold">
                                    <CheckSquare size={14} />
                                    <span>Priority Today</span>
                                </div>
                                <p className="text-brand-text font-medium">Q3 Project Review Presentation</p>
                                <span className="text-[10px] text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 font-bold">
                                    High Priority
                                </span>
                            </div>

                            <div className="bg-brand-bg p-3.5 rounded-xl border border-brand-border space-y-2">
                                <div className="flex items-center gap-1.5 text-brand-gold font-bold">
                                    <BookOpen size={14} />
                                    <span>Personal Ledger</span>
                                </div>
                                <p className="text-brand-text font-medium">Apex Studio Discovery Kickoff</p>
                                <span className="text-[10px] text-brand-muted font-mono">Aug 08 • Startup Journey</span>
                            </div>

                            <div className="bg-brand-bg p-3.5 rounded-xl border border-brand-border space-y-2">
                                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                                    <Timer size={14} />
                                    <span>Upcoming Milestone</span>
                                </div>
                                <p className="text-brand-text font-medium">Project Deliverable Alpha</p>
                                <span className="text-[10px] text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/40 font-mono">
                                    Due in 5 days
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Pillars Section */}
            <section id="features" className="py-20 border-t border-brand-border/40 bg-brand-surface/20">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <h2 className="text-xs font-bold text-brand-gold uppercase tracking-widest">
                            The Lifeweft Architecture
                        </h2>
                        <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            More than a to-do list. A complete personal memory and navigation workspace.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Today Command Center */}
                        <div className="bg-brand-surface border border-brand-border rounded-2xl p-7 space-y-4 hover:border-brand-blue/40 transition-colors">
                            <div className="h-10 w-10 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
                                <CheckSquare size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Today Command Center</h3>
                            <p className="text-xs text-brand-muted leading-relaxed">
                                Align morning, afternoon, and evening checkpoints. Quickly capture tasks, timeline notes, deadlines, and decisions without navigating through friction-heavy screens.
                            </p>
                        </div>

                        {/* Card 2: Personal Ledger */}
                        <div id="ledger" className="bg-brand-surface border border-brand-border rounded-2xl p-7 space-y-4 hover:border-brand-gold/40 transition-colors">
                            <div className="h-10 w-10 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Personal Ledger</h3>
                            <p className="text-xs text-brand-muted leading-relaxed">
                                A chronological timeline of life events, meetings, and reflections. Organize into multiple ledgers like Work, Startup Journey, Final Year, or Freelance.
                            </p>
                        </div>

                        {/* Card 3: Decision Journal */}
                        <div className="bg-brand-surface border border-brand-border rounded-2xl p-7 space-y-4 hover:border-indigo-400/40 transition-colors">
                            <div className="h-10 w-10 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
                                <GitFork size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Decision Journal</h3>
                            <p className="text-xs text-brand-muted leading-relaxed">
                                Document situations, weigh pros and cons, articulate reasons, and revisit post-decision actual outcomes to build compounding judgment.
                            </p>
                        </div>

                        {/* Card 4: Life Areas */}
                        <div id="life-areas" className="bg-brand-surface border border-brand-border rounded-2xl p-7 space-y-4 hover:border-brand-blue/40 transition-colors">
                            <div className="h-10 w-10 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
                                <Layers size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Life Areas</h3>
                            <p className="text-xs text-brand-muted leading-relaxed">
                                Segment Personal, Work, Business, School, Family, and Projects without creating multiple fragmented accounts.
                            </p>
                        </div>

                        {/* Card 5: Ask Lifeweft */}
                        <div id="intelligence" className="bg-brand-surface border border-brand-border rounded-2xl p-7 space-y-4 hover:border-brand-gold/40 transition-colors">
                            <div className="h-10 w-10 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Ask Lifeweft</h3>
                            <p className="text-xs text-brand-muted leading-relaxed">
                                Query your workspace through conversation. Ask about past decisions, what you learned, this week's deadlines, or weekly synthesis summaries.
                            </p>
                        </div>

                        {/* Card 6: Privacy-First */}
                        <div className="bg-brand-surface border border-brand-border rounded-2xl p-7 space-y-4 hover:border-emerald-400/40 transition-colors">
                            <div className="h-10 w-10 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Privacy-First Design</h3>
                            <p className="text-xs text-brand-muted leading-relaxed">
                                Designed for absolute personal confidentiality. Architected for secure Supabase Row Level Security so your memories remain strictly yours.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 text-center max-w-4xl mx-auto px-6 space-y-6">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Start managing your life with clarity.
                </h2>
                <p className="text-sm text-brand-muted max-w-md mx-auto">
                    Reclaim focus, record what happened, make sound decisions, and never let important milestones slip through the cracks.
                </p>
                <div className="pt-2">
                    <Link href="/dashboard">
                        <Button variant="primary" size="lg" className="font-bold text-xs uppercase tracking-wider px-8 py-3.5 shadow-xl shadow-brand-blue/20">
                            Launch Lifeweft Workspace
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-brand-border/60 py-8 px-6 text-xs text-brand-muted">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-brand-blue flex items-center justify-center">
                            <span className="font-black text-white text-[11px]">L</span>
                        </div>
                        <span className="font-bold text-white">Lifeweft</span>
                        <span className="text-brand-muted">© {new Date().getFullYear()} Lifeweft. Personal Life-Management & Memory Workspace.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
                        <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
                        <Link href="/dashboard" className="text-brand-blue hover:underline">Launch App</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
