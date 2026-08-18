"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { GlobalSearchModal } from "@/components/dashboard/GlobalSearchModal";
import { QuickCaptureModal } from "@/components/dashboard/QuickCaptureModal";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
    const [quickCaptureType, setQuickCaptureType] = useState<"task" | "ledger" | "note" | "deadline" | "decision">("task");

    // Global keyboard shortcuts (Ctrl/Cmd + K for search)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
            }
        };

        const handleOpenSearch = () => setIsSearchOpen(true);
        const handleOpenCapture = (e: Event) => {
            const customEvent = e as CustomEvent<{ type?: "task" | "ledger" | "note" | "deadline" | "decision" }>;
            if (customEvent.detail?.type) {
                setQuickCaptureType(customEvent.detail.type);
            } else {
                setQuickCaptureType("task");
            }
            setIsQuickCaptureOpen(true);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("lw-open-search", handleOpenSearch);
        window.addEventListener("lw-open-quick-capture", handleOpenCapture);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("lw-open-search", handleOpenSearch);
            window.removeEventListener("lw-open-quick-capture", handleOpenCapture);
        };
    }, []);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-brand-bg text-brand-text">
            {/* Mobile Navigation (Top bar + Bottom bar) */}
            <MobileNav
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenQuickCapture={() => {
                    setQuickCaptureType("task");
                    setIsQuickCaptureOpen(true);
                }}
            />

            {/* Desktop Sidebar Navigation */}
            <Sidebar
                className="hidden md:flex flex-shrink-0"
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenQuickCapture={() => {
                    setQuickCaptureType("task");
                    setIsQuickCaptureOpen(true);
                }}
            />

            {/* Main Content Space */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
                <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
                    {children}
                </div>
            </main>

            {/* Universal Global Search Modal (Ctrl/Cmd + K) */}
            <GlobalSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />

            {/* Universal Quick Capture Modal */}
            <QuickCaptureModal
                isOpen={isQuickCaptureOpen}
                onClose={() => setIsQuickCaptureOpen(false)}
                initialType={quickCaptureType}
            />
        </div>
    );
}
