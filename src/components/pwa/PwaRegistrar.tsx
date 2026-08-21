"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function PwaRegistrar() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Register Service Worker
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then((reg) => {
                        console.log("[Lifeweft PWA] Service Worker registered with scope:", reg.scope);
                    })
                    .catch((err) => {
                        console.error("[Lifeweft PWA] Service Worker registration failed:", err);
                    });
            });
        }

        // Capture 'beforeinstallprompt' for installable browsers
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            const promptEvent = e as BeforeInstallPromptEvent;
            setInstallPrompt(promptEvent);

            const hasDismissed = localStorage.getItem("lifeweft_pwa_dismissed");
            if (!hasDismissed) {
                setShowInstallBanner(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;
        setShowInstallBanner(false);
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === "accepted") {
            setInstallPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowInstallBanner(false);
        setIsDismissed(true);
        try {
            localStorage.setItem("lifeweft_pwa_dismissed", "true");
        } catch {
            // Ignore localStorage errors
        }
    };

    if (!showInstallBanner || isDismissed) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-brand-surface/95 backdrop-blur-md border border-brand-blue/30 rounded-xl p-4 shadow-2xl flex items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue flex-shrink-0">
                        <Download size={20} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-xs font-bold tracking-tight text-white">Install Lifeweft App</h4>
                        <p className="text-[11px] text-brand-muted truncate">Fast access & offline focus</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={handleInstall}
                        className="px-3 py-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                        Install
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="p-1 text-brand-muted hover:text-white rounded-md transition-colors cursor-pointer"
                        title="Dismiss"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
