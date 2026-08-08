"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on ESC key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04060b]/80 backdrop-blur-md transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className={cn(
                    "w-full max-w-lg bg-brand-surface border border-brand-border rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden transform scale-95 animate-in fade-in zoom-in-95 duration-200",
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-brand-border">
                    <h3 className="font-semibold text-lg text-brand-text leading-none">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-border transition-colors duration-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 text-sm text-brand-muted leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};
