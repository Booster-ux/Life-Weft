"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#080B12] text-brand-text flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] bg-brand-blue/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-md space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border text-xs text-brand-muted">
                    <Sparkles size={13} className="text-brand-gold" />
                    <span>Page Not Found • 404</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        Lost in the Weft
                    </h1>
                    <p className="text-sm text-brand-muted leading-relaxed">
                        The memory path or page you are looking for does not exist or has moved.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                    <Link href="/dashboard">
                        <Button variant="primary" size="sm" className="font-bold text-xs uppercase tracking-wider px-5">
                            <Home size={14} className="mr-1.5" />
                            Return to Today
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="secondary" size="sm" className="text-xs uppercase tracking-wider px-5">
                            Home Page
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
