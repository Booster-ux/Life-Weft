"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckSquare,
  Timer,
  GitFork,
  Library,
  Layers,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#080B12] text-brand-text flex-1 flex flex-col font-sans relative overflow-x-hidden selection:bg-brand-blue/30 selection:text-white">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 h-[400px] w-[400px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#080B12]/80 backdrop-blur-md border-b border-brand-border/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-extrabold text-white text-base">D</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-brand-blue transition-colors">
              DailyDo<span className="text-brand-gold">.</span>
            </span>
          </Link>

          {/* Nav Items Desktop */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#features" className="text-xs font-semibold text-brand-muted hover:text-white transition-colors uppercase tracking-wider">
              Features
            </a>
            <a href="#how-it-works" className="text-xs font-semibold text-brand-muted hover:text-white transition-colors uppercase tracking-wider">
              How It Works
            </a>
            <a href="/login" className="text-xs font-semibold text-brand-muted hover:text-white transition-colors uppercase tracking-wider">
              For Students
            </a>
            <a href="/login" className="text-xs font-semibold text-brand-muted hover:text-white transition-colors uppercase tracking-wider">
              For Work
            </a>
            <a href="/login" className="text-xs font-semibold text-brand-muted hover:text-white transition-colors uppercase tracking-wider">
              Pricing
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold uppercase tracking-wider text-xs">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm" className="font-semibold uppercase tracking-wider text-xs px-5">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Hamburger Menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-brand-muted hover:text-white hover:bg-brand-surface/60 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#080B12] flex flex-col p-6 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between pb-6 border-b border-brand-border/60">
            <span className="font-bold text-xl text-white flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-brand-blue flex items-center justify-center">
                <span className="font-black text-white text-xs">D</span>
              </div>
              DailyDo
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-brand-muted hover:text-white hover:bg-brand-surfaceTransition"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 py-10">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-brand-muted hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-brand-muted hover:text-white transition-colors"
            >
              How It Works
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-brand-muted hover:text-white transition-colors"
            >
              For Students
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-brand-muted hover:text-white transition-colors"
            >
              For Work
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-brand-muted hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-3 py-6 border-t border-brand-border/40">
            <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full justify-center">
                Log in
              </Button>
            </Link>
            <Link href="/signup" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Pitch Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-xs font-semibold text-brand-blue tracking-wide uppercase select-none animate-bounce">
            <Sparkles size={11} className="text-brand-gold animate-pulse" />
            Introducing DailyDo Command Center
          </div>

          {/* Hero text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.08] mb-1">
            Your day. Your priorities. <br />
            <span className="text-brand-blue bg-clip-text text-transparent bg-gradient-to-r from-brand-blue via-brand-blue to-teal-400">
              Your DailyDo.
            </span>
          </h1>

          <p className="text-md sm:text-lg text-brand-muted max-w-xl leading-relaxed">
            Organize your tasks, deadlines, plans, and everyday responsibilities in one simple place.
            Know what matters. Do what matters.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full justify-center group font-bold tracking-wide uppercase text-xs">
                Get Started Free
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full justify-center text-xs font-bold uppercase tracking-wide">
                See How It Works
              </Button>
            </a>
          </div>
        </div>

        {/* Dashboard Preview / Mockup */}
        <div className="mt-16 md:mt-20 border border-brand-border/60 rounded-2xl bg-brand-surface p-4 sm:p-5 shadow-2xl shadow-black/80 max-w-5xl mx-auto relative group">
          {/* Gloss overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent rounded-2xl opacity-60 pointer-events-none" />

          {/* Window dots */}
          <div className="flex gap-1.5 pb-4.5 border-b border-brand-border-muted/30 mb-4 items-center">
            <span className="h-3 w-3 rounded-full bg-red-500/30" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/30" />
            <span className="h-3 w-3 rounded-full bg-green-500/30" />
            <span className="text-xs text-brand-muted font-medium ml-4 font-mono select-none">https://app.dailydo.center/dashboard</span>
          </div>

          {/* Dashboard contents preview grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#080B12]/80 border border-brand-border/40 rounded-xl p-4 sm:p-6 text-left select-none">
            {/* Left side preview */}
            <div className="md:col-span-2 space-y-5">
              <div className="flex justify-between items-center gap-4 flex-wrap">
                <div>
                  <h4 className="text-lg font-bold text-white leading-none">Good morning, Julian.</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-none">Here's what deserves your attention today.</p>
                </div>
                <div className="bg-brand-surface border border-brand-border px-3 py-1 rounded-md text-xs font-semibold text-brand-blue flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-brand-gold" />
                  4 of 7 completed
                </div>
              </div>

              {/* Today's Priorities */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-brand-muted tracking-wider uppercase">Priority Today</p>

                {/* Priority high */}
                <div className="bg-brand-surface border border-brand-border/60 hover:border-brand-gold/20 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-4.5 w-4.5 rounded border border-brand-gold bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                      <span className="text-[10px] font-bold">!</span>
                    </span>
                    <span className="text-xs font-semibold text-white">Submit Q3 Budget Proposal Draft</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[9px] bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded font-bold uppercase">High</span>
                    <span className="text-[9px] text-brand-muted bg-brand-bg px-2 py-0.5 rounded font-medium">10:00 AM</span>
                  </div>
                </div>

                {/* Priority normal */}
                <div className="bg-brand-surface border border-brand-border/60 hover:border-brand-blue/20 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-4.5 w-4.5 rounded border border-brand-border" />
                    <span className="text-xs font-semibold text-brand-text">Read Chapter 4 of Economics Book</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[9px] bg-brand-blue/10 text-brand-blue border border-brand-blue/25 px-2 py-0.5 rounded font-bold uppercase">Student</span>
                    <span className="text-[9px] text-brand-muted bg-brand-bg px-2 py-0.5 rounded font-medium">02:30 PM</span>
                  </div>
                </div>

                {/* Priority low/done */}
                <div className="bg-brand-surface/40 border border-brand-border/30 opacity-60 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-4.5 w-4.5 rounded bg-brand-blue border border-brand-blue text-white flex items-center justify-center">
                      <span className="text-[10px] font-black">✓</span>
                    </span>
                    <span className="text-xs text-brand-muted line-through">Review landing page designer feedback</span>
                  </div>
                  <span className="text-[9px] bg-brand-border text-brand-muted px-2 py-0.5 rounded font-bold uppercase">Work</span>
                </div>
              </div>
            </div>

            {/* Right side preview */}
            <div className="space-y-5">
              <div className="bg-brand-surface border border-brand-border/60 rounded-xl p-4.5 space-y-4">
                <p className="text-xs font-bold text-brand-muted tracking-wider uppercase">Upcoming Deadlines</p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">Stats Homework Submission</span>
                      <span className="text-brand-gold bg-brand-gold/10 px-2 py-0.2 rounded border border-brand-gold/15 text-[10px] font-bold">Due in 2 days</span>
                    </div>
                    <div className="h-1 bg-brand-bg rounded-md w-full overflow-hidden">
                      <div className="h-full bg-brand-gold w-3/4" />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">Alpha Launch Presentation</span>
                      <span className="text-brand-blue bg-brand-blue/10 px-2 py-0.2 rounded border border-brand-blue/15 text-[10px] font-bold">Due in 5 days</span>
                    </div>
                    <div className="h-1 bg-brand-bg rounded-md w-full overflow-hidden">
                      <div className="h-full bg-brand-blue w-1/3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decisions shortcut preview */}
              <div className="bg-brand-surface border border-brand-border/60 rounded-xl p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-orange-950/20 border border-orange-900/30 flex items-center justify-center">
                  <GitFork size={15} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-white leading-none">Decision Helper</p>
                  <p className="text-[10px] text-brand-muted mt-1 leading-none">"Should I buy this laptop upgrade?"</p>
                </div>
                <ChevronRight size={13} className="text-brand-muted ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-[#111722]/40 border-t border-b border-brand-border/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold text-brand-blue uppercase tracking-widest">
              Capabilities designed around you
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Everything in single daily overview.
            </p>
            <p className="text-brand-muted text-sm max-w-lg mx-auto">
              Maintain clarity without excessive notification pings, Notion board clones, or charts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-brand-surface border border-brand-border/60 rounded-xl p-6.5 hover:border-brand-blue/30 transition-all duration-300 group">
              <div className="h-10 w-10 rounded-lg bg-brand-blue/15 flex items-center justify-center mb-5 border border-brand-blue/10">
                <Calendar size={18} className="text-brand-blue" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Daily Planner</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Plan what actually matters today. Manage morning, afternoon, and evening timelines with visual simplicity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-brand-surface border border-brand-border/60 rounded-xl p-6.5 hover:border-brand-blue/30 transition-all duration-300 group">
              <div className="h-10 w-10 rounded-lg bg-emerald-950/20 flex items-center justify-center mb-5 border border-emerald-900/20">
                <CheckSquare size={18} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Tasks</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Capture tasks quickly, prioritize into low, normal, and high categories, and track daily completions seamlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-brand-surface border border-brand-border/60 rounded-xl p-6.5 hover:border-brand-blue/30 transition-all duration-300 group">
              <div className="h-10 w-10 rounded-lg bg-rose-950/20 flex items-center justify-center mb-5 border border-rose-900/20">
                <Timer size={18} className="text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Deadline Tracker</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Never lose track of important projects or exams. Watch visual countdown timers and linked action items.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-brand-surface border border-brand-border/60 rounded-xl p-6.5 hover:border-brand-blue/30 transition-all duration-300 group">
              <div className="h-10 w-10 rounded-lg bg-orange-950/20 flex items-center justify-center mb-5 border border-orange-900/20">
                <Layers size={18} className="text-brand-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Life Admin</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Assign categories like student course loads, work targets, and grocery lists to isolate your focuses during the day.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-brand-surface border border-brand-border/60 rounded-xl p-6.5 hover:border-brand-blue/30 transition-all duration-300 group">
              <div className="h-10 w-10 rounded-lg bg-indigo-950/20 flex items-center justify-center mb-5 border border-indigo-900/20">
                <GitFork size={18} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Decisions</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Get structured help when you are unsure what to do. Map out pros, cons, costs, and risks to define clear next actions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-brand-surface border border-brand-border/60 rounded-xl p-6.5 hover:border-brand-blue/30 transition-all duration-300 group">
              <div className="h-10 w-10 rounded-lg bg-teal-950/20 flex items-center justify-center mb-5 border border-teal-900/20">
                <Library size={18} className="text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Personal Knowledge</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Organize saved articles, references, quick thoughts, and important information. Search and access your brain instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-20 md:py-28 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-bold text-brand-gold uppercase tracking-widest">
            A simplified ritual
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Daily command center workflow
          </p>
          <p className="text-brand-muted text-sm max-w-md mx-auto">
            Three simple actions to align your priorities and gain daily peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Border connector lines desktop only */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-brand-blue/30 via-brand-gold/30 to-brand-blue/30 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10 space-y-4">
            <div className="h-14 w-14 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center hover:border-brand-blue/40 transition-colors">
              <span className="font-mono font-bold text-base text-brand-blue">01</span>
            </div>
            <h3 className="font-bold text-white text-md">Capture</h3>
            <p className="text-xs text-brand-muted max-w-xs leading-relaxed">
              Tell DailyDo what is on your plate. Dump quick notes, deadlines, or situations in seconds using the capture interface.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10 space-y-4">
            <div className="h-14 w-14 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center hover:border-brand-gold/40 transition-colors">
              <span className="font-mono font-bold text-base text-brand-gold">02</span>
            </div>
            <h3 className="font-bold text-white text-md">Organize</h3>
            <p className="text-xs text-brand-muted max-w-xs leading-relaxed">
              DailyDo groups items into course deadlines, morning focus segments, and decisions, creating clean priority guides.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10 space-y-4">
            <div className="h-14 w-14 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center hover:border-brand-blue/40 transition-colors">
              <span className="font-mono font-bold text-base text-brand-blue">03</span>
            </div>
            <h3 className="font-bold text-white text-md">Do</h3>
            <p className="text-xs text-brand-muted max-w-xs leading-relaxed">
              Open your dashboard each morning. Focus on the few highlighted gold priorities. Complete tasks and review your timeline.
            </p>
          </div>
        </div>

        {/* CTA section bottom */}
        <div className="mt-20 border border-brand-border/60 bg-brand-surface/40 rounded-2xl py-12 px-6 text-center max-w-4xl mx-auto space-y-5">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to reclaim your day?</h3>
          <p className="text-brand-muted text-sm max-w-md mx-auto leading-relaxed">
            Free forever for personal users. Premium visual themes, collaborative planner rooms, and dashboard views under development.
          </p>
          <div>
            <Link href="/signup">
              <Button variant="primary" size="lg" className="px-8 text-xs font-bold uppercase tracking-wider">
                Claim your DailyDo account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-brand-border/40 py-8 bg-[#04060a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-brand-blue flex items-center justify-center">
              <span className="font-black text-white text-[10px]">D</span>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">DailyDo</span>
          </div>
          <p className="text-xs text-brand-muted">
            &copy; {new Date().getFullYear()} DailyDo Inc. All rights reserved. Global Life Management.
          </p>
          <div className="flex gap-4 text-xs font-medium text-brand-muted">
            <a href="#" className="hover:text-brand-blue">Privacy Policy</a>
            <a href="#" className="hover:text-brand-blue">Terms</a>
            <a href="#" className="hover:text-brand-blue">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
